/* eslint-disable */
// Static copy of AI chatbot logic for public site usage
// The content mirrors ai/js/chatbotai.js but without imports, so it can run standalone
(function(){
  const gemini_key = "AIzaSyDHJAtca_KspoAwjhYWxrSUnvO3y8JG1gI";
  const API_BASE_URL = 'http://localhost:3306/api/books';
  const MAX_TURNS = 6;
  const TRAINING_STORAGE_KEY = 'smartbook_training_logs';
  const TRAINING_QUEUE_KEY = 'smartbook_training_logs_queue';

  let isRequesting = false;
  let lastQuestion = '';
  const conversations = [];
  let storeBooks = [];

  function appendTrainingLog(entry){
    try{
      const raw = localStorage.getItem(TRAINING_STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(entry);
      localStorage.setItem(TRAINING_STORAGE_KEY, JSON.stringify(list.slice(-500)));
      const qraw = localStorage.getItem(TRAINING_QUEUE_KEY);
      const queue = qraw ? JSON.parse(qraw) : [];
      queue.push(entry);
      localStorage.setItem(TRAINING_QUEUE_KEY, JSON.stringify(queue.slice(-1000)));
      flushTrainingQueue();
    }catch(_){ }
  }

  function renderTextToHtml(text){
    const escaped = String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return escaped.replace(/\n/g,'<br>');
  }

  async function fetchStoreData(){
    try{
      let books = [];
      try{
        const r = await fetch(`${API_BASE_URL}/chatbot/data`);
        if (r.ok) books = await r.json();
      }catch(_){ }

      const categoriesRes = await fetch('http://localhost:3306/api/categories');
      const authorsRes = await fetch('http://localhost:3306/api/authors');
      const categoriesPayload = categoriesRes && categoriesRes.ok ? await categoriesRes.json() : [];
      const authorsPayload = authorsRes && authorsRes.ok ? await authorsRes.json() : [];
      const categories = Array.isArray(categoriesPayload) ? categoriesPayload : (categoriesPayload.data || []);
      const authors = Array.isArray(authorsPayload) ? authorsPayload : (authorsPayload.data || []);

      if (!books.length){
        const bres = await fetch('http://localhost:3306/api/books?limit=100');
        if (bres.ok){
          const payload = await bres.json();
          books = Array.isArray(payload) ? payload : (payload.data || []);
        }
      }

      const [ratingsMap, stockMap] = await Promise.all([
        fetchRatingsForBooks(books),
        fetchInventoryForBooks(books)
      ]);

      const info = books.map(b=>{
        const id = b.id || b.book_id || b._id;
        const rating = ratingsMap[id];
        const stock = stockMap[id];
        const ratingStr = rating ? ` - ⭐ ${Number(rating).toFixed(1)}/5` : '';
        const stockStr = typeof stock === 'number' ? ` - Tồn: ${stock}` : '';
        return `- ${b.title} (${new Intl.NumberFormat('vi-VN').format(b.price)}đ) - ${b.author_name || 'Chưa có tác giả'} - ${b.category_name || 'Chưa phân loại'}${ratingStr}${stockStr}`;
      }).join('\n');

      const catsStr = categories.slice(0,8).map(c=>c.name || c.category_name).filter(Boolean).join(', ');
      storeBooks = `Smart Book Store là cửa hàng sách trực tuyến với ${books.length} sản phẩm, ${categories.length} danh mục và ${authors.length} tác giả:\n\n${info}\n\nDanh mục phổ biến: ${catsStr}\n\nChương trình khuyến mãi:\n- Giảm 10% cho đơn hàng từ 300,000đ\n- Giảm 15% cho đơn hàng từ 500,000đ\n- Miễn phí ship cho đơn hàng từ 200,000đ\n\nLiên hệ: Hotline 1900-xxxx, Email info@smartbookstore.com`;
    }catch(_){
      storeBooks = 'Smart Book Store là cửa hàng sách trực tuyến. Hiện tại không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau hoặc liên hệ: Hotline 1900-xxxx';
    }
  }

  async function fetchRatingsForBooks(books){
    const result = {};
    try{
      const top = books.slice(0,20);
      await Promise.all(top.map(async b=>{
        const id = b.id || b.book_id || b._id; if (!id) return;
        try{
          const res = await fetch(`http://localhost:3306/api/reviews/book/${id}/average`);
          if (!res.ok) return; const payload = await res.json();
          const value = typeof payload === 'number' ? payload : (payload.data || payload.average || payload.avg || null);
          if (value != null) result[id] = value;
        }catch(_){ }
      }));
    }catch(_){ }
    return result;
  }

  async function fetchInventoryForBooks(books){
    const result = {};
    try{
      const top = books.slice(0,20);
      const ids = top.map(b=>b.id || b.book_id || b._id).filter(Boolean);
      if (!ids.length) return result;
      const res = await fetch(`http://localhost:3306/api/warehouse/public/display-quantities?book_ids=${encodeURIComponent(ids.join(','))}`);
      if (res.ok){
        const payload = await res.json();
        Object.assign(result, (payload && payload.data) || {});
        return result;
      }
    }catch(_){ }
    // Fallback with admin token if available
    try{
      const token = localStorage.getItem('token');
      if (!token) return result;
      const top = books.slice(0,20);
      await Promise.all(top.map(async b=>{
        const id = b.id || b.book_id || b._id; if (!id) return;
        try{
          const res = await fetch(`http://localhost:3306/api/warehouse/${id}`, { headers: { 'Authorization': `Bearer ${token}` }});
          if (!res.ok) return; const payload = await res.json();
          const qty = payload && (payload.quantity || payload.qty || payload.stock || (payload.data && payload.data.quantity));
          if (typeof qty === 'number') result[id] = qty;
        }catch(_){ }
      }));
    }catch(_){ }
    return result;
  }

  async function flushTrainingQueue(){
    try{
      const raw = localStorage.getItem(TRAINING_QUEUE_KEY);
      const queue = raw ? JSON.parse(raw) : [];
      if (!queue.length) return;
      const token = localStorage.getItem('token');
      const endpoints = [
        'http://localhost:3306/api/chatbot/logs',
        'http://localhost:3306/api/tracking/chatbot',
        'http://localhost:3306/api/tracking/chatbot-log'
      ];
      const headers = { 'Content-Type': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };
      let sent = false;
      for (const ep of endpoints){
        try{ const r = await fetch(ep, { method:'POST', headers, body: JSON.stringify({ logs: queue }) }); if (r.ok){ sent = true; break; } }catch(_){ }
      }
      if (sent) localStorage.removeItem(TRAINING_QUEUE_KEY);
    }catch(_){ }
  }

  fetchStoreData();

  const sendBtn = document.querySelector('.input-area button');
  const inputEl = document.querySelector('.input-area input');
  if (sendBtn) sendBtn.addEventListener('click', sendmessage);
  if (inputEl) {
    inputEl.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'){ e.preventDefault(); sendmessage(); }
    });
  }

  function sendmessage(){
    const input = document.querySelector('.input-area input');
    const userMessage = input ? input.value.trim() : '';
    if(!userMessage.length || isRequesting) return;
    input.value = '';

    document.querySelector('.chatwindow .chat').insertAdjacentHTML('beforeend', `<div class="user"><p>${userMessage}</p></div>`);

    conversations.push({ role:'user', parts:[{ text:userMessage }] });
    if (conversations.length > MAX_TURNS * 2) {
      conversations.splice(0, conversations.length - MAX_TURNS * 2);
    }
    lastQuestion = userMessage;
    goiDulieu();
  }

  async function goiDulieu(){
    try{
      isRequesting = true;
      const systemInstruction = `Bạn là trợ lý AI tiếng Việt của Smart Book Store.\nNhiệm vụ: trả lời NGẮN GỌN và TRỌNG TÂM như chuyên gia; ưu tiên gạch đầu dòng, bảng so sánh khi hợp lý; nêu rõ tên sách, giá (vi-VN), tác giả, thể loại, tóm tắt ngắn, ai nên đọc, và 3–5 gợi ý liên quan. Nếu không có dữ liệu, hãy nói rõ và đề xuất lựa chọn gần nhất. Tránh nói dài, không bịa thông tin tồn kho.\n\nNgữ cảnh cửa hàng:\n${storeBooks}\n\nNguyên tắc:\n- Trả lời bằng tiếng Việt tự nhiên, rõ ràng, không dài dòng.\n- Tối đa 6 gạch đầu dòng cho phần khuyến nghị.\n- Với câu hỏi quy trình (mua, giao, đổi trả), trả lời theo các bước ngắn.`;

      const body = { contents: conversations, systemInstruction: { parts: [{ text: systemInstruction }] } };
      const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${gemini_key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': gemini_key }, body: JSON.stringify(body)
      });
      if (!resp.ok) throw new Error('HTTP '+resp.status);
      const data = await resp.json();
      const aiText = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text
        ? data.candidates[0].content.parts[0].text
        : 'Xin lỗi, tôi chưa có câu trả lời cho câu hỏi này.';

      document.querySelector('.chatwindow .chat').insertAdjacentHTML('beforeend', `<div class="model"><p>${renderTextToHtml(aiText)}</p></div>`);
      conversations.push({ role:'model', parts:[{ text: aiText }] });
      appendTrainingLog({ time: new Date().toISOString(), question: lastQuestion, answer: aiText });
    }catch(_){
      document.querySelector('.chatwindow .chat').insertAdjacentHTML('beforeend', `<div class="model"><p>Xin lỗi, tôi không thể trả lời ngay bây giờ. Vui lòng thử lại sau.</p></div>`);
    }finally{
      isRequesting = false;
    }
  }
})();



