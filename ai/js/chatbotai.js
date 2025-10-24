const gemini_key="AIzaSyDHJAtca_KspoAwjhYWxrSUnvO3y8JG1gI";

// API Backend URL
const API_BASE_URL = 'http://localhost:3306/api/books';

// Lưu trữ cuộc hội thoại
const conversations = [];

// Biến lưu trữ dữ liệu sách từ database
let storeBooks = [];

// Hàm lấy dữ liệu sách từ API
async function fetchStoreData() {
    try {
        const response = await fetch(`${API_BASE_URL}/chatbot/data`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const books = await response.json();
        
        // Tạo chuỗi thông tin sách từ dữ liệu API
        const booksInfo = books.map(book => 
            `- ${book.title} (${new Intl.NumberFormat('vi-VN').format(book.price)}đ) - ${book.author_name || 'Chưa có tác giả'} - ${book.category_name || 'Chưa phân loại'}`
        ).join('\n');
        
        storeBooks = `
Smart Book Store là cửa hàng sách trực tuyến với ${books.length} sản phẩm:

${booksInfo}

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

// Tải dữ liệu khi khởi tạo
fetchStoreData();

// xu ly su kien cua nguoi dung
document
.querySelector('.input-area button')
.addEventListener('click', sendmessage);
function sendmessage() {
    // lay du lieu trong input
    const userMessage = document.querySelector(".input-area input").value.trim();
    
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
        
        // Gui du lieu len model
        goiDulieu();
    }
}

async function goiDulieu() {
    try {
        // Tao system instruction voi thong tin cua hang
        const systemInstruction = `Bạn là trợ lý AI của Smart Book Store. Hãy trả lời các câu hỏi của khách hàng dựa trên thông tin sau:

${storeBooks}

Hãy trả lời một cách thân thiện, hữu ích và chính xác. Nếu khách hàng hỏi về sách không có trong danh sách, hãy đề xuất những sách tương tự hoặc thông báo rằng hiện tại chưa có.`;

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
                    <p>${aiResponse}</p>
                </div>`
            );
            
            // Them vao conversations
            conversations.push({
                role: "model",
                parts: [{ text: aiResponse }]
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
}
