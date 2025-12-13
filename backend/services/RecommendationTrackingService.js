const RecommendationLog = require('../models/RecommendationLog');
const RecommendationFeedback = require('../models/RecommendationFeedback');

const SCORE_MAP = {
  view_detail: 1,
  recommendation_click: 2,
  add_to_cart: 3,
  purchase: 4,
  like: 2,
  dislike: -1
};

const HALF_LIFE_DAYS = 30;
const decayScore = (baseScore, occurredAt = new Date()) => {
  const diffDays = (Date.now() - new Date(occurredAt).getTime()) / (1000 * 60 * 60 * 24);
  const decay = Math.pow(0.5, Math.max(diffDays, 0) / HALF_LIFE_DAYS);
  return baseScore * decay;
};

const normaliseRecommendedItems = (recommendedItems = []) => recommendedItems.map((item, index) => ({
  bookId: Number(item.bookId ?? item.book_id),
  rank: item.rank ?? index + 1,
  finalScore: item.finalScore ?? item.score ?? null,
  scores: {
    embedding: item.scores?.embedding ?? null,
    metadata: item.scores?.metadata ?? null,
    explore: item.scores?.explore ?? null
  },
  similarity: {
    cosine: item.similarity?.cosine ?? item.cosine ?? null
  },
  filters: item.filters ?? {}
}));

class RecommendationTrackingService {
  static async logRequest({ userId, sessionId, experimentId, modelVersion, impressionId, placement, topK, recommendedItems, context }) {
    const doc = new RecommendationLog({
      userId: userId || null,
      sessionId,
      experimentId: experimentId || null,
      modelVersion,
      impressionId,
      placement: placement || 'unknown',
      topK: typeof topK === 'number' ? topK : (Array.isArray(recommendedItems) ? recommendedItems.length : null),
      recommendedItems: normaliseRecommendedItems(recommendedItems),
      context: context || {}
    });

    await doc.save();
    return doc;
  }

  static async findLogByIdentifier({ logId, impressionId }) {
    if (logId) {
      const doc = await RecommendationLog.findById(logId).lean();
      if (doc) return doc;
    }
    if (impressionId) {
      const doc = await RecommendationLog.findOne({ impressionId }).lean();
      if (doc) return doc;
    }
    return null;
  }

  static async logFeedback({
    logId,
    impressionId,
    userId,
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
  }) {
    if (!impressionId && !logId) {
      throw new Error('Missing impressionId or logId for feedback logging');
    }

    const logDoc = await RecommendationTrackingService.findLogByIdentifier({ logId, impressionId });
    if (!logDoc) {
      throw new Error('Cannot find recommendation log for feedback');
    }

    const matchedItem = logDoc.recommendedItems?.find((item) => item.bookId === Number(bookId)) || null;

    const baseScore = value != null ? value : (SCORE_MAP[eventType] ?? 1);

    const feedback = new RecommendationFeedback({
      logId: logDoc._id,
      impressionId: logDoc.impressionId,
      userId: userId || logDoc.userId || null,
      sessionId,
      experimentId: experimentId || logDoc.experimentId || null,
      modelVersion: modelVersion || logDoc.modelVersion || null,
      bookId: Number(bookId),
      rank: rank != null ? rank : matchedItem?.rank ?? null,
      eventType,
      value: value ?? null,
      baseScore,
      finalScore: decayScore(baseScore, occurredAt),
      cosine: cosine != null ? cosine : matchedItem?.similarity?.cosine ?? null,
      metadata: metadata || {},
      occurredAt
    });

    await feedback.save();
  }
}

module.exports = RecommendationTrackingService;
