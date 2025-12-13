/**
 * Groq Translation Service
 * Sử dụng Groq API để dịch nhanh và chính xác
 */

const crypto = require('crypto');

// Simple in-memory cache
const translationCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 giờ

class GroqTranslationService {
  constructor() {
    // Load environment variables
    require('dotenv').config();
    // Groq API key từ environment variable
    this.apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || '';
    // Groq API endpoint
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    // Model tốt cho translation - sử dụng model mới nhất
    // Thử các model theo thứ tự ưu tiên: llama-3.3-70b-versatile > mixtral-8x22b-instruct > mixtral-8x7b-32768
    this.models = [
      process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      'mixtral-8x22b-instruct',
      'mixtral-8x7b-32768',
      'llama-3.1-70b-versatile'
    ];
    this.model = this.models[0]; // Model mặc định
    
    // Log để debug
    if (!this.apiKey) {
      console.warn('[GroqTranslation] ⚠️ GROQ_API_KEY chưa được cấu hình');
    } else {
      console.log('[GroqTranslation]  API key đã được cấu hình (length:', this.apiKey.length, ')');
    }
  }

  /**
   * Tạo cache key từ text và direction
   */
  getCacheKey(text, direction) {
    const hash = crypto.createHash('md5').update(`${text}:${direction}`).digest('hex');
    return `translation:${hash}`;
  }

  /**
   * Lấy từ cache
   */
  getFromCache(text, direction) {
    const key = this.getCacheKey(text, direction);
    const cached = translationCache.get(key);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      console.log('[GroqTranslation]  Cache hit');
      return cached.data;
    }
    
    if (cached) {
      translationCache.delete(key);
    }
    
