const gemini_key="AIzaSyDHJAtca_KspoAwjhYWxrSUnvO3y8JG1gI";

// API Backend URL
const API_BASE_URL = 'http://localhost:3306/api/books';
const API_BASE_ROOT = 'http://localhost:3306/api';

// Cấu hình hội thoại
const MAX_TURNS = 6; // giới hạn số lượt trao đổi gần nhất để giữ câu trả lời tập trung
const TRAINING_STORAGE_KEY = 'smartbook_training_logs';
const TRAINING_QUEUE_KEY = 'smartbook_training_logs_queue';

let isRequesting = false;
let lastQuestion = '';

function appendTrainingLog(entry) {
    try {
        const raw = localStorage.getItem(TRAINING_STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.push(entry);
        // giữ tối đa 500 bản ghi gần nhất
        localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(list.slice(-500)));
        // Đồng thời đẩy vào hàng đợi đồng bộ nền
        const qraw = localStorage.getItem(TRAINING_QUEUE_KEY);
        const queue = qraw ? JSON.parse(qraw) : [];
        queue.push(entry);
        localStorage.setItem(TRAINING_QUEUE_KEY, JSON.stringify(queue.slice(-1000)));
        // thử sync nền
        flushTrainingQueue();
    } catch (e) {
        // bỏ qua lỗi quota hoặc JSON
    }
}

function renderTextToHtml(text) {
    // escape HTML đơn giản và chuyển \n thành <br>
    const escaped = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return escaped.replace(/\n/g, '<br>');
}

// Lưu trữ cuộc hội thoại
const conversations = [];

// Biến lưu trữ dữ liệu sách từ database
let storeBooks = [];

// Hàm lấy dữ liệu sách/tác giả/danh mục từ API
async function fetchStoreData() {
    try {
        // Ưu tiên endpoint chuyên biệt nếu sẵn có, sau đó fallback về các API tổng hợp
        let books = [];
        try {
            const res = await fetch(`${API_BASE_URL}/chatbot/data`);
            if (res.ok) {
                books = await res.json();
            }
        } catch (_) {}

        const [booksRes, categoriesRes, authorsRes] = await Promise.all([
            books.length ? Promise.resolve(null) : fetch(`${API_BASE_ROOT}/books?limit=100`),
            fetch(`${API_BASE_ROOT}/categories`),
            fetch(`${API_BASE_ROOT}/authors`)
        ]);

        if (!books.length && booksRes && booksRes.ok) {
            const booksPayload = await booksRes.json();
            // Một số API trả về {success, data}
            books = Array.isArray(booksPayload) ? booksPayload : (booksPayload.data || []);
        }
        const categoriesPayload = categoriesRes && categoriesRes.ok ? await categoriesRes.json() : [];
        const authorsPayload = authorsRes && authorsRes.ok ? await authorsRes.json() : [];
        const categories = Array.isArray(categoriesPayload) ? categoriesPayload : (categoriesPayload.data || []);
        const authors = Array.isArray(authorsPayload) ? authorsPayload : (authorsPayload.data || []);
        
        // Bổ sung đánh giá trung bình và tồn kho (nếu có quyền)
        const [ratingsMap, stockMap] = await Promise.all([
            fetchRatingsForBooks(books),
            fetchInventoryForBooks(books)
        ]);

        // Tạo chuỗi thông tin sách từ dữ liệu API
        const booksInfo = books.map(book => {
            const id = book.id || book.book_id || book._id;
            const rating = ratingsMap[id];
            const stock = stockMap[id];
            const ratingStr = rating ? ` - ⭐ ${Number(rating).toFixed(1)}/5` : '';
            const stockStr = typeof stock === 'number' ? ` - Tồn: ${stock}` : '';
            return `- ${book.title} (${new Intl.NumberFormat('vi-VN').format(book.price)}đ) - ${book.author_name || 'Chưa có tác giả'} - ${book.category_name || 'Chưa phân loại'}${ratingStr}${stockStr}`;
        }).join('\n');
        
        storeBooks = `
Smart Book Store là cửa hàng sách trực tuyến với ${books.length} sản phẩm, ${categories.length} danh mục và ${authors.length} tác giả:

${booksInfo}

Danh mục phổ biến: ${categories.slice(0,8).map(c=>c.name || c.category_name).filter(Boolean).join(', ')}

Chương trình khuyến mãi:
- Giảm 10% cho đơn hàng từ 300,000đ
- Giảm 15% cho đơn hàng từ 500,000đ
- Miễn phí ship cho đơn hàng từ 200,000đ

Liên hệ: Hotline 1900-xxxx, Email info@smartbookstore.com
`;
        
        console.log('Đã tải dữ liệu sách từ database:', books.length, 'sách');
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu sách:', error);
        // Fallback data nếu không kết nối được API
        storeBooks = `
Smart Book Store là cửa hàng sách trực tuyến. 
Hiện tại không thể kết nối đến cơ sở dữ liệu.
Vui lòng thử lại sau hoặc liên hệ: Hotline 1900-xxxx
`;
    }
}

async function fetchRatingsForBooks(books) {
    const result = {};
    try {
        const top = books.slice(0, 20);
        const tasks = top.map(async (b) => {
            const id = b.id || b.book_id || b._id;
            if (!id) return;
            try {
                const res = await fetch(`${API_BASE_ROOT}/reviews/book/${id}/average`);
                if (!res.ok) return;
                const payload = await res.json();
                const value = typeof payload === 'number' ? payload : (payload.data || payload.average || payload.avg || null);
                if (value != null) result[id] = value;
            } catch (_) {}
        });
        await Promise.all(tasks);
    } catch (_) {}
    return result;
}

