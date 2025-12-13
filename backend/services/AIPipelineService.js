const path = require('path');
const os = require('os');
const fs = require('fs/promises');
const { spawn } = require('child_process');
const crypto = require('crypto');

const db = require('../config/db');
const AILogModel = require('../models/AILogModel');

const ORDER_SUCCESS_STATUSES = ['paid', 'shipped', 'completed'];
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const sanitizeNumber = (value) => Number(value || 0);
const sanitizeDate = (value) => {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  try {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return String(value);
    }
    return parsed.toISOString();
  } catch (err) {
    return String(value);
  }
};

class AIPipelineService {
  static pythonExecutable() {
    return process.env.PYTHON_BIN || process.env.PYTHON_PATH || 'python';
  }

  static async collectSalesDaily() {
    const [rows] = await db
      .promise()
      .query(
        `SELECT DATE(created_at) AS date, COALESCE(SUM(total_price), 0) AS daily_sales
         FROM orders
         WHERE status IN (?)
         GROUP BY DATE(created_at)
         ORDER BY DATE(created_at) ASC`,
        [ORDER_SUCCESS_STATUSES]
      );

    return rows
      .filter((row) => row.date)
      .map((row) => ({
        date: row.date instanceof Date ? row.date.toISOString().slice(0, 10) : String(row.date),
        daily_sales: sanitizeNumber(row.daily_sales)
      }));
  }

  static async collectOrdersForSegmentation() {
    const [rows] = await db
      .promise()
      .query(
        `SELECT user_id AS customer_id, created_at AS order_date, total_price AS order_value
         FROM orders
         WHERE status IN (?) AND user_id IS NOT NULL`,
        [ORDER_SUCCESS_STATUSES]
      );

    return rows
      .filter((row) => row.customer_id && row.order_date)
      .map((row) => ({
        customer_id: row.customer_id,
        order_date: sanitizeDate(row.order_date),
        order_value: sanitizeNumber(row.order_value)
      }));
  }

  static async collectRecentReviews(limit = 2000) {
    const [rows] = await db
      .promise()
      .query(
        `SELECT r.review_id,
                r.book_id,
                r.rating,
                r.review_text,
                r.created_at,
                u.name AS user_name
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.user_id
         WHERE r.review_text IS NOT NULL
           AND TRIM(r.review_text) <> ''
         ORDER BY r.created_at DESC
         LIMIT ?`,
        [limit]
      );

    return rows.map((row) => ({
      review_id: row.review_id,
      book_id: row.book_id,
      rating: row.rating,
      review_text: row.review_text,
      created_at: sanitizeDate(row.created_at),
      user_name: row.user_name || null
    }));
  }

  static deriveLabelFromRating(rating) {
    const score = Number(rating);
    if (Number.isNaN(score)) {
      return null;
    }
    if (score >= 4) return 'positive';
    if (score <= 2) return 'negative';
    return 'neutral';
  }

  static async collectLabelledReviews(limit = 5000) {
    const reviews = await AIPipelineService.collectRecentReviews(limit);
    return reviews
      .map((review) => ({
        text: review.review_text,
        label: AIPipelineService.deriveLabelFromRating(review.rating),
        rating: review.rating,
        book_id: review.book_id
      }))
      .filter((item) => item.text && item.label);
  }

  static async execPython(args, { cwd = PROJECT_ROOT, env = {}, timeoutMs = 15 * 60 * 1000 } = {}) {
    return new Promise((resolve, reject) => {
      const pythonBin = AIPipelineService.pythonExecutable();
      const child = spawn(pythonBin, args, {
        cwd,
        env: { ...process.env, ...env },
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const timer = timeoutMs
        ? setTimeout(() => {
            timedOut = true;
            child.kill('SIGKILL');
          }, timeoutMs)
        : null;

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (error) => {
        if (timer) clearTimeout(timer);
        reject(error);
      });

      child.on('close', (code) => {
        if (timer) clearTimeout(timer);

        if (timedOut) {
          const error = new Error('Python process timed out');
          error.stdout = stdout;
          error.stderr = stderr;
          return reject(error);
        }

        if (code !== 0) {
          const error = new Error(`Python process exited with code ${code}`);
          error.stdout = stdout;
          error.stderr = stderr;
          error.exitCode = code;
          return reject(error);
        }

        resolve({ stdout, stderr });
      });
    });
  }

  static async runPipeline({
    refreshTopicModel = false,
    sentimentSample = 200,
    segmentPreview = 200,
    reviewLimit = 2000
  } = {}) {
    const [sales, orders, reviews] = await Promise.all([
      AIPipelineService.collectSalesDaily(),
      AIPipelineService.collectOrdersForSegmentation(),
      AIPipelineService.collectRecentReviews(reviewLimit)
    ]);

    if (!sales.length) {
      throw new Error('Không có dữ liệu đơn hàng để chạy dự báo.');
    }

    if (!reviews.length) {
      throw new Error('Không có dữ liệu đánh giá để phân tích cảm xúc.');
    }

    const payload = {
      sales,
      orders,
      reviews: reviews.map((item) => ({
        review_id: item.review_id,
        book_id: item.book_id,
        rating: item.rating,
        text: item.review_text,
        created_at: item.created_at,
        user_name: item.user_name,
        label: AIPipelineService.deriveLabelFromRating(item.rating)
      }))
    };

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smart-book-ai-'));
    const inputPath = path.join(tmpDir, 'input.json');
    const outputPath = path.join(tmpDir, 'output.json');

    await fs.writeFile(inputPath, JSON.stringify(payload), 'utf-8');

    const args = [
      path.resolve(PROJECT_ROOT, 'ai', 'main.py'),
      '--input-json',
      inputPath,
      '--output-json',
      outputPath,
      '--output-format',
      'json',
      '--sentiment-sample',
      String(sentimentSample),
      '--segment-preview',
      String(segmentPreview)
    ];

    if (refreshTopicModel) {
      args.push('--refresh-topic-model');
    }

    const startedAt = new Date();
    let stdout = '';
    let stderr = '';
    try {
      const pythonResult = await AIPipelineService.execPython(args);
      stdout = pythonResult.stdout;
      stderr = pythonResult.stderr;

      const rawOutput = await fs.readFile(outputPath, 'utf-8');
      const output = JSON.parse(rawOutput);

      const durationMs = Date.now() - startedAt.getTime();
      const context = {
        runId: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(8).toString('hex'),
        durationMs,
        refreshTopicModel,
        sentimentSample,
        segmentPreview,
        reviewLimit,
        stats: {
          salesRecords: sales.length,
          orderRecords: orders.length,
          reviewRecords: reviews.length
        }
      };

      try {
        await AILogModel.createLog({
          actionType: 'PIPELINE_RUN',
          context,
          note: stderr ? stderr.slice(0, 500) : 'Pipeline executed successfully'
        });
      } catch (logError) {
        console.warn('[AIPipelineService] Failed to persist pipeline log:', logError);
      }

      return {
        startedAt,
        durationMs,
        stdout,
        stderr,
        output,
        salesCount: sales.length,
        orderCount: orders.length,
        reviewCount: reviews.length,
        context
      };
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => null);
    }
  }

