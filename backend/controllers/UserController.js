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
const crypto = require("crypto");

const PASSWORD_RESET_EXPIRY_MS = 15 * 60 * 1000; // 15 phút
const passwordResetRequests = new Map();

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const getResetRequest = (email) => passwordResetRequests.get(normalizeEmail(email));

const setResetRequest = (email, payload) => {
  passwordResetRequests.set(normalizeEmail(email), payload);
};

const clearResetRequest = (email) => {
  passwordResetRequests.delete(normalizeEmail(email));
};

class UserController {
  // Đăng ký người dùng
  static register(req, res) {
    console.log("[UserController] Bắt đầu đăng ký user:", req.body);

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

    // Normalize email để đảm bảo consistency
    const normalizedEmail = normalizeEmail(email);

    console.log("[UserController] Kiểm tra email tồn tại:", normalizedEmail);

    User.findByEmail(normalizedEmail, (err, existingUser) => {
      if (err) {
        console.error("[UserController] Lỗi kiểm tra email:", err);
        return res.status(500).json({ error: "Lỗi cơ sở dữ liệu" });
      }

      if (existingUser) {
        console.log("[UserController] Email đã tồn tại:", normalizedEmail);
        return res.status(400).json({ error: "Email đã tồn tại" });
      }

      console.log("[UserController] Email chưa tồn tại, bắt đầu tạo user");

      // User.create() sẽ tự hash password, nên chỉ truyền password (plain text)
      User.create(
        {
          name,
          email: normalizedEmail,
          password: password, // Truyền password plain text, User.create() sẽ hash
          phone,
          address,
          role
        },
        (err, newUser) => {
          if (err) {
            console.error("[UserController] Lỗi tạo user:", err);
            // Xử lý lỗi cụ thể
            if (err.message && err.message.includes('Email đã tồn tại')) {
              return res.status(400).json({ 
                success: false,
                error: "Email đã tồn tại" 
              });
            }
            if (err.message && err.message.includes('Email phải là @gmail.com')) {
              return res.status(400).json({ 
                success: false,
                error: "Email phải là @gmail.com" 
              });
            }
            return res.status(500).json({ 
              success: false,
              error: err.message || "Lỗi tạo người dùng" 
            });
          }

          // Kiểm tra newUser có tồn tại không
          if (!newUser) {
            console.error("[UserController] User được tạo nhưng không có dữ liệu trả về");
            return res.status(500).json({ 
              success: false,
              error: "Không thể tạo người dùng. Vui lòng thử lại." 
            });
          }

          console.log("[UserController] User đã được tạo thành công với ID:", newUser.user_id);

          res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            data: {
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
    console.log("[UserController] Login request body:", req.body);
    if (!req.body) {
      return res.status(400).json({ 
        success: false,
        error: "Body yêu cầu không hợp lệ" 
      });
    }
    const { email, password, captcha } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Thiếu email hoặc mật khẩu" 
      });
    }
    
    // Captcha validation - commented out
    // if (!captcha || typeof captcha !== 'string' || captcha.trim().length === 0) {
    //   return res.status(400).json({ 
    //     success: false,
    //     error: "Vui lòng nhập mã captcha" 
    //   });
    // }
    // 
    // // Basic captcha validation (length check)
    // if (captcha.trim().length !== 5) {
    //   return res.status(400).json({ 
    //     success: false,
    //     error: "Mã captcha không hợp lệ" 
    //   });
    // }
    
    // Normalize email để tìm kiếm
    const normalizedEmail = normalizeEmail(email);
    console.log("[UserController] Normalized email:", normalizedEmail);
    
    User.findByEmail(normalizedEmail, (err, user) => {
      if (err) {
        console.error("[UserController] Database error:", err);
        return res.status(500).json({ 
          success: false,
          error: "Lỗi cơ sở dữ liệu" 
        });
      }
      if (!user) {
        console.log("[UserController] User not found for email:", normalizedEmail);
        return res.status(401).json({ 
          success: false,
          error: "Email không tồn tại" 
        });
      }
      
      console.log("[UserController] User found, comparing password...");
      bcrypt.compare(password, user.password_hash, (err, match) => {
        if (err) {
          console.error("[UserController] Password comparison error:", err);
          return res.status(500).json({ 
            success: false,
            error: "Lỗi xác thực" 
          });
        }
        if (!match) {
          console.log("[UserController] Password mismatch");
          return res.status(401).json({ 
            success: false,
            error: "Mật khẩu không đúng" 
          });
        }
        
        console.log("[UserController] Password match, generating token...");
        const token = jwt.sign(
          { userId: user.user_id, role: user.role },
          process.env.JWT_SECRET || "default_jwt_secret_key",
          {
            expiresIn: "1h",
          }
        );
        
        const response = {
          success: true,
          token,
          user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone || null,
            address: user.address || null,
            role: user.role,
          },
          message: "Đăng nhập thành công",
        };
        
        console.log("[UserController] Login successful, returning response");
        res.json(response);
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
      const userId = req.user.userId; // lấy từ token
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
      console.error("[UserController] Lỗi khi lấy thông tin hồ sơ:", err.message);
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

      console.log(`[UserController] getUser - Requested user ID: ${userId}, Current user ID: ${currentUserId}, Role: ${currentUserRole}`);

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

      console.log(`[UserController] getUser - Found user:`, rows[0]);
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      console.error("[UserController] Lỗi khi lấy thông tin user theo ID:", err.message);
      res.status(500).json({ error: "Lỗi server khi lấy thông tin người dùng" });
    }
  }

  // Lấy toàn bộ người dùng (chỉ admin)
  static getAllUsers(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'created_at';
    const sortOrder = req.query.sortOrder || 'DESC';

    console.log(`[UserController] getAllUsers - Page: ${page}, Limit: ${limit}, Search: "${search}", Sort: ${sortBy} ${sortOrder}`);

    User.getAllPaged(page, limit, search, sortBy, sortOrder, (err, result) => {
      if (err) {
        console.error('[UserController] Lỗi getAllPaged:', err);
        return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
      }

      console.log(`[UserController] getAllUsers - Found ${result.users.length} users, Total: ${result.total}`);

      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination,
        total: result.total
      });
    });
  }

  // Lấy tổng số người dùng cho dashboard (chỉ admin)
  static getTotalUsersCount(req, res) {
    const query = 'SELECT COUNT(*) AS total FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('[UserController] Lỗi đếm tổng số người dùng:', err);
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

  // Gửi yêu cầu đặt lại mật khẩu
  static requestPasswordReset(req, res) {
    const email = normalizeEmail(req.body?.email || "");

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email là bắt buộc" });
    }

    User.findByEmail(email, (err, user) => {
      if (err) {
        console.error("[UserController] Lỗi tìm user khi reset mật khẩu:", err);
        return res
          .status(500)
          .json({ success: false, message: "Lỗi cơ sở dữ liệu" });
      }

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Email không tồn tại" });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const resetToken = crypto.randomBytes(32).toString("hex");

      setResetRequest(email, {
        email,
        code,
        resetToken,
        expiresAt: Date.now() + PASSWORD_RESET_EXPIRY_MS,
      });

      console.log(
        `[UserController] OTP reset cho ${email}: ${code} (hết hạn sau ${PASSWORD_RESET_EXPIRY_MS / 1000} giây)`
      );

      return res.json({
        success: true,
        message: "Yêu cầu đặt lại mật khẩu đã được tạo. Vui lòng kiểm tra email.",
        debugCode: code,
        expiresIn: PASSWORD_RESET_EXPIRY_MS / 1000,
      });
    });
  }

  // Xác thực mã OTP
  static verifyResetCode(req, res) {
    const email = normalizeEmail(req.body?.email || "");
    const code = (req.body?.code || "").trim();

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email và mã xác thực là bắt buộc",
      });
    }

