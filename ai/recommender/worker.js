/*
  Recommender Worker
  --------------------------------------------
  Mục tiêu chỉnh sửa theo yêu cầu:
  1) Tài khoản mới (vừa đăng ký) hoặc người dùng chưa có dữ liệu hành vi
     => KHÔNG ghi đề xuất (recommendations) cho tới khi có dữ liệu.
  2) Chỉnh phần ghi nhận hành vi: click/xem sản phẩm (producttracks) và thao tác giỏ hàng (carttracks).
     Nếu có thêm sự kiện đặt hàng (ordertracks) trong tương lai, sẽ cộng điểm mạnh hơn.

  Luồng hoạt động:
  - Lắng nghe Change Streams của MongoDB ở các collection: searchtracks/producttracks/carttracks
    (và ordertracks nếu có).
  - Duy trì điểm số hồ sơ hành vi (profiles) theo từng khoá key (sessionId hoặc user:USER_ID).
  - Chỉ ghi bản ghi đề xuất (recommendations) khi đã có điểm số thực sự (scores tồn tại và > 0).
  - Ghi chú: Worker chỉ chỉnh trong thư mục ai/recommender, không thay đổi backend.
*/
console.log('[reco-cfg]', require('./config'));
const { MongoClient } = require('mongodb');
const cfg = require('./config');

// Tính điểm cho từng sự kiện để phục vụ xếp hạng đề xuất
function computeIncrement(e) {
  const doc = e.fullDocument || {};
  if (e.ns && e.ns.coll === 'producttracks') {
    const dwell = Number(doc.viewDuration || 0);
    return cfg.VIEW_WEIGHT + cfg.DWELL_WEIGHT_PER_SEC * dwell;
  }
  if (e.ns && e.ns.coll === 'carttracks') {
    const action = doc.action;
    if (action === 'add') return cfg.ADD_TO_CART_WEIGHT;
    if (action === 'update') return cfg.UPDATE_WEIGHT;
    if (action === 'remove') return cfg.REMOVE_WEIGHT;
  }
  // Nếu sau này có collection ordertracks (ghi nhận đặt hàng): cộng trọng số mạnh hơn
  if (e.ns && e.ns.coll === 'ordertracks') {
    // Ví dụ: mỗi đơn hàng cho productId tương ứng sẽ cộng điểm ORDER_WEIGHT
    return cfg.ORDER_WEIGHT || 0;
  }
  return 0;
}

// Ghi nhận bộ đếm hành vi (checking lượt click/tìm kiếm/giỏ hàng/đặt hàng)
function computeMetricIncrements(e) {
  const inc = {};
  if (e.ns && e.ns.coll === 'producttracks') {
    // Mỗi lần xem sản phẩm coi như 1 click
    inc['metrics.clicks'] = 1;
  }
  if (e.ns && e.ns.coll === 'searchtracks') {
    inc['metrics.searches'] = 1;
  }
  if (e.ns && e.ns.coll === 'carttracks') {
    const action = (e.fullDocument && e.fullDocument.action) || '';
    if (action === 'add') inc['metrics.cartAdds'] = 1;
    else if (action === 'update') inc['metrics.cartUpdates'] = 1;
    else if (action === 'remove') inc['metrics.cartRemoves'] = 1;
  }
  if (e.ns && e.ns.coll === 'ordertracks') {
    // Mỗi bản ghi order được tính là 1 đơn hàng
    inc['metrics.orders'] = 1;
  }
  return inc;
}

async function run() {
  const client = await MongoClient.connect(cfg.MONGO_URI, { maxPoolSize: 10 });
  const db = client.db(); // customer_tracking

  // Ensure output collections exist
  await db.createCollection('profiles').catch(() => {});
  await db.createCollection('recommendations').catch(() => {});

  const profiles = db.collection('profiles');
  const recos = db.collection('recommendations');

  // Chỉ lắng nghe các sự kiện insert mới vào các collection tracking
  const pipeline = [{ $match: { operationType: 'insert' } }];
  const collections = ['searchtracks', 'producttracks', 'carttracks'];
  // Nếu có collection ordertracks trong MongoDB, có thể thêm vào danh sách bên dưới
  // collections.push('ordertracks');

  // Debounce timers per key
  const timers = new Map();
  function schedule(key, fn) {
    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(fn, cfg.DEBOUNCE_MS));
  }

  for (const name of collections) {
    const stream = db.collection(name).watch(pipeline, { fullDocument: 'updateLookup' });
    stream.on('change', async (e) => {
      const doc = e.fullDocument || {};
      const key = doc.sessionId || (doc.userId ? `user:${doc.userId}` : 'guest');
      const productId = doc.productId ? String(doc.productId) : null;
      const inc = computeIncrement(e);
      const metricIncs = computeMetricIncrements(e);

      // Cập nhật điểm số hồ sơ hành vi (profile scores) và bộ đếm (metrics)
      // - Nếu có productId và inc != 0: tăng/giảm điểm cho sản phẩm đó
      // - Nếu không có productId hoặc inc == 0: chỉ cập nhật thời điểm updatedAt để đánh dấu có hoạt động
      if (productId && inc !== 0) {
        await profiles.updateOne(
          { key },
          {
            $setOnInsert: { key, createdAt: new Date() },
            $set: { updatedAt: new Date() },
            $inc: { [`scores.${productId}`]: inc, ...metricIncs }
          },
          { upsert: true }
        );
      } else {
        await profiles.updateOne(
          { key },
          { $setOnInsert: { key, createdAt: new Date() }, $set: { updatedAt: new Date() }, $inc: { ...metricIncs } },
          { upsert: true }
        );
      }

      // Tính toán đề xuất theo kiểu debounce để gom nhiều sự kiện liên tiếp
      schedule(key, async () => {
        const p = await profiles.findOne({ key });
        // 1) Không có profile or chưa có dữ liệu điểm số: KHÔNG ghi đề xuất
        if (!p || !p.scores || Object.keys(p.scores).length === 0) {
          // Xoá đề xuất cũ (nếu có) để đảm bảo người dùng mới không nhận đề xuất trống
          await recos.deleteOne({ key });
          console.log(`[reco] skip for ${key} (no scores yet)`);
          return;
        }

        // 2) Có điểm số: sắp xếp và chọn top-N
        const entries = Object.entries(p.scores || {});
        entries.sort((a, b) => b[1] - a[1]);
        const product_ids = entries.slice(0, cfg.MAX_CANDIDATES).map(([id]) => parseInt(id, 10)).slice(0, cfg.TOP_N);
        const category_ids = []; // TODO: map product->category when MySQL access is available

        await recos.updateOne(
          { key },
          {
            $set: {
              key,
              recommendations: { product_ids, category_ids },
              createdAt: new Date()
            }
          },
          { upsert: true }
        );
        console.log(`[reco] updated for ${key}:`, product_ids);
      });
    });
  }

  console.log('AI Recommender worker started. Watching change streams...');
}

run().catch((err) => {
  console.error('Worker crashed:', err);
  process.exit(1);
});


