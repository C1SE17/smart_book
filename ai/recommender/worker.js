/*
  Recommender Worker
  - Watches MongoDB Change Streams on searchtracks/producttracks/carttracks
  - Maintains per-session/user profile scores
  - Writes recommendations collection with { key, recommendations: { product_ids, category_ids }, createdAt }
*/
console.log('[reco-cfg]', require('./config'));
const { MongoClient } = require('mongodb');
const cfg = require('./config');

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
  return 0;
}

async function run() {
  const client = await MongoClient.connect(cfg.MONGO_URI, { maxPoolSize: 10 });
  const db = client.db(); // customer_tracking

  // Ensure output collections exist
  await db.createCollection('profiles').catch(() => {});
  await db.createCollection('recommendations').catch(() => {});

  const profiles = db.collection('profiles');
  const recos = db.collection('recommendations');

  const pipeline = [{ $match: { operationType: 'insert' } }];
  const collections = ['searchtracks', 'producttracks', 'carttracks'];

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

      // Update profile scores
      if (productId && inc !== 0) {
        await profiles.updateOne(
          { key },
          {
            $setOnInsert: { key, createdAt: new Date() },
            $set: { updatedAt: new Date() },
            $inc: { [`scores.${productId}`]: inc }
          },
          { upsert: true }
        );
      } else {
        await profiles.updateOne(
          { key },
          { $setOnInsert: { key, createdAt: new Date() }, $set: { updatedAt: new Date() } },
          { upsert: true }
        );
      }

      // Debounced recompute recommendations
      schedule(key, async () => {
        const p = await profiles.findOne({ key });
        const entries = Object.entries((p && p.scores) || {});
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


