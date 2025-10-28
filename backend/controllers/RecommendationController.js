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

  static async getRecommendedProducts(req, res) {
    try {
      const { sessionId, userId, limit } = req.query;
      let key = sessionId || (userId ? `user:${userId}` : null);
      let userKeyFromToken = null;

      // Fallback: nếu có Authorization Bearer thì suy ra userId từ token
      if (!key) {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.split(' ')[1];
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
            const uid = extractUserId(decoded);
            if (uid) {
              userKeyFromToken = `user:${uid}`;
              if (!key) key = userKeyFromToken;
            }
          } catch (_) {
            try {
              const decoded = jwt.decode(token);
              const uid = extractUserId(decoded);
              if (uid) {
                userKeyFromToken = `user:${uid}`;
                if (!key) key = userKeyFromToken;
              }
            } catch (_) {}
          }
        }
      }

      // Nếu có cả sessionId và token (userKey), tự động merge session => user để tránh mất lịch sử
      if (sessionId && userKeyFromToken && sessionId !== userKeyFromToken) {
        await RecommendationController.mergeProfilesScores(mongo.connection, sessionId, userKeyFromToken);
        key = userKeyFromToken;
      }
      if (!key) {
        return res.status(400).json({ success: false, message: 'Thiếu sessionId hoặc userId' });
      }

      const Recommendations = mongo.connection.collection('recommendations');
      const doc = await Recommendations.findOne({ key }, { sort: { createdAt: -1 } });

      const productIds = (doc && doc.recommendations && Array.isArray(doc.recommendations.product_ids))
        ? doc.recommendations.product_ids
        : [];

      const top = productIds.slice(0, Math.max(1, parseInt(limit || '10')));

      if (top.length === 0) {
        const fb = await RecommendationController.fallbackTrendingProducts({ limit: Math.max(1, parseInt(limit || '10')) });
        return res.json({ success: true, data: { key, product_ids: fb.product_ids, products: fb.products, fallback: true } });
      }

      const books = await Book.getByIds(top);
      return res.json({ success: true, data: { key, product_ids: top, products: books } });
    } catch (e) {
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


