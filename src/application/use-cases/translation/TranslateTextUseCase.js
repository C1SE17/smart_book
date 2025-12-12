/**
 * Translate Text Use Case
 * Application layer - orchestrates translation workflow
 */
class TranslateTextUseCase {
  constructor(translationService) {
    this.translationService = translationService;
  }

  async execute({ text, direction = 'auto', options = {} }) {
    try {
      if (!text || !String(text).trim()) {
        throw new Error('Text is required for translation');
      }

      const result = await this.translationService.translate({
        text: String(text).trim(),
        direction,
        ...options,
      });

      return {
        success: true,
        data: {
          original: text,
          translated: result.translated || result.text || '',
          direction: result.direction || direction,
          confidence: result.confidence || null,
        },
      };
    } catch (error) {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }
}

module.exports = TranslateTextUseCase;

