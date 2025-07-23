// נתיב: client/src/components/auth/Login.jsx
import React, { useState } from 'react';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // כאן תהיה קריאה לשרת לאימות
      // לעת עתה נדמה התחברות מוצלחת
      setTimeout(() => {
        // דמוי משתמש לבדיקה
        const mockUser = {
          id: 1,
          name: 'יוסי כהן',
          email: formData.email,
          role: 'admin', // admin, manager, employee
          lastLogin: new Date(),
          permissions: ['all']
        };
        
        onLogin(mockUser);
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('שגיאה בהתחברות. אנא נסה שוב.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-circle">
                <i className="bi bi-droplet-half"></i>
              </div>
            </div>
            <h2 className="login-title">ברוכים הבאים</h2>
            <p className="login-subtitle">התחברו למערכת ניהול הנכסים</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <i className="bi bi-envelope me-2"></i>
                כתובת אימייל
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="הכניסו את כתובת האימייל"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <i className="bi bi-lock me-2"></i>
                סיסמה
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="הכניסו את הסיסמה"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-check mb-3">
              <input 
                className="form-check-input" 
                type="checkbox" 
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                זכור אותי
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-login w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">טוען...</span>
                  </div>
                  מתחבר...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  התחבר
                </>
              )}
            </button>

            <div className="login-footer">
              <a href="#" className="forgot-password-link">
                שכחת את הסיסמה?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;