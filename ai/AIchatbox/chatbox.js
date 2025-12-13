/**
 * AI Chatbox - JavaScript Logic
 * 
 * File này chứa toàn bộ logic cho AI Chatbox
 * Bao gồm: Groq API integration, message formatting, rate limiting
 */

// ============================================
// CẤU HÌNH GROQ API
// ============================================
// Đọc từ config.js (file này không được commit, mỗi dev tự tạo từ config.example.js)
// Nếu không có config.js, sẽ sử dụng giá trị mặc định (không khuyến khích)
const config = window.CHATBOX_CONFIG || {};

const GROQ_API_KEY = config.GROQ_API_KEY || "";
const GROQ_API_URL = config.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = config.GROQ_MODEL || "openai/gpt-oss-20b";

// Kiểm tra API key khi load
if (!GROQ_API_KEY) {
    console.warn('[AI Chatbox] GROQ_API_KEY chưa được cấu hình. Vui lòng tạo file config.js');
}

// ============================================
// STATE MANAGEMENT
// ============================================
let chatMessages = [];
let conversationHistory = [];
let chatLoading = false;
let attachedFile = null;
let cooldownUntil = 0;
let lastRequestTime = 0;
let cooldownRemaining = 0;

// ============================================
// DOM ELEMENTS
// ============================================
const chatMessagesEl = document.getElementById('chatMessages');
const chatInputEl = document.getElementById('chatInput');
const sendButtonEl = document.getElementById('sendButton');
const fileInputEl = document.getElementById('fileInput');
const filePreviewEl = document.getElementById('filePreview');
const fileNameEl = document.getElementById('fileName');
const removeFileEl = document.getElementById('removeFile');

// ============================================
// UTILITY FUNCTIONS
// ============================================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API Base URL - đọc từ config.js hoặc window hoặc dùng default
const API_BASE_URL = config.API_BASE_URL 
    || (typeof window !== 'undefined' && window.__SMART_BOOK_API_BASE_URL__) 
    || 'http://localhost:5000/api';

// ============================================
// TRANSLATION FUNCTIONS
// ============================================
/**
 * Phát hiện xem tin nhắn có phải là yêu cầu dịch không
 * Hỗ trợ các format:
 * - "dịch: [text]" hoặc "dịch [text]"
 * - "translate: [text]" hoặc "translate [text]"
 * - "vi-en: [text]" hoặc "en-vi: [text]"
 */
function detectTranslationRequest(message) {
    // Pattern 1: "dịch:" hoặc "dịch " ở đầu
    const translatePattern = /^(dịch|translate)\s*:?\s*(.+)$/i;
    const match = message.match(translatePattern);
    if (match) {
        return {
            isTranslation: true,
            text: match[2].trim(),
            direction: 'auto' // Tự động phát hiện
        };
    }
    
    // Pattern 2: "vi-en:" hoặc "vi-en " hoặc "en-vi:" hoặc "en-vi "
    const directionPattern = /^(vi-en|en-vi)\s*:?\s*(.+)$/i;
    const directionMatch = message.match(directionPattern);
    if (directionMatch) {
        return {
            isTranslation: true,
            text: directionMatch[2].trim(),
            direction: directionMatch[1].toLowerCase()
        };
    }
    
    return { isTranslation: false };
}

/**
 * Gọi API dịch
 */
