const path = require('path');
const fs = require('fs/promises');

const AIPipelineService = require('./AIPipelineService');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DEFAULT_GLOSSARY_PATH = path.join(PROJECT_ROOT, 'ai', 'resources', 'book_glossary.json');
const DEFAULT_CORPUS_PATH = path.join(PROJECT_ROOT, 'ai', 'resources', 'book_parallel.json');

class BookTranslationService {
  static async ensureResource(pathToFile, friendlyName) {
    try {
      await fs.access(pathToFile);
    } catch (error) {
      throw new Error(`Không tìm thấy ${friendlyName} tại ${pathToFile}. Vui lòng chạy script export trước.`);
    }
  }

  static async translate({
    text,
    direction = 'auto',
    glossaryPath = DEFAULT_GLOSSARY_PATH,
    corpusPath = DEFAULT_CORPUS_PATH,
    llmModel = 'Helsinki-NLP/opus-mt-vi-en',
    embeddingModel = 'sentence-transformers/all-MiniLM-L6-v2',
    topK = 1,
  }) {
    if (!text || !String(text).trim()) {
      throw new Error('Thiếu nội dung cần dịch.');
    }

    await this.ensureResource(glossaryPath, 'book_glossary.json');
    await this.ensureResource(corpusPath, 'book_parallel.json');

    const args = [
      '-m',
      'ai.run_book_translation',
      '--glossary-path',
      glossaryPath,
      '--corpus-path',
      corpusPath,
      '--text',
      String(text),
      '--direction',
      direction || 'auto',
      '--llm-model',
      llmModel,
      '--embedding-model',
      embeddingModel,
      '--top-k',
      String(topK || 1),
    ];

    let stdout = '';
    let stderr = '';

    try {
      const result = await AIPipelineService.execPython(args, { cwd: PROJECT_ROOT });
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (error) {
      const message =
        (error?.stderr && error.stderr.trim()) ||
        (error?.stdout && error.stdout.trim()) ||
        error?.message ||
        'Python translation process failed.';
      throw new Error(message);
    }

    let payload;
    const cleaned = stdout.trim() || stderr.trim();
    try {
      payload = JSON.parse(cleaned);
    } catch (error) {
      throw new Error(`Không thể phân tích phản hồi từ Python: ${cleaned || 'Không có dữ liệu.'}`);
    }

    return {
      translation: payload.translation,
      metadata: payload.metadata,
      raw: payload,
    };
  }
}

module.exports = BookTranslationService;