  static async fineTuneSentiment({
    dataPath = null,
    reviewLimit = 5000,
    textCol = 'text',
    labelCol = 'label',
    baseModel = 'distilbert-base-uncased',
    outputDir = 'ai/models/sentiment_finetuned_model',
    epochs = 3,
    batchSize = 16,
    learningRate = 2e-5,
    maxLength = 256,
    testSize = 0.1,
    randomState = 42
  } = {}) {
    let datasetPath = dataPath;
    let cleanupDir = null;

    if (!datasetPath) {
      const dataset = await AIPipelineService.collectLabelledReviews(reviewLimit);
      if (!dataset.length) {
        throw new Error('Không có đủ dữ liệu đánh giá để tinh chỉnh mô hình cảm xúc.');
      }

      cleanupDir = await fs.mkdtemp(path.join(os.tmpdir(), 'smart-book-ft-'));
      datasetPath = path.join(cleanupDir, 'labelled_reviews.csv');

      const header = ['text', 'label'];
      const lines = [header.join(',')];
      dataset.forEach((item) => {
        const safeText = String(item.text).replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
        const safeLabel = String(item.label).replace(/"/g, '""');
        lines.push(`"${safeText}","${safeLabel}"`);
      });
      await fs.writeFile(datasetPath, lines.join('\n'), 'utf-8');
    }

    const args = [
      path.resolve(PROJECT_ROOT, 'ai', 'fine_tune_sentiment.py'),
      '--data-path',
      datasetPath,
      '--text-col',
      textCol,
      '--label-col',
      labelCol,
      '--base-model',
      baseModel,
      '--output-dir',
      outputDir,
      '--epochs',
      String(epochs),
      '--batch-size',
      String(batchSize),
      '--learning-rate',
      String(learningRate),
      '--max-length',
      String(maxLength),
      '--test-size',
      String(testSize),
      '--random-state',
      String(randomState)
    ];

    const startedAt = new Date();
    let stdout = '';
    let stderr = '';

    try {
      const pythonResult = await AIPipelineService.execPython(args, { timeoutMs: 60 * 60 * 1000 });
      stdout = pythonResult.stdout;
      stderr = pythonResult.stderr;

      const metadataPath = path.resolve(PROJECT_ROOT, outputDir, 'training_metadata.json');
      let metadata = null;
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        metadata = JSON.parse(metadataContent);
      } catch (error) {
        metadata = null;
      }

      const durationMs = Date.now() - startedAt.getTime();
      const context = {
        runId: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(8).toString('hex'),
        durationMs,
        datasetPath,
        reviewLimit,
        baseModel,
        outputDir
      };

      try {
        await AILogModel.createLog({
          actionType: 'SENTIMENT_FINE_TUNE',
          context,
          note: stderr ? stderr.slice(0, 500) : 'Fine-tuning completed'
        });
      } catch (logError) {
        console.warn('[AIPipelineService] Failed to persist fine-tune log:', logError);
      }

      return {
        startedAt,
        durationMs,
        stdout,
        stderr,
        metadata,
        outputDir,
        datasetPath,
        context
      };
    } finally {
      if (cleanupDir) {
        await fs.rm(cleanupDir, { recursive: true, force: true }).catch(() => null);
      }
    }
  }
}

module.exports = AIPipelineService;

