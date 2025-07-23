// נתיב: client/src/components/common/TopPanel/TopPanel.jsx
import React, { useState, useEffect } from 'react';
import './TopPanel.scss';

const TopPanel = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('he-IL', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatLastLogin = (date) => {
    return date.toLocaleString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'מנהל ראשי';
      case 'manager':
        return 'מנהל סניף';
      case 'employee':
        return 'עובד';
      default:
        return 'משתמש';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#dc3545';
      case 'manager':
        return '#fd7e14';
      case 'employee':
        return '#20c997';
      default:
        return '#6c757d';
    }
  };

  return (
    <div className="top-panel">
      <div className="container-fluid">
        <div className="row align-items-center">
          {/* פרטי משתמש */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="user-info">
              <div className="user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="user-details">
                <h5 className="user-name">
                  שלום, {user.name}
                  <span 
                    className="role-badge"
                    style={{ backgroundColor: getRoleColor(user.role) }}
                  >
                    {getRoleText(user.role)}
                  </span>
                </h5>
                <p className="last-login">
                  <i className="bi bi-clock-history me-1"></i>
                  התחברות אחרונה: {formatLastLogin(user.lastLogin)}
                </p>
              </div>
            </div>
          </div>

          {/* תאריך ושעה נוכחיים */}
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="datetime-info text-center">
              <div className="current-time">
                <i className="bi bi-clock me-2"></i>
                {formatTime(currentTime)}
              </div>
              <div className="current-date">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* פעולות מהירות */}
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div className="quick-actions">
              <button className="btn quick-action-btn" title="חיפוש גלובלי">
                <i className="bi bi-search"></i>
              </button>
              <button className="btn quick-action-btn" title="הודעות" data-notifications="5">
                <i className="bi bi-bell"></i>
                <span className="notification-dot"></span>
              </button>
              <button className="btn quick-action-btn" title="משימות חדשות" data-notifications="3">
                <i className="bi bi-plus-circle"></i>
                <span className="notification-dot pulse"></span>
              </button>
              <button className="btn quick-action-btn" title="הגדרות מהירות">
                <i className="bi bi-gear"></i>
              </button>
              <button className="btn quick-action-btn help-btn" title="עזרה ותמיכה">
                <i className="bi bi-question-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPanel;