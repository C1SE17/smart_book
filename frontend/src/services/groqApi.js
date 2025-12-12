/**
 * Groq API Service
 * 
 * Service để giao tiếp với Groq API
 * Sử dụng model openai/gpt-oss-20b
 */

// ============================================
// CẤU HÌNH API
// ============================================
// Đọc từ environment variables (file .env)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "openai/gpt-oss-20b"; // Model GPT-OSS-20B
// ============================================
// HÀM GỬI TIN NHẮN ĐẾN GROQ API
// ============================================
/**
 * Gửi tin nhắn đến Groq API và nhận phản hồi từ AI
 * 
 * @param {string} userMessage - Tin nhắn của người dùng
 * @param {Array} conversationHistory - Lịch sử hội thoại (tùy chọn)
 * @param {string} systemPrompt - System prompt để hướng dẫn AI (tùy chọn)
 * @param {Object} options - Tùy chọn: {stream, temperature, maxTokens}
 * @returns {Promise<Object>} - Phản hồi từ API chứa message của AI
 */
export const sendGroqMessage = async (
  userMessage, 
  conversationHistory = [], 
  systemPrompt = null,
  options = {}
) => {
  try {
    // Kiểm tra input
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      throw new Error('Tin nhắn không được để trống');
    }

    // Tạo mảng messages cho API
    const messages = [];

    // Thêm system prompt nếu có
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // Thêm lịch sử hội thoại nếu có
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Thêm tin nhắn hiện tại của user
    messages.push({
      role: 'user',
      content: userMessage.trim()
    });

    // Tạo request body
    const requestBody = {
      model: GROQ_MODEL,
      messages: messages,
      temperature: options.temperature ?? 1,
      max_completion_tokens: options.maxTokens ?? 8192,
      top_p: options.topP ?? 1,
      stream: options.stream ?? false, // Tắt streaming mặc định để đơn giản
      reasoning_effort: options.reasoningEffort ?? "medium",
      stop: options.stop ?? null
    };

    // Gửi request đến Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // Kiểm tra response status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Xử lý lỗi rate limit (429)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) : 10;
        const error = new Error(`Rate limit exceeded. Vui lòng đợi ${waitTime} giây trước khi thử lại.`);
        error.status = 429;
        error.retryAfter = waitTime;
        throw error;
      }
      
      // Xử lý các lỗi khác
      const error = new Error(
        `API Error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
      );
      error.status = response.status;
      throw error;
    }

    // Parse response JSON
    const responseData = await response.json();

    // Kiểm tra và trả về message từ AI
    if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
      return {
        success: true,
        message: responseData.choices[0].message.content,
        role: responseData.choices[0].message.role || 'assistant',
        usage: responseData.usage || null, // Thông tin về tokens đã sử dụng
        model: responseData.model || GROQ_MODEL,
        finishReason: responseData.choices[0].finish_reason || null
      };
    } else {
      throw new Error('Không nhận được phản hồi hợp lệ từ API');
    }

  } catch (error) {
    // Xử lý lỗi
    console.error('Groq API Error:', error);
    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra khi gọi API',
      message: null,
      status: error.status || null,
      retryAfter: error.retryAfter || null
    };
  }
};

// ============================================
// HÀM GỬI TIN NHẮN VỚI STREAMING (Tùy chọn)
// ============================================
/**
 * Gửi tin nhắn với streaming response
 * 
 * @param {string} userMessage - Tin nhắn của người dùng
 * @param {Array} conversationHistory - Lịch sử hội thoại
 * @param {string} systemPrompt - System prompt
 * @param {Function} onChunk - Callback khi nhận được chunk mới: (chunk: string) => void
 * @returns {Promise<Object>} - Kết quả cuối cùng
 */
export const sendGroqMessageStream = async (
  userMessage,
  conversationHistory = [],
  systemPrompt = null,
  onChunk = null
) => {
  try {
    // Kiểm tra input
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      throw new Error('Tin nhắn không được để trống');
    }

    // Tạo mảng messages
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }
    messages.push({ role: 'user', content: userMessage.trim() });

    // Gửi request với streaming
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: messages,
        temperature: 1,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: true,
        reasoning_effort: "medium",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Đọc stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              if (onChunk) {
                onChunk(content);
              }
            }
          } catch (e) {
            // Bỏ qua lỗi parse JSON
          }
        }
      }
    }

    return {
      success: true,
      message: fullContent,
      role: 'assistant',
      model: GROQ_MODEL
    };

  } catch (error) {
    console.error('Groq Streaming Error:', error);
    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra khi streaming',
      message: null
    };
  }
};

// Export constants
export { GROQ_API_KEY, GROQ_API_URL, GROQ_MODEL };