async function translateText(text, direction = 'auto') {
    try {
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/translation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify({
                text: text,
                direction: direction
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success && data.data && data.data.translation) {
            return {
                success: true,
                translation: data.data.translation,
                metadata: data.data.metadata || null
            };
        } else {
            throw new Error(data.message || 'Không nhận được kết quả dịch hợp lệ');
        }
    } catch (error) {
        console.error('Translation API Error:', error);
        return {
            success: false,
            error: error.message || 'Có lỗi xảy ra khi dịch'
        };
    }
}

// ============================================
// HÀM FORMAT TIN NHẮN AI THÀNH CÁC SECTIONS
// ============================================
function formatAIMessage(text) {
    if (!text) return [];

    const sections = [];
    const lines = text.split('\n');
    let currentSection = { type: 'paragraph', content: [] };
    let currentList = null;
    let emptyLineCount = 0;

    lines.forEach((line) => {
        const trimmedLine = line.trim();
        
        // Kiểm tra tiêu đề
        const isTitle = trimmedLine.match(/^\*\*.*\*\*$/) || 
                     (trimmedLine.match(/^[A-ZÀ-ỸẠ-Ỹ][^:]*:$/) && trimmedLine.length < 100) ||
                     (trimmedLine.match(/^[A-ZÀ-ỸẠ-Ỹ]/) && trimmedLine.length < 80 && !trimmedLine.includes('.') && !trimmedLine.includes(','));

        if (isTitle) {
            if (currentSection.content.length > 0 || currentList) {
                if (currentList) {
                    currentSection.content.push(currentList);
                    currentList = null;
                }
                sections.push(currentSection);
            }
            
            const titleText = trimmedLine.replace(/\*\*/g, '').replace(/:$/, '').trim();
            sections.push({
                type: 'title',
                content: [titleText]
            });
            currentSection = { type: 'paragraph', content: [] };
            emptyLineCount = 0;
        }
        // Danh sách có số
        else if (trimmedLine.match(/^\d+\.\s+/)) {
            if (currentList && currentList.type !== 'numbered') {
                currentSection.content.push(currentList);
                currentList = null;
            }
            if (!currentList) {
                currentList = { type: 'numbered', items: [] };
            }
            const itemText = trimmedLine.replace(/^\d+\.\s+/, '').trim();
            currentList.items.push(itemText);
            emptyLineCount = 0;
        }
        // Danh sách bullet
        else if (trimmedLine.match(/^[-•*]\s+/)) {
            if (currentList && currentList.type !== 'bullet') {
                currentSection.content.push(currentList);
                currentList = null;
            }
            if (!currentList) {
                currentList = { type: 'bullet', items: [] };
            }
            const itemText = trimmedLine.replace(/^[-•*]\s+/, '').trim();
            currentList.items.push(itemText);
            emptyLineCount = 0;
        }
        // Dòng trống
        else if (trimmedLine === '') {
            emptyLineCount++;
            if (emptyLineCount >= 2) {
                if (currentList) {
                    currentSection.content.push(currentList);
                    currentList = null;
                }
                if (currentSection.content.length > 0) {
                    sections.push(currentSection);
                    currentSection = { type: 'paragraph', content: [] };
                }
                emptyLineCount = 0;
            }
        }
        // Nội dung thường
        else {
            emptyLineCount = 0;
            if (currentList) {
                currentSection.content.push(currentList);
                currentList = null;
            }
            if (trimmedLine.length > 0) {
                currentSection.content.push(trimmedLine);
            }
        }
    });

    if (currentList) {
        currentSection.content.push(currentList);
    }
    if (currentSection.content.length > 0) {
        sections.push(currentSection);
    }

    if (sections.length === 0) {
        return [{ type: 'paragraph', content: [text.trim()] }];
    }

    return sections;
}

// ============================================
// GROQ API FUNCTIONS
// ============================================
async function sendGroqMessage(userMessage, conversationHistory = [], systemPrompt = null, options = {}) {
    try {
        if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
            throw new Error('Tin nhắn không được để trống');
        }

        const messages = [];

        if (systemPrompt) {
            messages.push({ role: 'system', content: systemPrompt });
        }

        if (Array.isArray(conversationHistory) && conversationHistory.length > 0) {
            messages.push(...conversationHistory);
        }

        messages.push({ role: 'user', content: userMessage.trim() });

        const requestBody = {
            model: GROQ_MODEL,
            messages: messages,
            temperature: options.temperature ?? 1,
            max_completion_tokens: options.maxTokens ?? 8192,
            top_p: options.topP ?? 1,
            stream: false,
            reasoning_effort: options.reasoningEffort ?? "medium",
        };

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 429) {
                const retryAfter = response.headers.get('Retry-After');
                const waitTime = retryAfter ? parseInt(retryAfter) : 10;
                const error = new Error(`Rate limit exceeded. Vui lòng đợi ${waitTime} giây trước khi thử lại.`);
                error.status = 429;
                error.retryAfter = waitTime;
                throw error;
            }
            
            const error = new Error(
                `API Error: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`
            );
            error.status = response.status;
            throw error;
        }

        const responseData = await response.json();

        if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
            return {
                success: true,
                message: responseData.choices[0].message.content,
                role: responseData.choices[0].message.role || 'assistant',
                usage: responseData.usage || null,
                model: responseData.model || GROQ_MODEL,
            };
        } else {
            throw new Error('Không nhận được phản hồi hợp lệ từ API');
        }

    } catch (error) {
        console.error('Groq API Error:', error);
        return {
            success: false,
            error: error.message || 'Có lỗi xảy ra khi gọi API',
            message: null,
            status: error.status || null,
            retryAfter: error.retryAfter || null
        };
    }
}

