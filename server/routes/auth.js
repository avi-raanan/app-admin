// נתיב: server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { getConnection } = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST api/auth/login
// @desc    התחברות משתמש
// @access  Public
router.post('/login', [
  body('email', 'כתובת אימייל לא תקינה').isEmail().normalizeEmail(),
  body('password', 'סיסמה נדרשת').exists()
], async (req, res) => {
  try {
    // בדיקת validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'נתונים לא תקינים',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // חיבור למסד הנתונים
    const pool = await getConnection();
    
    // חיפוש המשתמש במסד הנתונים
    const userResult = await pool.request()
      .input('email', email.toLowerCase())
      .query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.password_hash,
          u.role,
          u.is_active,
          u.last_login,
          u.created_at,
          b.name as branch_name,
          b.id as branch_id
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE u.email = @email AND u.is_active = 1
      `);

    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'כתובת אימייל או סיסמה שגויים'
      });
    }

    const user = userResult.recordset[0];

    // בדיקת סיסמה
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'כתובת אימייל או סיסמה שגויים'
      });
    }

    // עדכון זמן התחברות אחרונה
    await pool.request()
      .input('userId', user.id)
      .input('lastLogin', new Date())
      .query(`
        UPDATE users 
        SET last_login = @lastLogin 
        WHERE id = @userId
      `);

    // יצירת JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        branch_id: user.branch_id
      }
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // החזרת נתוני המשתמש (ללא סיסמה)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch_id: user.branch_id,
      branch_name: user.branch_name,
      lastLogin: user.last_login,
      permissions: getUserPermissions(user.role)
    };

    res.json({
      success: true,
      message: 'התחברות הצליחה',
      token,
      user: userData
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// @route   GET api/auth/me
// @desc    קבלת נתוני המשתמש המחובר
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const pool = await getConnection();
    
    const userResult = await pool.request()
      .input('userId', req.user.id)
      .query(`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.last_login,
          u.created_at,
          b.name as branch_name,
          b.id as branch_id
        FROM users u
        LEFT JOIN branches b ON u.branch_id = b.id
        WHERE u.id = @userId AND u.is_active = 1
      `);

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'משתמש לא נמצא'
      });
    }

    const user = userResult.recordset[0];
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch_id: user.branch_id,
      branch_name: user.branch_name,
      lastLogin: user.last_login,
      permissions: getUserPermissions(user.role)
    };

    res.json({
      success: true,
      user: userData
    });

  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// @route   POST api/auth/logout
// @desc    התנתקות משתמש
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // כאן ניתן להוסיף לוגיקה לביטול token או blacklist
    res.json({
      success: true,
      message: 'התנתקות הצליחה'
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
});

// פונקציה עזר לקביעת הרשאות לפי תפקיד
function getUserPermissions(role) {
  switch (role) {
    case 'admin':
      return [
        'view_all_assets',
        'create_asset',
        'edit_asset',
        'delete_asset',
        'view_all_vehicles',
        'create_vehicle',
        'edit_vehicle',
        'delete_vehicle',
        'view_all_users',
        'create_user',
        'edit_user',
        'delete_user',
        'view_all_branches',
        'create_branch',
        'edit_branch',
        'delete_branch',
        'view_all_documents',
        'upload_document',
        'delete_document',
        'view_all_reports',
        'system_settings'
      ];
    case 'manager':
      return [
        'view_branch_assets',
        'create_asset',
        'edit_asset',
        'view_branch_vehicles',
        'create_vehicle',
        'edit_vehicle',
        'view_branch_employees',
        'create_task',
        'edit_task',
        'view_branch_documents',
        'upload_document',
        'view_branch_reports'
      ];
    case 'employee':
      return [
        'view_my_tasks',
        'update_my_tasks',
        'view_my_vehicle',
        'view_my_equipment',
        'report_issue',
        'view_shared_documents'
      ];
    default:
      return [];
  }
}

module.exports = router;