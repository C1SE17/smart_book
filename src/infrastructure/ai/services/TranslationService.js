/**
 * Translation Service
 * Infrastructure layer - AI/ML translation service
 */
const path = require('path');
const fs = require('fs/promises');
const { spawn } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '../../../../');
const DEFAULT_GLOSSARY_PATH = path.join(PROJECT_ROOT, 'ai', 'resources', 'book_glossary.json');
const DEFAULT_CORPUS_PATH = path.join(PROJECT_ROOT, 'ai', 'resources', 'book_parallel.json');

class TranslationService {
  /**
   * Ensure resource file exists
   */
  static async ensureResource(pathToFile, friendlyName) {
    try {
      await fs.access(pathToFile);
    } catch (error) {
      throw new Error(`Không tìm thấy ${friendlyName} tại ${pathToFile}. Vui lòng chạy script export trước.`);
    }
  }

  /**
   * Translate text using AI service
   */
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

    return new Promise((resolve, reject) => {
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
        String(topK),
      ];

      const pythonProcess = spawn('python', args, {
        cwd: PROJECT_ROOT,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Translation failed: ${stderr || 'Unknown error'}`));
          return;
        }

        try {
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (parseError) {
          reject(new Error(`Failed to parse translation result: ${parseError.message}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start translation process: ${error.message}`));
      });
    });
  }
}

module.exports = TranslationService;