// ============================================
// SYSTEM INSTRUCTION
// ============================================
function createSystemInstruction(analyticsData = null) {
    let analyticsInfo = '';
    
    if (analyticsData) {
        analyticsInfo = `
DỮ LIỆU ANALYTICS HIỆN TẠI:
- Doanh thu: ${analyticsData.revenue || 'N/A'}
- Đơn hàng: ${analyticsData.orders || 'N/A'}
- Tồn kho thấp: ${analyticsData.lowStock || 0} sản phẩm
- Tồn kho cao: ${analyticsData.overstock || 0} sản phẩm
- Đánh giá: ${analyticsData.reviews || 0} lượt
- Tỷ lệ chuyển đổi: ${analyticsData.conversionRate || 'N/A'}
`;
    }

    return `Bạn là trợ lý AI của Smart Book Store Admin Dashboard. Hãy trả lời các câu hỏi của admin về dữ liệu analytics và quản lý cửa hàng.

${analyticsInfo}

HƯỚNG DẪN TRẢ LỜI:
- Trả lời một cách chuyên nghiệp, chính xác và hữu ích bằng tiếng Việt
- Phân tích dữ liệu analytics và đưa ra insights
- Đề xuất các hành động cải thiện dựa trên dữ liệu
- Trả lời về doanh thu, đơn hàng, tồn kho, đánh giá, hành vi khách hàng
- Hỗ trợ dịch thuật: Nếu người dùng cần dịch nội dung, hướng dẫn họ sử dụng format "dịch: [nội dung]" hoặc "translate: [nội dung]" hoặc "vi-en: [nội dung]" / "en-vi: [nội dung]"
- Luôn giữ thái độ chuyên nghiệp và hỗ trợ admin ra quyết định`;
}

