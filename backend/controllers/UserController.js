// Nhập model User
const User = require("../models/User");
// Nhập bcrypt để so sánh mật khẩu
const bcrypt = require("bcrypt");
// Nhập jsonwebtoken để tạo token
const jwt = require("jsonwebtoken");
// Nhập hàm addToBlacklist từ middleware
const { addToBlacklist } = require("../middleware/auth");
// Thêm import cho database connection
const db = require("../config/db");

class UserController {
  // Đăng ký người dùng
  static register(req, res) {
    console.log("📝 [UserController] Bắt đầu đăng ký user:", req.body);
    
    if (!req.body) {
      return res.status(400).json({ error: "Body yêu cầu không hợp lệ" });
    }
    
    const {
      name,
      email,
      password,
      phone,
      address,
      role = "customer",
    } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Thiếu tên, email hoặc mật khẩu" });
    }
    
    console.log("🔍 [UserController] Kiểm tra email tồn tại:", email);
    
    User.findByEmail(email, (err, existingUser) => {
      if (err) {
        console.error("💥 [UserController] Lỗi kiểm tra email:", err);
        return res.status(500).json({ error: "Lỗi cơ sở dữ liệu" });
      }
      
      if (existingUser) {
        console.log("⚠️ [UserController] Email đã tồn tại:", email);
        return res.status(400).json({ error: "Email đã tồn tại" });
      }
      
      console.log("✅ [UserController] Email chưa tồn tại, bắt đầu tạo user");
      
      User.create(
        { name, email, password, phone, address, role },
        (err, newUser) => {
          if (err) {
            console.error("💥 [UserController] Lỗi tạo user:", err);
            if (err.message === "Email phải là @gmail.com") {
              return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: "Lỗi tạo người dùng" });
          }
          
          console.log("🎉 [UserController] Đăng ký thành công:", newUser);
          res.status(201).json({ 
            success: true,
            message: "Đăng ký thành công",
            user: {
              user_id: newUser.user_id,
              name: newUser.name,
              email: newUser.email,
              phone: newUser.phone,
              address: newUser.address,
              role: newUser.role
            }
          });
        }
      );
    });
  }

  // Đăng nhập người dùng
  static login(req, res) {
    console.log("req.body:", req.body);
    if (!req.body) {
      return res.status(400).json({ error: "Body yêu cầu không hợp lệ" });
    }
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
    }
    User.findByEmail(email, (err, user) => {
      if (err) return res.status(500).json({ error: "Lỗi cơ sở dữ liệu" });
      if (!user) return res.status(401).json({ error: "Email không tồn tại" });
      bcrypt.compare(password, user.password_hash, (err, match) => {
        if (err) return res.status(500).json({ error: "Lỗi xác thực" });
        if (!match)
          return res.status(401).json({ error: "Mật khẩu không đúng" });
        const token = jwt.sign(
          { userId: user.user_id, role: user.role },
          process.env.JWT_SECRET || "default_jwt_secret_key",
          {
            expiresIn: "1h",
          }
        );
        res.json({
          token,
          user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
          },
          message: "Đăng nhập thành công",
        });
      });
    });
  }

  // Cập nhật thông tin người dùng
  static updateUser(req, res) {
    console.log("req.body:", req.body);
    if (!req.body) {
      return res.status(400).json({ error: "Body yêu cầu không hợp lệ" });
    }
    const { user_id, name, phone, address } = req.body;
    const userIdFromToken = req.user.userId;
    if (!userIdFromToken || (!name && !phone && !address)) {
      return res.status(400).json({ error: "Thiếu thông tin cần cập nhật" });
    }
    // Chỉ cho phép sửa bản thân
    if (user_id && userIdFromToken != user_id) {
      return res
        .status(403)
        .json({ error: "Không đủ quyền để sửa thông tin người khác" });
    }
    User.update(userIdFromToken, { name, phone, address }, (err, result) => {
      if (err)
        return res.status(500).json({ error: "Lỗi cập nhật người dùng" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Người dùng không tồn tại" });
      res.json({ message: "Cập nhật thông tin thành công" });
    });
  }

  // Lấy thông tin người dùng đang đăng nhập
  static async getProfile(req, res) {
    try {
      const userId = req.user.userId; // ✅ lấy từ token
      if (!userId) {
        return res.status(401).json({ error: "Chưa đăng nhập" });
      }

      const [rows] = await db.promise().query(
        `SELECT user_id, name, email, phone, address, role 
         FROM users 
         WHERE user_id = ? LIMIT 1`,
        [userId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: "Không tìm thấy người dùng" });
      }

      res.json({ success: true, user: rows[0] });
    } catch (err) {
      console.error("💥 Lỗi khi lấy thông tin hồ sơ:", err.message);
      res
        .status(500)
        .json({ error: "Lỗi server khi lấy thông tin người dùng" });
    }
  }

  // Lấy thông tin người dùng theo ID
  static async getUser(req, res) {
    try {
      const userId = req.params.user_id;
      const currentUserId = req.user.userId;
      const currentUserRole = req.user.role;

      console.log(`👥 [UserController] getUser - Requested user ID: ${userId}, Current user ID: ${currentUserId}, Role: ${currentUserRole}`);

      if (!userId) {
        return res.status(400).json({ error: "Thiếu user_id" });
      }

      // Kiểm tra quyền: chỉ admin hoặc chính user đó mới được xem
      if (currentUserRole !== 'admin' && currentUserId != userId) {
        return res.status(403).json({ error: "Không có quyền xem thông tin người dùng này" });
      }

      const [rows] = await db.promise().query(
        `SELECT user_id, name, email, phone, address, role 
         FROM users 
         WHERE user_id = ? LIMIT 1`,
        [userId]
      );

      if (!rows.length) {
        return res.status(404).json({ error: "Không tìm thấy người dùng" });
      }

      console.log(`👥 [UserController] getUser - Found user:`, rows[0]);
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      console.error("💥 [UserController] Lỗi khi lấy thông tin user theo ID:", err.message);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin người dùng" });
    }
  }

  // Lấy toàn bộ người dùng (chỉ admin)
  static getAllUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    User.getAllPaged(page, limit, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
      }
      res.json({
        success: true,
        data: {
          users: result.users,
          total: result.total,
          page,
          limit,
          totalPages: Math.ceil(result.total / limit),
        }
      });
    });
  }

  // Lấy tổng số người dùng cho dashboard (chỉ admin)
  static getTotalUsersCount(req, res) {
    const query = 'SELECT COUNT(*) AS total FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('💥 [UserController] Lỗi đếm tổng số người dùng:', err);
        return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
      }
      res.json({
        success: true,
        data: results[0].total
      });
    });
  }

  // Xóa người dùng
  static deleteUser(req, res) {
    const userId = req.params.user_id;
    if (!userId) {
      return res.status(400).json({ error: "Thiếu user_id" });
    }
    User.delete(userId, (err, result) => {
      if (err) return res.status(500).json({ error: "Lỗi xóa người dùng" });
      if (result.affectedRows === 0)
        return res.status(404).json({ error: "Người dùng không tồn tại" });
      res.json({ message: "Xóa người dùng thành công" });
    });
  }

  // Đăng xuất
  static logout(req, res) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(400).json({ error: "Thiếu token" });
    }
    const token = authHeader.split(" ")[1];
    addToBlacklist(token); // Thêm token vào blacklist
    res.json({
      message: "Đăng xuất thành công, vui lòng xóa token khỏi client",
    });
  }
}

// Xuất class UserController
module.exports = UserController;
