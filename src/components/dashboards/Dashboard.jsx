// נתיב: client/src/components/dashboards/Dashboard.jsx
import React from 'react';
import './Dashboard.scss';

const Dashboard = ({ userRole }) => {
  const getDashboardData = (role) => {
    switch (role) {
      case 'admin':
        return {
          title: 'לוח בקרה ראשי',
          stats: [
            { icon: 'bi-buildings', label: 'סה"כ נכסים', value: '47', color: '#4cc9f0' },
            { icon: 'bi-truck', label: 'רכבים פעילים', value: '23', color: '#28a745' },
            { icon: 'bi-people', label: 'עובדים', value: '156', color: '#fd7e14' },
            { icon: 'bi-exclamation-triangle', label: 'התראות', value: '12', color: '#dc3545' }
          ],
          quickActions: [
            { icon: 'bi-plus-circle', label: 'הוסף נכס חדש', action: 'add-asset' },
            { icon: 'bi-truck', label: 'רישום רכב', action: 'add-vehicle' },
            { icon: 'bi-person-plus', label: 'הוסף עובד', action: 'add-employee' },
            { icon: 'bi-file-text', label: 'צור דוח', action: 'create-report' }
          ]
        };
      case 'manager':
        return {
          title: 'לוח בקרה מנהל סניף',
          stats: [
            { icon: 'bi-buildings', label: 'נכסי הסניף', value: '8', color: '#4cc9f0' },
            { icon: 'bi-truck', label: 'רכבי הסניף', value: '5', color: '#28a745' },
            { icon: 'bi-people', label: 'עובדי הסניף', value: '24', color: '#fd7e14' },
            { icon: 'bi-list-task', label: 'משימות פתוחות', value: '7', color: '#6f42c1' }
          ],
          quickActions: [
            { icon: 'bi-list-task', label: 'הקצה משימה', action: 'assign-task' },
            { icon: 'bi-calendar-check', label: 'תזמן תחזוקה', action: 'schedule-maintenance' },
            { icon: 'bi-bar-chart', label: 'דוח סניף', action: 'branch-report' },
            { icon: 'bi-envelope', label: 'שלח הודעה', action: 'send-message' }
          ]
        };
      case 'employee':
        return {
          title: 'האזור האישי שלי',
          stats: [
            { icon: 'bi-list-task', label: 'משימות שלי', value: '3', color: '#4cc9f0' },
            { icon: 'bi-truck', label: 'הרכב שלי', value: '1', color: '#28a745' },
            { icon: 'bi-laptop', label: 'ציוד שהוקצה', value: '4', color: '#fd7e14' },
            { icon: 'bi-clock', label: 'שעות השבוע', value: '32', color: '#6f42c1' }
          ],
          quickActions: [
            { icon: 'bi-check-circle', label: 'עדכן משימה', action: 'update-task' },
            { icon: 'bi-exclamation-triangle', label: 'דווח תקלה', action: 'report-issue' },
            { icon: 'bi-fuel-pump', label: 'דווח דלק', action: 'report-fuel' },
            { icon: 'bi-calendar', label: 'בקש חופש', action: 'request-leave' }
          ]
        };
      default:
        return {
          title: 'דף הבית',
          stats: [],
          quickActions: []
        };
    }
  };

  const dashboardData = getDashboardData(userRole);

  const handleQuickAction = (action) => {
    console.log(`Executing action: ${action}`);
    // כאן תהיה הלוגיקה לביצוע הפעולות
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <i className="bi bi-speedometer2 me-3"></i>
          {dashboardData.title}
        </h1>
        <p className="dashboard-subtitle">
          ברוכים הבאים למערכת ניהול הנכסים והרכבים
        </p>
      </div>

      {/* סטטיסטיקות */}
      <div className="stats-grid">
        {dashboardData.stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--stat-color': stat.color }}>
            <div className="stat-icon">
              <i className={stat.icon}></i>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
            <div className="stat-pulse"></div>
          </div>
        ))}
      </div>

      {/* פעולות מהירות */}
      <div className="quick-actions-section">
        <h3 className="section-title">
          <i className="bi bi-lightning me-2"></i>
          פעולות מהירות
        </h3>
        <div className="quick-actions-grid">
          {dashboardData.quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-card"
              onClick={() => handleQuickAction(action.action)}
            >
              <div className="action-icon">
                <i className={action.icon}></i>
              </div>
              <span className="action-label">{action.label}</span>
              <div className="action-arrow">
                <i className="bi bi-arrow-left"></i>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* מידע נוסף */}
      <div className="dashboard-footer">
        <div className="row">
          <div className="col-md-6">
            <div className="info-card">
              <h4 className="card-title">
                <i className="bi bi-graph-up-arrow me-2"></i>
                סטטוס המערכת
              </h4>
              <div className="system-status">
                <div className="status-item">
                  <span className="status-dot active"></span>
                  <span>מערכת פעילה</span>
                </div>
                <div className="status-item">
                  <span className="status-dot active"></span>
                  <span>כל השירותים זמינים</span>
                </div>
                <div className="status-item">
                  <span className="status-dot warning"></span>
                  <span>תחזוקה מתוכננת: ראשון 08:00</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="info-card">
              <h4 className="card-title">
                <i className="bi bi-bell me-2"></i>
                הודעות אחרונות
              </h4>
              <div className="recent-notifications">
                <div className="notification-item">
                  <i className="bi bi-exclamation-circle text-warning"></i>
                  <span>תזכורת: חידוש ביטוח רכב מס' 123-45</span>
                </div>
                <div className="notification-item">
                  <i className="bi bi-check-circle text-success"></i>
                  <span>משימה הושלמה: תיקון מזגן בסניף ירושלים</span>
                </div>
                <div className="notification-item">
                  <i className="bi bi-info-circle text-info"></i>
                  <span>עדכון מערכת זמין לגרסה 2.1.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;