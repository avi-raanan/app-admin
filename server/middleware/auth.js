// נתיב: server/middleware/auth.js
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

const auth = async (req, res, next) => {
  // קבלת token מה-header
  const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

  // בדיקה אם token קיים
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'אין הרשאת גישה, token חסר'
    });
  }

  try {
    // אימות ה-token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // בדיקה שהמשתמש עדיין קיים ופעיל במסד הנתונים
    const pool = await getConnection();
    const userResult = await pool.request()
      .input('userId', decoded.user.id)
      .query(`
        SELECT id, email, role, is_active, branch_id
        FROM users 
        WHERE id = @userId AND is_active = 1
      `);

    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'משתמש לא נמצא או לא פעיל'
      });
    }

    // הוספת נתוני המשתמש ל-request
    req.user = {
      id: decoded.user.id,
      email: decoded.user.email,
      role: decoded.user.role,
      branch_id: decoded.user.branch_id
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token פג תוקף'
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token לא תקין'
      });
    }

    res.status(500).json({
      success: false,
      message: 'שגיאת שרת פנימית'
    });
  }
};

// Middleware לבדיקת הרשאות לפי תפקיד
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'אין הרשאת גישה'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'אין הרשאה לבצע פעולה זו'
      });
    }

    next();
  };
};

// Middleware לבדיקת הרשאה ספציפית
const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'אין הרשאת גישה'
        });
      }

      // קבלת הרשאות המשתמש
      const userPermissions = getUserPermissions(req.user.role);
      
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: 'אין הרשאה לבצע פעולה זו'
        });
      }

      next();
    } catch (err) {
      console.error('Permission check error:', err);
      res.status(500).json({
        success: false,
        message: 'שגיאת שרת פנימית'
      });
    }
  };
};

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

module.exports = {
  auth,
  authorize,
  checkPermission
};