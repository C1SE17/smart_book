/**
 * Controller REST dùng để admin gọi huấn luyện gợi ý.
 */

const RecommendationTrainingService = require('../services/RecommendationTrainingService');

class RecommendationTrainingController {
  /**
   * POST /api/recommendations/train
   * Body: historyDays, minScore, topK, maxProfiles, dryRun
   */
  static async train(req, res) {
    try {
      const {
        historyDays = 90,
        minScore = 0.2,
        topK = 25,
        maxProfiles = 0,
        dryRun = false
      } = req.body || {};

      const result = await RecommendationTrainingService.train({
        historyDays: Number(historyDays) || 0,
        minScore: Number(minScore) || 0,
        topK: Math.max(1, Number(topK) || 1),
        maxProfiles: Number(maxProfiles) || 0,
        dryRun: Boolean(dryRun)
      });

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('[RecommendationTrainingController] train error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Không thể huấn luyện mô hình gợi ý',
        stderr: error.stderr,
        stdout: error.stdout
      });
    }
  }
}

module.exports = RecommendationTrainingController;

