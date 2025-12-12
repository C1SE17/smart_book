const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Book = require('../models/Book');

// Use existing mongoose connection from config/mongodb.js
const mongo = require('../config/mongodb');

function extractUserId(decoded) {
  if (!decoded || typeof decoded !== 'object') return null;
  return (
    decoded.userId ||
    decoded.user_id ||
    decoded.id ||
    decoded.sub ||
    (decoded.user && (decoded.user.user_id || decoded.user.id || decoded.user.userId)) ||
    null
  );
}

class RecommendationController {
  static async mergeProfilesScores(db, fromKey, toKey) {
    if (!fromKey || !toKey || fromKey === toKey) return null;
    const profiles = db.collection('profiles');
    const recos = db.collection('recommendations');
    const from = await profiles.findOne({ key: fromKey });
    if (!from || !from.scores) return null;
    // Upsert to target by summing scores
    const incDoc = {};
    for (const [pid, sc] of Object.entries(from.scores)) {
      incDoc[`scores.${pid}`] = sc;
    }
    await profiles.updateOne(
      { key: toKey },
      { $setOnInsert: { key: toKey, createdAt: new Date() }, $set: { updatedAt: new Date() }, $inc: incDoc },
      { upsert: true }
    );
    // Recompute recommendations for target
    const tgt = await profiles.findOne({ key: toKey });
    const entries = Object.entries((tgt && tgt.scores) || {}).sort((a,b)=>b[1]-a[1]);
    const product_ids = entries.slice(0, 100).map(([id])=>parseInt(id,10)).slice(0, 25);
    await recos.updateOne(
      { key: toKey },
      { $set: { key: toKey, recommendations: { product_ids, category_ids: [] }, createdAt: new Date() } },
      { upsert: true }
    );
    return { product_ids };
  }
  // Tính điểm từ dữ liệu tracking cho user/session cụ thể (real-time)
  static async calculateTrackingScores({ userId, sessionId, windowDays = 90 }) {
    const scores = {};
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
    
    try {
      // Build query để lọc theo userId hoặc sessionId
      const query = { timestamp: { $gte: since } };
      if (userId) {
        query.userId = String(userId);
      } else if (sessionId) {
        query.sessionId = String(sessionId);
      } else {
        return scores; // Không có userId hoặc sessionId thì không tính
      }

      console.log(`[RecommendationController] calculateTrackingScores: userId=${userId || 'N/A'}, sessionId=${sessionId || 'N/A'}`);

      // 1. ProductTracks - Xem sản phẩm (điểm dựa trên viewDuration)
      const ProductTracks = mongo.connection.collection('producttracks');
      const productViews = await ProductTracks.aggregate([
        { $match: query },
        { $group: { 
          _id: '$productId', 
          totalViews: { $sum: 1 },
          avgDuration: { $avg: '$viewDuration' },
          totalDuration: { $sum: '$viewDuration' }
        }},
        { $project: { 
          _id: 0, 
          productId: '$_id',
          score: { 
            $add: [
              { $multiply: ['$totalViews', 0.5] }, // Mỗi lần xem = 0.5 điểm
              { $multiply: [{ $divide: [{ $ifNull: ['$avgDuration', 0] }, 60] }, 1.0] } // Mỗi phút xem = 1 điểm
            ]
          }
        }}
      ]).toArray();

      for (const item of productViews) {
        const bookId = String(item.productId);
        scores[bookId] = (scores[bookId] || 0) + item.score;
      }
      console.log(`[RecommendationController] ProductTracks: ${productViews.length} books`);

      // 2. CartTracks - Thao tác giỏ hàng
      const CartTracks = mongo.connection.collection('carttracks');
      const cartActions = await CartTracks.aggregate([
        { $match: query },
        { $group: { 
          _id: { productId: '$productId', action: '$action' },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }},
        { $project: {
          _id: 0,
          productId: '$_id.productId',
          action: '$_id.action',
          count: 1,
          totalQuantity: 1,
          score: {
            $cond: {
              if: { $eq: ['$_id.action', 'add'] },
              then: { $multiply: ['$totalQuantity', 3.0] }, // Thêm vào giỏ = 3 điểm/quantity
              else: { $multiply: ['$count', -1.0] } // Xóa khỏi giỏ = -1 điểm
            }
          }
        }}
      ]).toArray();

      for (const item of cartActions) {
        const bookId = String(item.productId);
        scores[bookId] = (scores[bookId] || 0) + item.score;
      }
      console.log(`[RecommendationController] CartTracks: ${cartActions.length} actions`);

      // 3. PurchaseTracks - Mua hàng (điểm cao nhất)
      const PurchaseTracks = mongo.connection.collection('purchasetracks');
      const purchases = await PurchaseTracks.aggregate([
        { $match: query },
        { $group: { 
          _id: '$productId',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }},
        { $project: {
          _id: 0,
          productId: '$_id',
          score: { $multiply: ['$totalQuantity', 5.0] } // Mua hàng = 5 điểm/quantity
        }}
      ]).toArray();

      for (const item of purchases) {
        const bookId = String(item.productId);
        scores[bookId] = (scores[bookId] || 0) + item.score;
      }
      console.log(`[RecommendationController] PurchaseTracks: ${purchases.length} purchases`);

      console.log(`[RecommendationController] calculateTrackingScores: Total ${Object.keys(scores).length} books with scores`);
      return scores;
    } catch (error) {
      console.error('[RecommendationController] Error calculating tracking scores:', error);
      return scores;
    }
  }

