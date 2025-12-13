const RecommendationTrackingService = require('../services/RecommendationTrackingService');
const { Types } = require('mongoose');

class RecommendationTrackingController {
  static async logRequest(req, res) {
    try {
      const userId = req.user?.userId || null;
      const {
        sessionId,
        experimentId,
        modelVersion,
        impressionId,
        placement,
        topK,
        recommendedItems = [],
        context
      } = req.body;

      if (!sessionId || !modelVersion || !impressionId) {
        return res.status(400).json({ success: false, message: 'Thiếu sessionId, modelVersion hoặc impressionId' });
      }

      if (!Array.isArray(recommendedItems) || recommendedItems.length === 0) {
        return res.status(400).json({ success: false, message: 'Thiếu danh sách recommendedItems' });
      }

      const logDoc = await RecommendationTrackingService.logRequest({
        userId,
        sessionId,
        experimentId,
        modelVersion,
        impressionId,
        placement,
        topK,
        recommendedItems,
        context
      });

      res.json({ success: true, logId: logDoc._id, impressionId: logDoc.impressionId });
    } catch (err) {
      console.error('logRequest error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async logFeedback(req, res) {
    try {
      const userId = req.user?.userId || null;
      const {
        logId,
        impressionId,
        sessionId,
        experimentId,
        modelVersion,
        bookId,
        rank,
        eventType,
        value,
        cosine,
        metadata,
        occurredAt
      } = req.body;

      if ((!logId && !impressionId) || !sessionId || !bookId || !eventType) {
        return res.status(400).json({ success: false, message: 'Thiếu logId/impressionId, sessionId, bookId hoặc eventType' });
      }

      await RecommendationTrackingService.logFeedback({
        logId: logId && Types.ObjectId.isValid(logId) ? new Types.ObjectId(logId) : logId,
        impressionId,
        userId,
        sessionId,
        experimentId,
        modelVersion,
        bookId: Number(bookId),
        rank: rank != null ? Number(rank) : undefined,
        eventType,
        value: value != null ? Number(value) : null,
        cosine: cosine != null ? Number(cosine) : null,
        metadata,
        occurredAt: occurredAt ? new Date(occurredAt) : new Date()
      });

      res.json({ success: true });
    } catch (err) {
      console.error('logFeedback error', err);
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = RecommendationTrackingController;
