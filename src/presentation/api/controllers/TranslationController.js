/**
 * Translation Controller
 * Presentation layer - handles translation API requests
 */
class TranslationController {
  constructor(translateTextUseCase) {
    this.translateTextUseCase = translateTextUseCase;
  }

  /**
   * POST /api/translation/translate
   * Translate text
   */
  async translate(req, res) {
    try {
      const { text, direction, ...options } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: 'Text is required',
        });
      }

      const result = await this.translateTextUseCase.execute({
        text,
        direction,
        options,
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = TranslationController;

