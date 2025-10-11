// Nhập jsonwebtoken để xác thực token
const jwt = require('jsonwebtoken');

// Blacklist để lưu token đã đăng xuất (in-memory)
const tokenBlacklist = new Set();

const auth = (req, res, next) => {
    console.log('🔐 [Auth] Middleware auth - Bắt đầu xác thực');
    const authHeader = req.headers['authorization'];
    console.log('🔐 [Auth] Received token header:', authHeader);

    if (!authHeader) {
        console.log('❌ [Auth] Thiếu token trong header');
        return res.status(401).json({ error: 'Thiếu token' });
    }

    const token = authHeader.split(' ')[1];  
    console.log('🔐 [Auth] Extracted token:', token ? 'Có token' : 'Không có token');

    // Kiểm tra token có trong blacklist không
    if (tokenBlacklist.has(token)) {
        console.log('❌ [Auth] Token đã bị vô hiệu hóa (trong blacklist)');
        return res.status(401).json({ error: 'Token đã bị vô hiệu hóa' });
    }

    try {
        console.log('🔐 [Auth] Đang verify token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_key');
        console.log('✅ [Auth] Token verification thành công:', decoded);
        req.user = decoded; // Lưu thông tin user (userId, role)
        console.log('✅ [Auth] req.user đã được set:', req.user);
        next();
    } catch (err) {
        console.log('❌ [Auth] Token verification error:', err.message); 
        return res.status(403).json({ error: 'Token không hợp lệ' });
    }
};

const adminOnly = (req, res, next) => {
    console.log('Checking role:', req.user ? req.user.role : 'No user'); // In role
    if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Chỉ admin mới có quyền' });
    }
    next();
};

const userOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Thiếu thông tin người dùng' });
    }
    const userIdFromToken = req.user.userId;
    const requestedUserId = req.params?.user_id || req.body?.user_id;  // Sửa: Sử dụng optional chaining (?.) để tránh đọc từ undefined
    if (requestedUserId && userIdFromToken != requestedUserId) {
        return res.status(403).json({ error: 'Không có quyền truy cập thông tin người khác' });
    }
    next();
};

// Ngăn admin đặt hàng
const preventAdminOrdering = (req, res, next) => {
    if (req.user.role === 'admin') {
        return res.status(403).json({ error: 'Admin không thể đặt hàng. Vui lòng sử dụng tài khoản user để đặt hàng.' });
    }
    next();
};

// Hàm thêm token vào blacklist
const addToBlacklist = (token) => {
    tokenBlacklist.add(token);
};

// Ngăn admin xem đơn hàng
module.exports = { auth, adminOnly, userOnly, preventAdminOrdering, addToBlacklist };