    return null;
  }

  /**
   * Lưu vào cache
   */
  saveToCache(text, direction, result) {
    const key = this.getCacheKey(text, direction);
    translationCache.set(key, {
      data: result,
      timestamp: Date.now()
    });
    
    // Giới hạn cache size
    if (translationCache.size > 1000) {
      const firstKey = translationCache.keys().next().value;
      translationCache.delete(firstKey);
    }
  }

  /**
   * Phát hiện ngôn ngữ đơn giản (dựa vào ký tự)
   */
  detectLanguage(text) {
    const trimmedText = String(text).trim();
    
    // Kiểm tra ký tự tiếng Việt
    const vietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
    if (vietnameseChars.test(trimmedText)) {
      return 'vi';
    }
    
    // Mặc định là tiếng Anh
    return 'en';
  }

  /**
   * Xác định hướng dịch và language codes
   */
  parseDirection(direction, text) {
    // Normalize direction: loại bỏ khoảng trắng và chuyển về lowercase
    const dir = String(direction || '').toLowerCase().trim().replace(/\s+/g, '_');
    
    console.log(`[GroqTranslation] Parsing direction: "${direction}" -> normalized: "${dir}"`);
    
    // Nếu là auto-detect, phát hiện ngôn ngữ và quyết định target
    if (dir === 'auto') {
      const detectedLang = this.detectLanguage(text);
      console.log(`[GroqTranslation] Auto-detect language: ${detectedLang}`);
      
      // Nếu phát hiện là tiếng Anh → dịch sang tiếng Việt
      if (detectedLang === 'en') {
        return { source: 'English', target: 'Vietnamese', fromCode: 'en', toCode: 'vi', detected: true };
      }
      // Nếu phát hiện là tiếng Việt → dịch sang tiếng Anh
      if (detectedLang === 'vi') {
        return { source: 'Vietnamese', target: 'English', fromCode: 'vi', toCode: 'en', detected: true };
      }
      // Mặc định: EN -> VI
      return { source: 'English', target: 'Vietnamese', fromCode: 'en', toCode: 'vi', detected: true };
    }
    
    // Xử lý các format khác nhau của direction
    // EN -> VI
    if (dir === 'en_vi' || dir === 'en-vi' || dir === 'english-vietnamese' || dir === 'en->vi' || dir === 'en=>vi') {
      return { source: 'English', target: 'Vietnamese', fromCode: 'en', toCode: 'vi', detected: false };
    }
    // VI -> EN
    if (dir === 'vi_en' || dir === 'vi-en' || dir === 'vietnamese-english' || dir === 'vi->en' || dir === 'vi=>en') {
      return { source: 'Vietnamese', target: 'English', fromCode: 'vi', toCode: 'en', detected: false };
    }
    
    // Mặc định: EN -> VI
    console.warn(`[GroqTranslation] Direction không rõ: "${direction}" (normalized: "${dir}"), mặc định en -> vi`);
    return { source: 'English', target: 'Vietnamese', fromCode: 'en', toCode: 'vi', detected: false };
  }

  /**
   * Tạo system prompt cho translation
   */
  createSystemPrompt(from, to) {
    return `You are a professional translator. Your task is to translate text from ${from} to ${to}.

CRITICAL RULES - YOU MUST FOLLOW THESE EXACTLY:
1. ALWAYS translate the text - NEVER return the original text unchanged
2. Translate EVERY word from ${from} to ${to} - even single words must be translated
3. Return ONLY the translated text in ${to} - no explanations, no code blocks, no prefixes, no metadata
4. Do NOT include phrases like "Translation:", "Here is the translation:", "Đây là bản dịch:", or any other text
5. Use natural ${to} language with proper grammar
6. For single words, translate them directly:
   - English "read" → Vietnamese "đọc"
   - English "book" → Vietnamese "sách"
   - Vietnamese "đọc" → English "read"
   - Vietnamese "sách" → English "book"
7. Preserve formatting (line breaks, spacing) but translate ALL content
8. If the input is already in ${to}, still translate it to ensure accuracy
9. NEVER return the same text as input - ALWAYS provide a translation

EXAMPLES:
- Input (English): "read" → Output (Vietnamese): "đọc"
- Input (English): "book" → Output (Vietnamese): "sách"
- Input (English): "hello" → Output (Vietnamese): "xin chào"
- Input (Vietnamese): "đọc" → Output (English): "read"
- Input (Vietnamese): "sách" → Output (English): "book"

OUTPUT FORMAT: Return ONLY the translated text in ${to}, nothing else. No quotes, no prefixes, no explanations.`;
  }

  /**
   * Dịch text sử dụng Groq API
   */
  async translate({ text, direction = 'en_vi' }) {
    if (!text || !String(text).trim()) {
      throw new Error('Thiếu nội dung cần dịch.');
    }

    // Kiểm tra API key
    if (!this.apiKey || this.apiKey.trim() === '') {
      throw new Error('Groq API key chưa được cấu hình. Vui lòng thiết lập GROQ_API_KEY trong backend/.env');
    }

    const trimmedText = String(text).trim();
    
    // Kiểm tra cache
    const cached = this.getFromCache(trimmedText, direction);
    if (cached) {
      return cached;
    }

    // Parse direction
    const langInfo = this.parseDirection(direction, trimmedText);
    
    const directionInfo = langInfo.detected 
      ? `(tự phát hiện: ${langInfo.fromCode})` 
      : '';
    console.log(`[GroqTranslation] Dịch từ ${langInfo.source} sang ${langInfo.target} ${directionInfo}`);
    console.log(`[GroqTranslation] Text: "${trimmedText.substring(0, 100)}${trimmedText.length > 100 ? '...' : ''}"`);

    // Thử các model theo thứ tự ưu tiên
    let lastError = null;
    for (const modelToTry of this.models) {
      try {
        // Tạo system prompt
        const systemPrompt = this.createSystemPrompt(langInfo.source, langInfo.target);
        
        console.log(`[GroqTranslation] Thử model: ${modelToTry}`);
        
        // Gọi Groq API
        const startTime = Date.now();
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelToTry,
            messages: [
              {
                role: 'system',
                content: systemPrompt
              },
              {
                role: 'user',
                content: trimmedText
              }
            ],
            temperature: 0.1, // Rất thấp để dịch chính xác nhất
            max_tokens: 4096, // Tăng để xử lý text dài hơn
          }),
        });

        const duration = Date.now() - startTime;
        console.log(`[GroqTranslation] API call mất ${duration}ms với model ${modelToTry}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg = errorData.error?.message || `HTTP ${response.status}`;
          console.warn(`[GroqTranslation] ⚠️ Model ${modelToTry} failed: ${errorMsg}`);
          
          // Nếu là lỗi 404 (model không tồn tại) hoặc 400 (model không hợp lệ), thử model tiếp theo
          if (response.status === 404 || response.status === 400) {
            lastError = new Error(`Model ${modelToTry} không khả dụng: ${errorMsg}`);
            continue; // Thử model tiếp theo
          }
          
          // Các lỗi khác (401, 429, 500...) thì throw ngay
          throw new Error(`Groq API error với model ${modelToTry}: ${errorMsg}`);
        }

        const data = await response.json();
      
        // Log raw response để debug
        console.log(`[GroqTranslation]  API response received từ model ${modelToTry}`);
        const rawContent = data.choices?.[0]?.message?.content || '';
        console.log('[GroqTranslation] Raw response content:', rawContent.substring(0, 200));
        
        // Groq API trả về: { choices: [{ message: { content: "..." } }] }
        let translation = rawContent.trim();
        
        if (!translation) {
          console.warn(`[GroqTranslation] ⚠️ Model ${modelToTry} không trả về content, thử model tiếp theo`);
          lastError = new Error(`Model ${modelToTry} không trả về kết quả dịch`);
          continue; // Thử model tiếp theo
        }
        
        // Loại bỏ markdown code blocks nếu có
        translation = translation.replace(/^```[\w]*\n?/g, '').replace(/\n?```$/g, '').trim();
        
        // Loại bỏ các prefix không cần thiết (mở rộng danh sách)
        translation = translation.replace(/^(Translation|Bản dịch|Here is the translation|Đây là bản dịch|The translation is|Bản dịch là):\s*/i, '').trim();
        
        // Loại bỏ các dấu ngoặc kép nếu có
        translation = translation.replace(/^["']|["']$/g, '').trim();
        
        console.log('[GroqTranslation] Translation sau khi clean:', translation);

        if (!translation || translation.trim() === '') {
          console.warn(`[GroqTranslation] ⚠️ Model ${modelToTry} trả về translation rỗng, thử model tiếp theo`);
          lastError = new Error(`Model ${modelToTry} trả về translation rỗng`);
          continue; // Thử model tiếp theo
        }
        
        // Kiểm tra nếu translation giống với input (có thể là lỗi)
        const translationTrimmed = translation.trim();
        const inputTrimmed = trimmedText.trim();
        
        // Kiểm tra nếu source và target giống nhau
        if (langInfo.fromCode === langInfo.toCode) {
          console.error('[GroqTranslation] ❌ Source và Target giống nhau:', langInfo.fromCode);
          throw new Error(`Lỗi: Source và Target giống nhau (${langInfo.fromCode}). Không thể dịch.`);
        }
        
        // Kiểm tra nếu translation giống với input (chỉ cảnh báo nếu text dài hơn 2 ký tự)
        // Nhưng cho phép một số trường hợp đặc biệt (ví dụ: số, tên riêng)
        if (translationTrimmed.toLowerCase() === inputTrimmed.toLowerCase() && inputTrimmed.length > 2) {
          // Kiểm tra xem có phải là số hoặc tên riêng không
          const isNumber = /^\d+$/.test(inputTrimmed);
          const isProperNoun = /^[A-Z][a-z]+$/.test(inputTrimmed);
          
          if (!isNumber && !isProperNoun) {
            console.warn(`[GroqTranslation] ⚠️ Model ${modelToTry} trả về translation giống input, thử model tiếp theo`);
            lastError = new Error(`Model ${modelToTry} không dịch đúng (kết quả giống input)`);
            continue; // Thử model tiếp theo
          }
        }

        const result = {
          translation: translationTrimmed,
          metadata: {
            direction: `${langInfo.fromCode}_${langInfo.toCode}`,
            source: langInfo.fromCode,
            target: langInfo.toCode,
            provider: 'groq',
            model: modelToTry, // Lưu model đã sử dụng thành công
            cached: false,
            duration_ms: duration,
            auto_detected: langInfo.detected || false,
          },
          raw: data,
        };

        // Lưu vào cache
        this.saveToCache(trimmedText, direction, result);
        result.metadata.cached = false;

        console.log(`[GroqTranslation]  Dịch thành công với model ${modelToTry} (${duration}ms): "${translation.substring(0, 100)}${translation.length > 100 ? '...' : ''}"`);
        
        return result;
      } catch (error) {
        // Nếu lỗi không phải là model không khả dụng, log và thử model tiếp theo
        console.warn(`[GroqTranslation] ⚠️ Model ${modelToTry} gặp lỗi: ${error.message}`);
        lastError = error;
        continue; // Thử model tiếp theo
      }
    }
    
    // Nếu tất cả các model đều thất bại
    console.error('[GroqTranslation] ❌ Tất cả các model đều thất bại');
    throw new Error(`Không thể dịch với bất kỳ model nào. Lỗi cuối cùng: ${lastError?.message || 'Unknown error'}`);
  }
}

module.exports = new GroqTranslationService();