    const request = getResetRequest(email);

    if (!request || request.email !== email) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu đặt lại mật khẩu",
      });
    }

    if (Date.now() > request.expiresAt) {
      clearResetRequest(email);
      return res.status(400).json({
        success: false,
        message: "Mã xác thực đã hết hạn. Vui lòng yêu cầu lại",
      });
    }

    if (request.code !== code) {
      return res
        .status(400)
        .json({ success: false, message: "Mã xác thực không chính xác" });
    }

    return res.json({
      success: true,
      message: "Mã xác thực hợp lệ",
      resetToken: request.resetToken,
    });
  }

  // Đặt lại mật khẩu
  static resetPassword(req, res) {
    const email = normalizeEmail(req.body?.email || "");
    const newPassword = req.body?.newPassword || "";
    const resetToken = req.body?.resetToken || "";

    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin để đặt lại mật khẩu",
      });
    }

    const request = getResetRequest(email);

    if (!request || request.email !== email) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy yêu cầu đặt lại mật khẩu",
      });
    }

    if (request.resetToken !== resetToken) {
      return res
        .status(400)
        .json({ success: false, message: "Token đặt lại mật khẩu không hợp lệ" });
    }

    if (Date.now() > request.expiresAt) {
      clearResetRequest(email);
      return res.status(400).json({
        success: false,
        message: "Token đặt lại mật khẩu đã hết hạn",
      });
    }

    bcrypt.hash(newPassword, 10, (hashErr, hash) => {
      if (hashErr) {
        console.error("[UserController] Lỗi hash mật khẩu mới:", hashErr);
        return res
          .status(500)
          .json({ success: false, message: "Lỗi xử lý mật khẩu" });
      }

      const query = `UPDATE users SET password_hash = ? WHERE LOWER(email) = ?`;
      db.query(query, [hash, email], (err, result) => {
        if (err) {
          console.error("[UserController] Lỗi cập nhật mật khẩu:", err);
          return res
            .status(500)
            .json({ success: false, message: "Lỗi cập nhật mật khẩu" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ success: false, message: "Không tìm thấy người dùng" });
        }

        clearResetRequest(email);

        return res.json({
          success: true,
          message: "Mật khẩu đã được cập nhật thành công",
        });
      });
    });
  }

  // Đổi mật khẩu (yêu cầu đăng nhập)
  static changePassword(req, res) {
    console.log("[UserController] Bắt đầu đổi mật khẩu");
    
    const userIdFromToken = req.user?.userId;
    if (!userIdFromToken) {
      return res.status(401).json({ 
        success: false,
        message: "Chưa đăng nhập" 
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Thiếu mật khẩu hiện tại hoặc mật khẩu mới" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới phải có ít nhất 6 ký tự" 
      });
    }

    // Lấy thông tin user từ database
    const query = `SELECT user_id, email, password_hash FROM users WHERE user_id = ?`;
    db.query(query, [userIdFromToken], (err, results) => {
      if (err) {
        console.error("[UserController] Lỗi truy vấn database:", err);
        return res.status(500).json({ 
          success: false,
          message: "Lỗi server" 
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: "Không tìm thấy người dùng" 
        });
      }

      const user = results[0];

      // Kiểm tra mật khẩu hiện tại
      bcrypt.compare(currentPassword, user.password_hash, (compareErr, isMatch) => {
        if (compareErr) {
          console.error("[UserController] Lỗi so sánh mật khẩu:", compareErr);
          return res.status(500).json({ 
            success: false,
            message: "Lỗi xác thực mật khẩu" 
          });
        }

        if (!isMatch) {
          return res.status(400).json({ 
            success: false,
            message: "Mật khẩu hiện tại không đúng" 
          });
        }

        // Hash mật khẩu mới
        bcrypt.hash(newPassword, 10, (hashErr, hash) => {
          if (hashErr) {
            console.error("[UserController] Lỗi hash mật khẩu mới:", hashErr);
            return res.status(500).json({ 
              success: false,
              message: "Lỗi xử lý mật khẩu mới" 
            });
          }

          // Cập nhật mật khẩu mới vào database
          const updateQuery = `UPDATE users SET password_hash = ? WHERE user_id = ?`;
          db.query(updateQuery, [hash, userIdFromToken], (updateErr, updateResult) => {
            if (updateErr) {
              console.error("[UserController] Lỗi cập nhật mật khẩu:", updateErr);
              return res.status(500).json({ 
                success: false,
                message: "Lỗi cập nhật mật khẩu" 
              });
            }

            if (updateResult.affectedRows === 0) {
              return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy người dùng để cập nhật" 
              });
            }

            console.log("[UserController] Đổi mật khẩu thành công cho user_id:", userIdFromToken);
            return res.json({ 
              success: true,
              message: "Đổi mật khẩu thành công" 
            });
          });
        });
      });
    });
  }
}

// Xuất class UserController
module.exports = UserController;