async function fetchInventoryForBooks(books) {
    // Ưu tiên endpoint public an toàn
    const result = {};
    try {
        const top = books.slice(0, 20);
        const ids = top.map(b => b.id || b.book_id || b._id).filter(Boolean);
        if (!ids.length) return result;
        const res = await fetch(`${API_BASE_ROOT}/warehouse/public/display-quantities?book_ids=${encodeURIComponent(ids.join(','))}`);
        if (res.ok) {
            const payload = await res.json();
            const map = payload && (payload.data || {});
            Object.assign(result, map);
            return result;
        }
    } catch (_) {}

    // Fallback: nếu có token admin thì gọi endpoint chi tiết
    try {
        const token = localStorage.getItem('token');
        if (!token) return result;
        const top = books.slice(0, 20);
        await Promise.all(top.map(async (b) => {
            const id = b.id || b.book_id || b._id; if (!id) return;
            try {
                const res = await fetch(`${API_BASE_ROOT}/warehouse/${id}`, { headers: { 'Authorization': `Bearer ${token}` }});
                if (!res.ok) return;
                const payload = await res.json();
                const qty = payload && (payload.quantity || payload.qty || payload.stock || (payload.data && payload.data.quantity));
                if (typeof qty === 'number') result[id] = qty;
            } catch (_) {}
        }));
    } catch (_) {}
    return result;
}

async function flushTrainingQueue() {
    try {
        const raw = localStorage.getItem(TRAINING_QUEUE_KEY);
        const queue = raw ? JSON.parse(raw) : [];
        if (!queue.length) return;
        const token = localStorage.getItem('token');
        const endpoints = [
            `${API_BASE_ROOT}/chatbot/logs`,
            `${API_BASE_ROOT}/tracking/chatbot`,
            `${API_BASE_ROOT}/tracking/chatbot-log`
        ];
        const headers = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
        let sent = false;
        for (const ep of endpoints) {
            try {
                const res = await fetch(ep, { method: 'POST', headers, body: JSON.stringify({ logs: queue }) });
                if (res.ok) { sent = true; break; }
            } catch (_) {}
        }
        if (sent) localStorage.removeItem(TRAINING_QUEUE_KEY);
    } catch (_) {}
}

// Tải dữ liệu khi khởi tạo
fetchStoreData();

// xu ly su kien cua nguoi dung
document
.querySelector('.input-area button')
.addEventListener('click', sendmessage);

// Gửi bằng phím Enter
const inputEl = document.querySelector('.input-area input');
if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendmessage();
        }
    });
}
function sendmessage() {
    // lay du lieu trong input
    const userMessage = document.querySelector(".input-area input").value.trim();
    
    if(!userMessage.length || isRequesting) {
        return;
    }

    if(userMessage.length) {
        //xoa du lieu trong input
        document.querySelector(".input-area input").value = "";
        
        // Hien thi tin nhan cua user
        document.querySelector(".chatwindow .chat").insertAdjacentHTML("beforeend",
            `<div class="user">
                <p>${userMessage}</p>
            </div>`
        );
        
        // Them vao conversations
        conversations.push({
            role: "user",
            parts: [{ text: userMessage }]
        });
        // chỉ giữ lại lịch sử gần nhất để model trả lời trọng tâm
        if (conversations.length > MAX_TURNS * 2) {
            conversations.splice(0, conversations.length - MAX_TURNS * 2);
        }
        lastQuestion = userMessage;
        
        // Gui du lieu len model
        goiDulieu();
    }
}

async function goiDulieu() {
    try {
        isRequesting = true;
        // Tao system instruction voi thong tin cua hang
        const systemInstruction = `Bạn là trợ lý AI tiếng Việt của Smart Book Store.
Nhiệm vụ: trả lời NGẮN GỌN và TRỌNG TÂM như chuyên gia; ưu tiên gạch đầu dòng, bảng so sánh khi hợp lý; nêu rõ tên sách, giá (vi-VN), tác giả, thể loại, tóm tắt ngắn, ai nên đọc, và 3–5 gợi ý liên quan. Nếu không có dữ liệu, hãy nói rõ và đề xuất lựa chọn gần nhất. Tránh nói dài, không bịa thông tin tồn kho.

Ngữ cảnh cửa hàng:
${storeBooks}

Nguyên tắc:
- Trả lời bằng tiếng Việt tự nhiên, rõ ràng, không dài dòng.
- Tối đa 6 gạch đầu dòng cho phần khuyến nghị.
- Với câu hỏi quy trình (mua, giao, đổi trả), trả lời theo các bước ngắn.`;

        // Tao request body voi conversation history
        const requestBody = {
            contents: conversations,
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            }
        };

        console.log("Sending request:", requestBody);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${gemini_key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": gemini_key
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Response:", data);
        
        // Hien thi phan hoi tu AI
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Hien thi trong chat
            document.querySelector(".chatwindow .chat").insertAdjacentHTML("beforeend",
                `<div class="model">
                    <p>${renderTextToHtml(aiResponse)}</p>
                </div>`
            );
            
            // Them vao conversations
            conversations.push({
                role: "model",
                parts: [{ text: aiResponse }]
            });

            // Lưu thầm vào localStorage để có dữ liệu huấn luyện dần
            appendTrainingLog({
                time: new Date().toISOString(),
                question: lastQuestion,
                answer: aiResponse
            });
        } else {
            throw new Error("No response from AI");
        }
        
    } catch (error) {
        console.error("Error:", error);
        document.querySelector(".chatwindow .chat").insertAdjacentHTML("beforeend",
            `<div class="model">
                <p>Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.</p>
            </div>`
        );
    }
    finally {
        isRequesting = false;
    }
}
