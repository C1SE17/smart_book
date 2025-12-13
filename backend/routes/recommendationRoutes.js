const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/RecommendationController');
const RecommendationTrainingController = require('../controllers/RecommendationTrainingController');
const { auth, adminOnly } = require('../middleware/auth');
const mongo = require('../config/mongodb');
const jwt = require('jsonwebtoken');

router.get('/products', (req, res) => RecommendationController.getRecommendedProducts(req, res));
router.get('/categories', (req, res) => RecommendationController.getRecommendedCategories(req, res));
router.post('/train', auth, adminOnly, (req, res) => RecommendationTrainingController.train(req, res));

// Server-Sent Events: stream recommendations updates in realtime for a given key
function getKeyFromReq(req) {
  const { sessionId, userId } = req.query || {};
  let key = sessionId || (userId ? `user:${userId}` : null);
  if (!key) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
        if (decoded) {
          const uid = decoded.userId || decoded.user_id || decoded.id || decoded.sub;
          if (uid) key = `user:${uid}`;
        }
      } catch (_) {}
    }
  }
  return key;
}

router.get('/stream', async (req, res) => {
  try {
    const key = getKeyFromReq(req);
    if (!key) {
      res.status(400).json({ success: false, message: 'Thiếu sessionId hoặc userId' });
      return;
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    const Recommendations = mongo.connection.collection('recommendations');

    // Send latest snapshot once at start
    const latest = await Recommendations.findOne({ key }, { sort: { createdAt: -1 } });
    res.write(`data: ${JSON.stringify({ type: 'snapshot', data: latest || null })}\n\n`);

    // Watch for subsequent updates
    const cs = Recommendations.watch([
      { $match: { operationType: { $in: ['insert', 'update', 'replace'] } } }
    ], { fullDocument: 'updateLookup' });

    const onChange = (e) => {
      const doc = e.fullDocument;
      if (!doc || doc.key !== key) return;
      res.write(`data: ${JSON.stringify({ type: 'update', data: doc })}\n\n`);
    };

    cs.on('change', onChange);
    req.on('close', () => {
      try { cs.removeListener('change', onChange); cs.close(); } catch (_) {}
      res.end();
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

// Long-poll endpoint: trả về khi có cập nhật mới hoặc hết thời gian chờ
router.get('/poll', async (req, res) => {
  try {
    const { since } = req.query;
    const key = getKeyFromReq(req);
    if (!key) {
      return res.status(400).json({ success: false, message: 'Thiếu sessionId hoặc userId' });
    }

    const Recommendations = mongo.connection.collection('recommendations');
    const latest = await Recommendations.findOne({ key }, { sort: { createdAt: -1 } });

    const sinceTs = Number(since || 0);
    const latestTs = latest && latest.createdAt ? new Date(latest.createdAt).getTime() : 0;

    // Nếu chưa có since hoặc đã mới hơn, trả ngay
    if (!sinceTs || latestTs > sinceTs) {
      return res.json({ success: true, data: latest || null });
    }

    // Ngược lại: đợi tối đa 25s cho bản cập nhật mới
    const timeoutMs = 25000;
    let finished = false;
    const done = (payload) => {
      if (finished) return;
      finished = true;
      try { cs && cs.close(); } catch (_) {}
      clearTimeout(timer);
      res.json(payload);
    };

    const cs = Recommendations.watch([
      { $match: { operationType: { $in: ['insert', 'update', 'replace'] } } }
    ], { fullDocument: 'updateLookup' });

    cs.on('change', (e) => {
      const doc = e.fullDocument;
      if (!doc || doc.key !== key) return;
      done({ success: true, data: doc });
    });

    const timer = setTimeout(() => {
      done({ success: true, data: latest || null, timeout: true });
    }, timeoutMs);

    req.on('close', () => {
      if (finished) return;
      try { cs.close(); } catch (_) {}
      clearTimeout(timer);
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


const RecommendationTrackingController = require('../controllers/RecommendationTrackingController');
router.post('/events/request', RecommendationTrackingController.logRequest);
router.post('/events/feedback', RecommendationTrackingController.logFeedback);
