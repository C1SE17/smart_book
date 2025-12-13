const BookTranslationService = require('../services/BookTranslationService');
const GroqTranslationService = require('../services/GroqTranslationService');

// Controller xử lý việc dịch nội dung sách
class BookTranslationController {
  // Nhận yêu cầu dịch và chuyển tiếp đến Translation Service
  static async translate(req, res) {
    try {
      const {
        text,
        direction = 'en_vi', // Mặc định EN -> VI
        useGroq = true, // Sử dụng Groq API mặc định (nhanh và chính xác)
        topK = 1,
        glossaryPath,
        corpusPath,
        llmModel,
        embeddingModel,
      } = req.body || {};

      // Validate input
      if (!text || !String(text).trim()) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu nội dung cần dịch.',
        });
      }

      console.log('[BookTranslationController] Translation request:', {
        textLength: String(text).length,
        direction,
        useGroq,
      });

      let result;

      // Sử dụng Groq API (nhanh và chính xác nhất)
      if (useGroq) {
        try {
          console.log('[BookTranslationController] Sử dụng Groq API để dịch');
          console.log('[BookTranslationController] Direction:', direction);
          result = await GroqTranslationService.translate({
            text: String(text).trim(),
            direction: String(direction || 'en_vi').trim(),
          });
          console.log('[BookTranslationController]  Groq translation thành công');
        } catch (groqError) {
          console.error('[BookTranslationController] ❌ Groq translation failed:', groqError.message);
          console.error('[BookTranslationController] Error stack:', groqError.stack);
          console.warn('[BookTranslationController] Falling back to Python translation service');
          // Fallback về Python nếu Groq lỗi
          try {
            result = await BookTranslationService.translate({
              text,
              direction,
              topK: Number(topK) || 1,
              glossaryPath,
              corpusPath,
              llmModel,
              embeddingModel,
            });
          } catch (pythonError) {
            console.error('[BookTranslationController] ❌ Python translation also failed:', pythonError.message);
            throw groqError; // Throw original error
          }
        }
      } else {
        // Sử dụng Python script (chậm hơn nhưng có glossary)
        console.log('[BookTranslationController] Sử dụng Python script để dịch');
        result = await BookTranslationService.translate({
          text,
          direction,
          topK: Number(topK) || 1,
          glossaryPath,
          corpusPath,
          llmModel,
          embeddingModel,
        });
      }

      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('[BookTranslationController] translate error:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Không thể dịch nội dung.',
      });
    }
  }
}

module.exports = BookTranslationController;


