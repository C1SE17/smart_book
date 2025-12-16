const mongoose = require('../config/mongodb');

const EVENT_TYPES = [
  'view_detail',
  'recommendation_click',
  'add_to_cart',
  'purchase'
];

const recommendationFeedbackSchema = new mongoose.Schema({
  logId: { type: mongoose.Schema.Types.ObjectId, ref: 'RecommendationLog', required: false },
  impressionId: { type: String, required: true },
  userId: { type: String, default: null },
  sessionId: { type: String, required: true },
  experimentId: { type: String, default: null },
  modelVersion: { type: String, default: null },
  bookId: { type: Number, required: true },
  rank: { type: Number, default: null },
  eventType: { type: String, enum: EVENT_TYPES, required: true },
  value: { type: Number, default: null },
  baseScore: { type: Number, required: true },
  finalScore: { type: Number, required: true },
  cosine: { type: Number, default: null },
  metadata: { type: Object, default: () => ({}) },
  occurredAt: { type: Date, default: Date.now }
}, { collection: 'recommendation_feedbacks' });

recommendationFeedbackSchema.index({ impressionId: 1, bookId: 1, eventType: 1 });
recommendationFeedbackSchema.index({ logId: 1 });
recommendationFeedbackSchema.index({ userId: 1, bookId: 1, occurredAt: -1 });
recommendationFeedbackSchema.index({ experimentId: 1, occurredAt: -1 });
recommendationFeedbackSchema.index({ modelVersion: 1, occurredAt: -1 });

module.exports = mongoose.model('RecommendationFeedback', recommendationFeedbackSchema);
