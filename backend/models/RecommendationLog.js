const mongoose = require('../config/mongodb');

const embeddedScoreSchema = new mongoose.Schema({
  embedding: { type: Number, default: null },
  metadata: { type: Number, default: null },
  explore: { type: Number, default: null }
}, { _id: false });

const similaritySchema = new mongoose.Schema({
  cosine: { type: Number, default: null }
}, { _id: false });

const recommendedItemSchema = new mongoose.Schema({
  bookId: { type: Number, required: true },
  rank: { type: Number, required: true },
  finalScore: { type: Number, default: null },
  scores: { type: embeddedScoreSchema, default: () => ({}) },
  similarity: { type: similaritySchema, default: () => ({}) },
  filters: { type: Object, default: () => ({}) }
}, { _id: false });

const recommendationLogSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  sessionId: { type: String, required: true },
  experimentId: { type: String, default: null },
  modelVersion: { type: String, required: true },
  impressionId: { type: String, required: true },
  placement: { type: String, default: 'unknown' },
  topK: { type: Number, default: null },
  recommendedItems: { type: [recommendedItemSchema], default: [] },
  context: { type: Object, default: () => ({}) },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'recommendation_logs' });

recommendationLogSchema.index(
  { impressionId: 1 },
  { unique: true, partialFilterExpression: { impressionId: { $exists: true, $type: 'string' } } }
);
recommendationLogSchema.index({ userId: 1, createdAt: -1 });
recommendationLogSchema.index({ experimentId: 1, createdAt: -1 });
recommendationLogSchema.index({ modelVersion: 1, createdAt: -1 });

module.exports = mongoose.model('RecommendationLog', recommendationLogSchema);
