const db = require('../config/db');

class AILogModel {
  static tableInitialized = false;

  static async ensureTable() {
    if (AILogModel.tableInitialized) {
      return;
    }

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS ai_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NULL,
        action_type VARCHAR(64) NOT NULL,
        context JSON NULL,
        note TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_ai_logs_admin (admin_id),
        INDEX idx_ai_logs_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await db.promise().query(createTableSQL);
    AILogModel.tableInitialized = true;
  }

  static async createLog({ adminId = null, actionType, context = {}, note = null }) {
    await AILogModel.ensureTable();

    if (!actionType) {
      throw new Error('actionType is required');
    }

    const insertSQL = `
      INSERT INTO ai_logs (admin_id, action_type, context, note)
      VALUES (?, ?, CAST(? AS JSON), ?)
    `;

    const contextPayload = JSON.stringify(context || {});

    const [result] = await db.promise().query(insertSQL, [adminId, actionType, contextPayload, note]);

    return {
      logId: result.insertId,
      adminId,
      actionType,
      context,
      note
    };
  }

  static async getRecentLogs(limit = 20) {
    await AILogModel.ensureTable();

    const query = `
      SELECT log_id, admin_id, action_type, context, note, created_at
      FROM ai_logs
      ORDER BY created_at DESC
      LIMIT ?
    `;

    const [rows] = await db.promise().query(query, [limit]);

    return rows.map(row => ({
      logId: row.log_id,
      adminId: row.admin_id,
      actionType: row.action_type,
      context: typeof row.context === 'string' ? JSON.parse(row.context) : row.context,
      note: row.note,
      createdAt: row.created_at
    }));
  }

  static async countLogs() {
    await AILogModel.ensureTable();

    const [rows] = await db.promise().query('SELECT COUNT(*) AS total FROM ai_logs');
    return rows[0]?.total || 0;
  }
}

module.exports = AILogModel;