// ============================================
// RENDER FUNCTIONS
// ============================================
function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-chat-message admin-chat-message-${message.role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'admin-chat-message-content';

    if (message.file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'admin-chat-file-attachment';
        fileDiv.innerHTML = `
            <i class="fas fa-paperclip"></i>
            <span>${message.file.name}</span>
            <span class="admin-chat-file-size">(${(message.file.size / 1024).toFixed(1)} KB)</span>
        `;
        contentDiv.appendChild(fileDiv);
    }

    if (message.role === 'assistant') {
        const formattedContent = document.createElement('div');
        formattedContent.className = 'admin-chat-formatted-content';
        
        const sections = formatAIMessage(message.text);
        sections.forEach((section, sectionIndex) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = `admin-chat-section admin-chat-section-${section.type}`;
            
            if (section.type === 'title') {
                const title = document.createElement('h3');
                title.className = 'admin-chat-section-title';
                title.textContent = section.content[0];
                sectionDiv.appendChild(title);
            } else if (section.type === 'paragraph') {
                section.content.forEach((item, itemIndex) => {
                    if (typeof item === 'string') {
                        const p = document.createElement('p');
                        p.className = 'admin-chat-section-text';
                        p.textContent = item;
                        sectionDiv.appendChild(p);
                    } else if (item.type === 'bullet') {
                        const ul = document.createElement('ul');
                        ul.className = 'admin-chat-section-list admin-chat-section-bullet';
                        item.items.forEach(listItem => {
                            const li = document.createElement('li');
                            li.textContent = listItem;
                            ul.appendChild(li);
                        });
                        sectionDiv.appendChild(ul);
                    } else if (item.type === 'numbered') {
                        const ol = document.createElement('ol');
                        ol.className = 'admin-chat-section-list admin-chat-section-numbered';
                        item.items.forEach(listItem => {
                            const li = document.createElement('li');
                            li.textContent = listItem;
                            ol.appendChild(li);
                        });
                        sectionDiv.appendChild(ol);
                    }
                });
            }
            
            formattedContent.appendChild(sectionDiv);
        });
        
        contentDiv.appendChild(formattedContent);
    } else {
        const p = document.createElement('p');
        p.textContent = message.text;
        contentDiv.appendChild(p);
    }

    const timestamp = document.createElement('span');
    timestamp.className = 'admin-chat-timestamp';
    timestamp.textContent = new Date(message.timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    contentDiv.appendChild(timestamp);

    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

function renderLoading() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'admin-chat-message admin-chat-message-assistant';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'admin-chat-message-content';
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'admin-chat-loading';
    loadingDiv.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(loadingDiv);
    messageDiv.appendChild(contentDiv);
    return messageDiv;
}

