/**
 * Dịch vụ trigger huấn luyện gợi ý bằng Python.
 * Ý tưởng: gom dữ liệu -> gọi script ai/train_recommendations.py -> đọc báo cáo trả về.
 */

const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const AIPipelineService = require('./AIPipelineService');
const db = require('../config/db');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

class RecommendationTrainingService {
  /**
   * Huấn luyện và cập nhật bảng profiles/recommendations.
   * @param {Object} options cấu hình training (historyDays, minScore, topK...)
   */
  static async train({
    historyDays = 90,
    minScore = 0.2,
    topK = 25,
    maxProfiles = 0,
    dryRun = false
  } = {}) {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smart-book-reco-'));
    const reportPath = path.join(tmpDir, 'report.json');
    const bookMetaPath = path.join(tmpDir, 'book_meta.json');

    try {
      // Lấy metadata sách từ MySQL: tiêu đề, category, author, publisher...
      const [bookMetaRows] = await db
        .promise()
        .query(
          `SELECT 
              b.book_id AS product_id,
              b.title,
              b.category_id,
              b.author_id,
              b.publisher_id,
              b.price,
              b.stock
           FROM books b`
        );

      await fs.writeFile(bookMetaPath, JSON.stringify(bookMetaRows || []), 'utf-8');

      const args = [
        path.resolve(PROJECT_ROOT, 'ai', 'train_recommendations.py'),
        '--history-days',
        String(historyDays),
        '--min-score',
        String(minScore),
        '--top-k',
        String(topK),
        '--report-json',
        reportPath,
        '--book-meta-json',
        bookMetaPath,
        '--mongo-uri',
        process.env.MONGO_URI || 'mongodb://localhost:27017/customer_tracking',
        '--mongo-db',
        process.env.MONGO_DB || 'customer_tracking'
      ];

      if (maxProfiles) {
        args.push('--max-profiles', String(maxProfiles));
      }
      if (dryRun) {
        args.push('--dry-run');
      }

      // Gọi python script (timeout mặc định 10 phút)
      const startedAt = new Date();
      const pythonResult = await AIPipelineService.execPython(args, {
        timeoutMs: 10 * 60 * 1000
      });
      const durationMs = Date.now() - startedAt.getTime();

      let report = null;
      try {
        const raw = await fs.readFile(reportPath, 'utf-8');
        report = JSON.parse(raw);
      } catch (_) {
        report = null;
      }

      return {
        startedAt: startedAt.toISOString(),
        durationMs,
        stdout: pythonResult.stdout,
        stderr: pythonResult.stderr,
        report
      };
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => null);
    }
  }
}

module.exports = RecommendationTrainingService;