  static async fallbackTrendingProducts({ limit = 10, windowDays = 30 } = {}) {
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
    const ProductTracks = mongo.connection.collection('producttracks');
    const agg = await ProductTracks.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: '$productId', views: { $sum: 1 }, dwell: { $avg: '$viewDuration' } } },
      { $project: { _id: 0, productId: '$_id', score: { $add: ['$views', { $multiply: [{ $ifNull: ['$dwell', 0] }, 0.02] }] } } },
      { $sort: { score: -1 } },
      { $limit: limit }
    ]).toArray();
    const ids = agg.map(x => parseInt(String(x.productId), 10)).filter(n => !isNaN(n));
    const books = await Book.getByIds(ids);
    return { product_ids: ids, products: books };
  }

  static shuffleArray(list = []) {
    const arr = Array.isArray(list) ? [...list] : [];
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  static pickUniqueRandom(candidates = [], limit, excludeSet) {
    if (!Array.isArray(candidates) || !candidates.length || limit <= 0) return [];
    const exclude = excludeSet || new Set();
    const shuffled = RecommendationController.shuffleArray(candidates);
    const result = [];
    for (const book of shuffled) {
      if (!book || !book.book_id) continue;
      if (exclude.has(book.book_id)) continue;
      exclude.add(book.book_id);
      result.push(book);
      if (result.length >= limit) break;
    }
    return result;
  }

  static async collectGroupFromAnchors({ anchors = [], excludeSet, limit, fetchFn }) {
    if (!Array.isArray(anchors) || anchors.length === 0 || typeof fetchFn !== 'function') {
      return [];
    }
    const candidates = [];
    for (const anchor of anchors) {
      try {
        const items = await fetchFn(anchor, Array.from(excludeSet || []));
        if (!Array.isArray(items)) continue;
        for (const book of items) {
          if (!book || !book.book_id) continue;
          if (book.book_id === anchor.book_id) continue;
          candidates.push(book);
        }
      } catch (err) {
        console.error('[RecommendationController] collectGroupFromAnchors fetch error:', err);
      }
    }
    return RecommendationController.pickUniqueRandom(candidates, limit, excludeSet);
  }

  static async collectSimilarGroup({ anchors, excludeSet, limit }) {
    return RecommendationController.collectGroupFromAnchors({
      anchors,
      excludeSet,
      limit,
      fetchFn: (anchor, excludeIds) => {
        if (!anchor || !anchor.category_id) return [];
        return Book.findByCategoryId(anchor.category_id, {
          excludeIds,
          limit: Math.max(limit * 3, 15)
        });
      }
    });
  }

  static async collectAuthorGroup({ anchors, excludeSet, limit }) {
    const authorAnchors = Array.isArray(anchors)
      ? anchors.filter((anchor) => anchor && anchor.author_id)
      : [];
    return RecommendationController.collectGroupFromAnchors({
      anchors: authorAnchors,
      excludeSet,
      limit,
      fetchFn: (anchor, excludeIds) => Book.findByAuthorId(anchor.author_id, {
        excludeIds,
        limit: Math.max(limit * 3, 15)
      })
    });
  }

  static async collectPublisherGroup({ anchors, excludeSet, limit }) {
    const publisherAnchors = Array.isArray(anchors)
      ? anchors.filter((anchor) => anchor && anchor.publisher_id)
      : [];
    return RecommendationController.collectGroupFromAnchors({
      anchors: publisherAnchors,
      excludeSet,
      limit,
      fetchFn: (anchor, excludeIds) => Book.findByPublisherId(anchor.publisher_id, {
        excludeIds,
        limit: Math.max(limit * 3, 15)
      })
    });
  }

  static async collectGenreGroup({ anchors, entries, metaMap, excludeSet, limit }) {
    if (!Array.isArray(entries) || entries.length === 0) return [];

    const categoryScores = new Map();
    for (const entry of entries.slice(0, 60)) {
      const book = metaMap.get(entry.bookId);
      if (!book || !book.category_id) continue;
      categoryScores.set(book.category_id, (categoryScores.get(book.category_id) || 0) + entry.score);
    }

    const anchorCategories = new Set(
      (anchors || []).map((anchor) => anchor.category_id).filter((cid) => cid !== null && cid !== undefined)
    );

    const rankedCategoryIds = [...categoryScores.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cid]) => cid)
      .filter((cid) => cid && !anchorCategories.has(cid));

    const candidates = [];
    for (const catId of rankedCategoryIds) {
      try {
        const chunk = await Book.findByCategoryId(catId, {
          excludeIds: Array.from(excludeSet || []),
          limit: Math.max(limit * 3, 15)
        });
        for (const book of chunk) {
          if (!book || !book.book_id) continue;
          candidates.push(book);
        }
        if (candidates.length >= limit * 4) break;
      } catch (err) {
        console.error('[RecommendationController] collectGenreGroup fetch error:', err);
      }
    }

    return RecommendationController.pickUniqueRandom(candidates, limit, excludeSet);
  }

  static interleaveGroups(groups, limit) {
    if (!Array.isArray(groups) || groups.length === 0) return [];
    const working = groups
      .filter((group) => Array.isArray(group.items) && group.items.length > 0)
      .map((group) => ({
        name: group.name,
        queue: RecommendationController.shuffleArray(group.items)
      }));

    const result = [];
    while (result.length < limit) {
      let moved = false;
      for (const group of working) {
        if (!group.queue.length) continue;
        const item = group.queue.shift();
        if (item) {
          result.push(item);
          moved = true;
        }
        if (result.length >= limit) break;
      }
      if (!moved) break;
    }
    return result;
  }

  // Lấy sách đã mua số lượng lớn từ PurchaseTrack
  static async getLargeQuantityPurchases(userId) {
    try {
      if (!userId) {
        console.log('[RecommendationController] getLargeQuantityPurchases: No userId');
        return [];
      }
      console.log(`[RecommendationController] getLargeQuantityPurchases: userId=${userId}`);
      const PurchaseTrack = mongo.connection.collection('purchasetracks');
      const purchases = await PurchaseTrack.find(
        { userId: String(userId) },
        { sort: { timestamp: -1 }, limit: 10 }
      ).toArray();
      
      console.log(`[RecommendationController] Tìm thấy ${purchases.length} purchases cho userId=${userId}`);
      
      // Nhóm theo productId và lấy quantity lớn nhất
      const purchaseMap = new Map();
      for (const purchase of purchases) {
        const productId = Number(purchase.productId);
        if (!Number.isFinite(productId)) continue;
        const existing = purchaseMap.get(productId);
        if (!existing || purchase.quantity > existing.quantity) {
          purchaseMap.set(productId, {
            bookId: productId,
            quantity: purchase.quantity,
            productName: purchase.productName
          });
        }
      }
      
      const result = Array.from(purchaseMap.values()).sort((a, b) => b.quantity - a.quantity);
      console.log(`[RecommendationController] getLargeQuantityPurchases result: ${result.length} sách`, result.map(p => `bookId=${p.bookId}, qty=${p.quantity}`));
      return result;
    } catch (error) {
      console.error('[RecommendationController] getLargeQuantityPurchases error:', error);
      console.error('[RecommendationController] Stack trace:', error.stack);
      return [];
    }
  }

  // Tạo recommendations từ sách đã mua số lượng lớn
  static async buildRecommendationsFromPurchases(largePurchases, limit = 20) {
    try {
      if (!largePurchases || largePurchases.length === 0) return null;

      // Lấy thông tin sách đã mua
      const purchasedBookIds = largePurchases.map(p => p.bookId);
      const purchasedBooks = await Book.getByIds(purchasedBookIds);
      const purchasedBooksMap = new Map(purchasedBooks.map(book => [book.book_id, book]));

      const anchors = [];
      const excludeSet = new Set();
      
      // Thêm sách đã mua vào anchors (ưu tiên hiển thị)
      for (const purchase of largePurchases.slice(0, 3)) {
        const book = purchasedBooksMap.get(purchase.bookId);
        if (book) {
          anchors.push({ ...book, score: purchase.quantity * 10 });
          excludeSet.add(book.book_id);
        }
      }

      if (anchors.length === 0) return null;

      const bucketLimit = Math.min(5, Math.max(1, Math.floor(limit / 4)));

      // Tìm sách liên quan
      const similar = await RecommendationController.collectSimilarGroup({
        anchors,
        excludeSet,
        limit: bucketLimit
      });

      const author = await RecommendationController.collectAuthorGroup({
        anchors,
        excludeSet,
        limit: bucketLimit
      });

      const publisher = await RecommendationController.collectPublisherGroup({
        anchors,
        excludeSet,
        limit: bucketLimit
      });

      // Tạo entries từ anchors để collectGenreGroup
      const entries = anchors.map(anchor => ({
        bookId: anchor.book_id,
        score: anchor.score || 0
      }));
      const metaMap = new Map(anchors.map(anchor => [anchor.book_id, anchor]));

      const genre = await RecommendationController.collectGenreGroup({
        anchors,
        entries,
        metaMap,
        excludeSet,
        limit: bucketLimit
      });

      const groups = [
        { name: 'purchased', items: anchors }, // Ưu tiên hiển thị sách đã mua
        { name: 'similar', items: similar },
        { name: 'genre', items: genre },
        { name: 'author', items: author },
        { name: 'publisher', items: publisher }
      ].filter((group) => Array.isArray(group.items) && group.items.length > 0);

      let recommendations = RecommendationController.interleaveGroups(groups, limit);

      // Nếu chưa đủ, thêm sách đã mua vào đầu
      const usedSet = new Set(recommendations.map(r => r?.book_id).filter(Boolean));
      const finalRecommendations = [];
      
      // Thêm sách đã mua vào đầu danh sách
      for (const anchor of anchors) {
        if (!usedSet.has(anchor.book_id)) {
          finalRecommendations.push(anchor);
          usedSet.add(anchor.book_id);
        }
      }
      
      // Thêm các recommendations khác
      for (const rec of recommendations) {
        if (rec && !usedSet.has(rec.book_id)) {
          finalRecommendations.push(rec);
          usedSet.add(rec.book_id);
        }
        if (finalRecommendations.length >= limit) break;
      }

      // Nếu vẫn chưa đủ, thêm fallback
      if (finalRecommendations.length < limit) {
        const fb = await RecommendationController.fallbackTrendingProducts({ 
          limit: limit - finalRecommendations.length 
        });
        for (const book of fb.products) {
          if (usedSet.has(book.book_id)) continue;
          finalRecommendations.push(book);
          usedSet.add(book.book_id);
          if (finalRecommendations.length >= limit) break;
        }
      }

      if (finalRecommendations.length === 0) return null;

      return {
        strategy: 'large_quantity_purchases',
        anchors,
        groups: groups.map((group) => ({ name: group.name, size: group.items.length })),
        products: finalRecommendations.slice(0, limit),
        productIds: finalRecommendations.slice(0, limit).map((book) => book.book_id)
      };
    } catch (error) {
      console.error('[RecommendationController] buildRecommendationsFromPurchases error:', error);
      return null;
    }
  }

  static async buildDynamicRecommendations({ key, limit = 20 }) {
    try {
      const Profiles = mongo.connection.collection('profiles');
      const profile = await Profiles.findOne({ key });

      // Extract userId và sessionId từ key
      let userId = null;
      let sessionId = null;
      if (key && key.startsWith('user:')) {
        userId = key.replace('user:', '');
      } else {
        sessionId = key;
      }

      console.log(`[RecommendationController] buildDynamicRecommendations: key=${key}, userId=${userId || 'N/A'}, sessionId=${sessionId || 'N/A'}`);

      // Đọc dữ liệu tracking trực tiếp từ MongoDB để tính điểm real-time
      const trackingScores = await RecommendationController.calculateTrackingScores({ userId, sessionId });
      console.log(`[RecommendationController] Tracking scores calculated: ${Object.keys(trackingScores).length} books`);

      // Lấy sách đã mua số lượng lớn
      const largePurchases = userId ? await RecommendationController.getLargeQuantityPurchases(userId) : [];
      console.log(`[RecommendationController] Large purchases: ${largePurchases.length}`);
      
      // Merge tracking scores với profile scores
      let finalScores = {};
      
      // Bắt đầu với profile scores nếu có
      if (profile && profile.scores) {
        finalScores = { ...profile.scores };
        console.log(`[RecommendationController] Loaded ${Object.keys(finalScores).length} scores from profile`);
      }
      
      // Merge tracking scores (ưu tiên tracking vì là real-time)
      for (const [bookId, score] of Object.entries(trackingScores)) {
        const currentScore = finalScores[bookId] || 0;
        finalScores[bookId] = currentScore + score; // Cộng dồn điểm
      }
      console.log(`[RecommendationController] After merging tracking: ${Object.keys(finalScores).length} total scores`);

      // Tăng score cho sách đã mua số lượng lớn
      if (largePurchases.length > 0) {
        console.log(`[RecommendationController] Tăng score cho ${largePurchases.length} sách đã mua số lượng lớn`);
        for (const purchase of largePurchases) {
          const bookIdStr = String(purchase.bookId);
          const currentScore = finalScores[bookIdStr] || 0;
          // Tăng score dựa trên quantity (quantity * 10 để có trọng số cao)
          finalScores[bookIdStr] = currentScore + (purchase.quantity * 10);
          console.log(`[RecommendationController] Tăng score cho bookId=${bookIdStr}: ${currentScore} -> ${finalScores[bookIdStr]}`);
        }
      }

      // Nếu không có scores nào, thử fallback
      if (Object.keys(finalScores).length === 0) {
        // Nếu không có profile nhưng có large purchases, tạo recommendations từ purchases
        if (largePurchases.length > 0) {
          return await RecommendationController.buildRecommendationsFromPurchases(largePurchases, limit);
        }
        // Nếu có tracking scores nhưng chưa có trong finalScores, sử dụng tracking scores
        if (Object.keys(trackingScores).length > 0) {
          finalScores = trackingScores;
          console.log(`[RecommendationController] Using tracking scores only: ${Object.keys(finalScores).length} books`);
        } else {
          return null;
        }
      }

      const entries = Object.entries(finalScores)
        .map(([bookId, score]) => ({
          bookId: Number(bookId),
          score: Number(score)
        }))
        .filter((item) => Number.isFinite(item.bookId) && Number.isFinite(item.score) && item.score > 0)
        .sort((a, b) => b.score - a.score);
      
      console.log(`[RecommendationController] Final entries: ${entries.length} books with scores`);

      if (!entries.length) {
        // Nếu không có entries nhưng có large purchases, tạo recommendations từ purchases
        if (largePurchases.length > 0) {
          return await RecommendationController.buildRecommendationsFromPurchases(largePurchases, limit);
        }
        return null;
      }

      const candidateIds = entries.slice(0, 60).map((item) => item.bookId);
      const metaList = candidateIds.length ? await Book.getByIds(candidateIds) : [];
      const metaMap = new Map(metaList.map((book) => [book.book_id, book]));

      // Ưu tiên thêm sách đã mua số lượng lớn vào anchors
      const anchors = [];
      const purchasedBookIds = new Set(largePurchases.map(p => p.bookId));
      
      // Thêm sách đã mua số lượng lớn vào anchors trước
      for (const purchase of largePurchases.slice(0, 2)) {
        let meta = metaMap.get(purchase.bookId);
        if (!meta) {
          meta = await Book.getById(purchase.bookId);
          if (meta) {
            metaMap.set(purchase.bookId, meta);
          }
        }
        if (meta) {
          anchors.push({ ...meta, score: purchase.quantity * 10 });
        }
      }

      // Thêm các sách khác từ entries
      for (const entry of entries) {
        if (anchors.length >= 3) break;
        if (purchasedBookIds.has(entry.bookId)) continue; // Đã thêm ở trên
        let meta = metaMap.get(entry.bookId);
        if (!meta) {
          meta = await Book.getById(entry.bookId);
          if (meta) {
            metaMap.set(entry.bookId, meta);
          }
        }
        if (meta) {
          anchors.push({ ...meta, score: entry.score });
        }
      }

      if (!anchors.length) {
        return null;
      }

      const excludeSet = new Set(anchors.map((anchor) => anchor.book_id));
      const bucketLimit = Math.min(5, Math.max(1, Math.floor(limit / 4)));

      const similar = await RecommendationController.collectSimilarGroup({
        anchors,
        excludeSet,
        limit: bucketLimit
      });

      const genre = await RecommendationController.collectGenreGroup({
        anchors,
        entries,
        metaMap,
        excludeSet,
        limit: bucketLimit
      });

      const author = await RecommendationController.collectAuthorGroup({
        anchors,
        excludeSet,
        limit: bucketLimit
      });

      const publisher = await RecommendationController.collectPublisherGroup({
        anchors,
        excludeSet,
        limit: bucketLimit
      });

      // Thêm sách đã mua số lượng lớn vào đầu danh sách groups
      const purchasedBooks = [];
      for (const purchase of largePurchases.slice(0, 3)) {
        const book = metaMap.get(purchase.bookId);
        if (book && !excludeSet.has(book.book_id)) {
          purchasedBooks.push(book);
        }
      }
      console.log(`[RecommendationController] Thêm ${purchasedBooks.length} sách đã mua số lượng lớn vào recommendations`);

      const groups = [
        { name: 'purchased', items: purchasedBooks }, // Ưu tiên hiển thị sách đã mua
        { name: 'similar', items: similar },
        { name: 'genre', items: genre },
        { name: 'author', items: author },
        { name: 'publisher', items: publisher }
      ].filter((group) => Array.isArray(group.items) && group.items.length > 0);
      
      console.log(`[RecommendationController] Groups: ${groups.map(g => `${g.name}=${g.items.length}`).join(', ')}`);

      let recommendations = RecommendationController.interleaveGroups(groups, limit);

      const usedSet = new Set([...excludeSet]);
      for (const book of recommendations) {
        if (book && book.book_id) {
          usedSet.add(book.book_id);
        }
      }

      if (recommendations.length < limit) {
        for (const entry of entries) {
          const meta = metaMap.get(entry.bookId);
          if (!meta || usedSet.has(meta.book_id)) continue;
          recommendations.push(meta);
          usedSet.add(meta.book_id);
          if (recommendations.length >= limit) break;
        }
      }

      if (recommendations.length < limit) {
        const fb = await RecommendationController.fallbackTrendingProducts({ limit: limit - recommendations.length });
        for (const book of fb.products) {
          if (usedSet.has(book.book_id)) continue;
          recommendations.push(book);
          usedSet.add(book.book_id);
          if (recommendations.length >= limit) break;
        }
      }

      if (!recommendations.length) {
        return null;
      }

      const finalProducts = recommendations.slice(0, limit);

      return {
        strategy: 'dynamic_profile_top3',
        anchors,
        groups: groups.map((group) => ({ name: group.name, size: group.items.length })),
        products: finalProducts,
        productIds: finalProducts.map((book) => book.book_id)
      };
    } catch (error) {
      console.error('[RecommendationController] buildDynamicRecommendations error:', error);
      return null;
    }
  }

  // Kiểm tra xem có dữ liệu tracking cho userId/sessionId không
  static async hasTrackingData({ userId, sessionId, windowDays = 90 }) {
    try {
      const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
      const query = { timestamp: { $gte: since } };
      
      if (userId) {
        query.userId = String(userId);
      } else if (sessionId) {
        query.sessionId = String(sessionId);
      } else {
        return false;
      }

      // Kiểm tra trong các collection tracking
      const ProductTracks = mongo.connection.collection('producttracks');
      const CartTracks = mongo.connection.collection('carttracks');
      const PurchaseTracks = mongo.connection.collection('purchasetracks');
      const RecommendationFeedbacks = mongo.connection.collection('recommendation_feedbacks');

      // Kiểm tra ít nhất một collection có data
      const [hasProductTracks, hasCartTracks, hasPurchaseTracks, hasFeedbacks] = await Promise.all([
        ProductTracks.countDocuments(query).then(count => count > 0),
        CartTracks.countDocuments(query).then(count => count > 0),
        PurchaseTracks.countDocuments(query).then(count => count > 0),
        RecommendationFeedbacks.countDocuments({ 
          ...query, 
          occurredAt: { $gte: since } 
        }).then(count => count > 0)
      ]);

      const hasData = hasProductTracks || hasCartTracks || hasPurchaseTracks || hasFeedbacks;
      console.log(`[RecommendationController] hasTrackingData: userId=${userId || 'N/A'}, sessionId=${sessionId || 'N/A'}, hasData=${hasData}`);
      return hasData;
    } catch (error) {
      console.error('[RecommendationController] Error checking tracking data:', error);
      return false;
    }
  }

  static async getRecommendedProducts(req, res) {
    try {
      const { sessionId, userId, limit } = req.query;
      
      // Ưu tiên sử dụng userId từ query hoặc token để đảm bảo mỗi user có recommendations riêng
      let userKeyFromToken = null;
      let key = null;
      let extractedUserId = null;
      let extractedSessionId = null;

      // Ưu tiên 1: Lấy userId từ query parameter
      if (userId) {
        extractedUserId = userId;
        key = `user:${userId}`;
        console.log(`[RecommendationController] Sử dụng userId từ query: ${userId}`);
      }

      // Ưu tiên 2: Lấy userId từ Authorization Bearer token
      if (!key) {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
            const uid = extractUserId(decoded);
            if (uid) {
              extractedUserId = uid;
              userKeyFromToken = `user:${uid}`;
              key = userKeyFromToken;
              console.log(`[RecommendationController] Sử dụng userId từ token: ${uid}`);
            }
          } catch (_) {
            try {
              const decoded = jwt.decode(token);
              const uid = extractUserId(decoded);
              if (uid) {
                extractedUserId = uid;
                userKeyFromToken = `user:${uid}`;
                key = userKeyFromToken;
                console.log(`[RecommendationController] Sử dụng userId từ decoded token: ${uid}`);
              }
            } catch (_) {}
          }
        }
      }

      // Fallback: Nếu không có userId, sử dụng sessionId (cho user chưa đăng nhập)
      if (!key && sessionId) {
        extractedSessionId = sessionId;
        key = sessionId;
        console.log(`[RecommendationController] Sử dụng sessionId: ${sessionId}`);
      }

      // Nếu có cả sessionId và userKey, merge session => user để tránh mất lịch sử
      if (sessionId && userKeyFromToken && sessionId !== userKeyFromToken) {
        console.log(`[RecommendationController] Merge session ${sessionId} => user ${userKeyFromToken}`);
        await RecommendationController.mergeProfilesScores(mongo.connection, sessionId, userKeyFromToken);
        key = userKeyFromToken;
        extractedUserId = userKeyFromToken.replace('user:', '');
      }
      
      if (!key) {
        // Không có userId hoặc sessionId, trả về empty
        return res.json({ 
          success: true, 
          data: { 
            key: null,
            product_ids: [], 
            products: [],
            hasTrackingData: false,
            message: 'Chưa có dữ liệu tracking để tạo recommendations'
          } 
        });
      }
      
      console.log(`[RecommendationController] getRecommendedProducts: key=${key}, userId=${extractedUserId || 'N/A'}, sessionId=${extractedSessionId || 'N/A'}`);

      // Kiểm tra xem có dữ liệu tracking không
      const hasData = await RecommendationController.hasTrackingData({ 
        userId: extractedUserId, 
        sessionId: extractedSessionId 
      });

      if (!hasData) {
        // Không có dữ liệu tracking, trả về empty
        console.log(`[RecommendationController] Không có dữ liệu tracking cho key=${key}`);
        return res.json({ 
          success: true, 
          data: { 
            key,
            product_ids: [], 
            products: [],
            hasTrackingData: false,
            message: 'Chưa có dữ liệu tracking để tạo recommendations. Hãy xem sản phẩm, thêm vào giỏ hoặc mua hàng để nhận recommendations cá nhân hóa.'
          } 
        });
      }

      const limitNumber = Math.max(1, parseInt(limit || '20'));
      const dynamic = await RecommendationController.buildDynamicRecommendations({ key, limit: limitNumber });

      if (dynamic && dynamic.products && dynamic.products.length) {
        return res.json({
          success: true,
          data: {
            key,
            product_ids: dynamic.productIds,
            products: dynamic.products,
            strategy: dynamic.strategy || 'dynamic_profile_top3',
            hasTrackingData: true
          }
        });
      }

      const Recommendations = mongo.connection.collection('recommendations');
      const doc = await Recommendations.findOne({ key }, { sort: { createdAt: -1 } });

      const productIds = (doc && doc.recommendations && Array.isArray(doc.recommendations.product_ids))
        ? doc.recommendations.product_ids
        : [];

      const top = productIds.slice(0, limitNumber);

      if (top.length === 0) {
        // Không có recommendations từ cache, nhưng đã có tracking data
        // Vẫn trả về empty thay vì fallback trending để đảm bảo cá nhân hóa
        console.log(`[RecommendationController] Có tracking data nhưng chưa có recommendations, cần chạy training`);
        return res.json({ 
          success: true, 
          data: { 
            key,
            product_ids: [], 
            products: [],
            hasTrackingData: true,
            message: 'Đang xử lý dữ liệu tracking để tạo recommendations. Vui lòng thử lại sau.'
          } 
        });
      }

      const books = await Book.getByIds(top);
      return res.json({ 
        success: true, 
        data: { 
          key, 
          product_ids: top, 
          products: books, 
          strategy: 'legacy_cached',
          hasTrackingData: true
        } 
      });
    } catch (e) {
      console.error('[RecommendationController] getRecommendedProducts error:', e);
      return res.status(500).json({ success: false, message: e.message });
    }
  }

  static async getRecommendedCategories(req, res) {
    try {
      const { sessionId, userId, limit } = req.query;
      let key = sessionId || (userId ? `user:${userId}` : null);
      if (!key) {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
            if (decoded && decoded.userId) key = `user:${decoded.userId}`;
          } catch (_) {}
        }
      }
      if (!key) return res.status(400).json({ success: false, message: 'Thiếu sessionId hoặc userId' });

      const Recommendations = mongo.connection.collection('recommendations');
      const doc = await Recommendations.findOne({ key }, { sort: { createdAt: -1 } });
      const productIds = (doc && doc.recommendations && Array.isArray(doc.recommendations.product_ids)) ? doc.recommendations.product_ids : [];
      const top = productIds.slice(0, Math.max(1, parseInt(limit || '12')));

      let books = [];
      if (top.length > 0) {
        books = await Book.getByIds(top);
      } else {
        const fb = await RecommendationController.fallbackTrendingProducts({ limit: Math.max(1, parseInt(limit || '12')) });
        books = fb.products;
      }

      // Tính top category từ danh sách sách
      const counts = new Map();
      for (const b of books) {
        const cid = b.category_id;
        if (!cid) continue;
        counts.set(cid, (counts.get(cid) || 0) + 1);
      }
      const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([cid]) => cid);
      return res.json({ success: true, data: { key, category_ids: ranked.slice(0, 10) } });
    } catch (e) {
      return res.status(500).json({ success: false, message: e.message });
    }
  }
}

module.exports = RecommendationController;