function updateChatDisplay() {
    // Xóa welcome message nếu có tin nhắn
    const welcomeEl = chatMessagesEl.querySelector('.admin-chat-welcome');
    if (welcomeEl && chatMessages.length > 0) {
        welcomeEl.remove();
    }

    // Render messages
    chatMessagesEl.innerHTML = '';
    chatMessages.forEach(message => {
        chatMessagesEl.appendChild(renderMessage(message));
    });

    // Scroll to bottom
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// ============================================
// SEND MESSAGE FUNCTION
// ============================================
async function handleSendMessage() {
    if (!chatInputEl.value.trim() && !attachedFile) return;
    if (chatLoading) return;

    const now = Date.now();
    if (now < cooldownUntil) {
        const remainingSeconds = Math.ceil((cooldownUntil - now) / 1000);
        cooldownRemaining = remainingSeconds;
        const errorMessage = {
            id: Date.now(),
            role: 'assistant',
            text: `API đang bị giới hạn tốc độ. Vui lòng đợi ${remainingSeconds} giây trước khi gửi tin nhắn tiếp theo.`,
            timestamp: new Date()
        };
        chatMessages.push(errorMessage);
        updateChatDisplay();
        return;
    }

    const timeSinceLastRequest = now - lastRequestTime;
    if (timeSinceLastRequest < 1000) {
        await delay(1000 - timeSinceLastRequest);
    }

    const userMessage = chatInputEl.value.trim();
    const newMessage = {
        id: Date.now(),
        role: 'user',
        text: userMessage,
        file: attachedFile ? {
            name: attachedFile.name,
            type: attachedFile.type,
            size: attachedFile.size
        } : null,
        timestamp: new Date()
    };

    chatMessages.push(newMessage);
    chatInputEl.value = '';
    attachedFile = null;
    filePreviewEl.style.display = 'none';
    chatLoading = true;
    lastRequestTime = Date.now();

    // Update UI
    sendButtonEl.disabled = true;
    chatInputEl.disabled = true;
    updateChatDisplay();
    
    // Show loading
    const loadingEl = renderLoading();
    chatMessagesEl.appendChild(loadingEl);
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;

    // Kiểm tra xem có phải yêu cầu dịch không
    const translationRequest = detectTranslationRequest(userMessage);
    
    if (translationRequest.isTranslation) {
        try {
            const translationResult = await translateText(
                translationRequest.text,
                translationRequest.direction
            );
            
            // Remove loading
            loadingEl.remove();
            
            if (translationResult.success) {
                const directionText = translationRequest.direction === 'auto' 
                    ? 'tự động' 
                    : (translationRequest.direction === 'vi-en' ? 'Việt → Anh' : 'Anh → Việt');
                
                const aiMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: `**Bản dịch (${directionText}):**\n\n${translationResult.translation}`,
                    timestamp: new Date()
                };
                
                chatMessages.push(aiMessage);
            } else {
                const errorMessage = {
                    id: Date.now() + 1,
                    role: 'assistant',
                    text: `Xin lỗi, không thể dịch nội dung. Lỗi: ${translationResult.error || 'Không xác định'}`,
                    timestamp: new Date()
                };
                chatMessages.push(errorMessage);
            }
        } catch (error) {
            loadingEl.remove();
            const errorMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                text: `Xin lỗi, có lỗi xảy ra khi dịch: ${error.message || 'Lỗi không xác định'}`,
                timestamp: new Date()
            };
            chatMessages.push(errorMessage);
        } finally {
            chatLoading = false;
            sendButtonEl.disabled = false;
            chatInputEl.disabled = false;
            updateChatDisplay();
        }
        return;
    }

    // Update conversation history
    conversationHistory.push({ role: "user", content: userMessage });
    if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
    }

    try {
        const systemInstruction = createSystemInstruction();
        
        const response = await sendGroqMessage(
            userMessage,
            conversationHistory.slice(0, -1),
            systemInstruction,
            {
                temperature: 1,
                maxTokens: 8192,
                topP: 1,
                reasoningEffort: "medium"
            }
        );

        // Remove loading
        loadingEl.remove();

        if (response.success && response.message) {
            const aiMessage = {
                id: Date.now() + 1,
                role: 'assistant',
                text: response.message,
                timestamp: new Date()
            };

            chatMessages.push(aiMessage);
            conversationHistory.push({
                role: "assistant",
                content: response.message
            });

            cooldownUntil = 0;
            cooldownRemaining = 0;
        } else {
            const error = new Error(response.error || "No response from AI");
            if (response.status === 429) {
                error.status = 429;
                error.retryAfter = response.retryAfter || 10;
            }
            throw error;
        }
    } catch (error) {
        loadingEl.remove();
        
        let errorText = "Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.";
        let retryAfter = null;
        
        if (error.message) {
            if (error.message.includes('Rate limit') || error.status === 429) {
                retryAfter = error.retryAfter || 10;
                errorText = `API đang bị giới hạn tốc độ. Vui lòng đợi ${retryAfter} giây trước khi thử lại.`;
                cooldownUntil = Date.now() + (retryAfter * 1000);
                cooldownRemaining = retryAfter;
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorText = "Lỗi xác thực API. Vui lòng kiểm tra cấu hình API key.";
            } else if (error.message.includes('500')) {
                errorText = "Lỗi server. Vui lòng thử lại sau.";
            } else {
                errorText = error.message || errorText;
            }
        }
        
        const errorMessage = {
            id: Date.now() + 1,
            role: 'assistant',
            text: errorText,
            timestamp: new Date()
        };
        chatMessages.push(errorMessage);
    } finally {
        chatLoading = false;
        sendButtonEl.disabled = false;
        chatInputEl.disabled = false;
        updateChatDisplay();
    }
}

// ============================================
// FILE HANDLING
// ============================================
function handleFileAttach(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
            return;
        }
        attachedFile = file;
        fileNameEl.textContent = file.name;
        filePreviewEl.style.display = 'flex';
    }
}

function handleRemoveFile() {
    attachedFile = null;
    fileInputEl.value = '';
    filePreviewEl.style.display = 'none';
}

// ============================================
// EVENT LISTENERS
// ============================================
sendButtonEl.addEventListener('click', handleSendMessage);

chatInputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendButtonEl.disabled) {
        handleSendMessage();
    }
});

fileInputEl.addEventListener('change', handleFileAttach);
removeFileEl.addEventListener('click', handleRemoveFile);

// ============================================
// INITIALIZE
// ============================================
updateChatDisplay();

