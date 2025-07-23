// נתיב: client/src/components/common/Sidebar/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = ({ userRole, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // תפריטים בהתאם לרמת הרשאה
  const getMenuItems = (role) => {
    const commonItems = [
      { icon: 'bi-house-door', label: 'דף הבית', path: '/dashboard', roles: ['admin', 'manager', 'employee'] },
      { icon: 'bi-person-circle', label: 'פרופיל אישי', path: '/profile', roles: ['admin', 'manager', 'employee'] }
    ];

    const adminItems = [
      { icon: 'bi-buildings', label: 'ניהול נכסים', path: '/assets', roles: ['admin'] },
      { icon: 'bi-truck', label: 'ניהול רכבים', path: '/vehicles', roles: ['admin'] },
      { icon: 'bi-people', label: 'ניהול משתמשים', path: '/users', roles: ['admin'] },
      { icon: 'bi-shop', label: 'ניהול סניפים', path: '/branches', roles: ['admin'] },
      { icon: 'bi-folder', label: 'ניהול מסמכים', path: '/documents', roles: ['admin'] },
      { icon: 'bi-bar-chart', label: 'דוחות', path: '/reports', roles: ['admin'] },
      { icon: 'bi-gear', label: 'הגדרות מערכת', path: '/settings', roles: ['admin'] }
    ];

    const managerItems = [
      { icon: 'bi-buildings', label: 'נכסים בסניף', path: '/branch-assets', roles: ['manager'] },
      { icon: 'bi-truck', label: 'רכבים בסניף', path: '/branch-vehicles', roles: ['manager'] },
      { icon: 'bi-people', label: 'עובדים בסניף', path: '/branch-employees', roles: ['manager'] },
      { icon: 'bi-list-task', label: 'ניהול משימות', path: '/tasks', roles: ['manager'] },
      { icon: 'bi-folder', label: 'מסמכי סניף', path: '/branch-documents', roles: ['manager'] },
      { icon: 'bi-bar-chart', label: 'דוחות סניף', path: '/branch-reports', roles: ['manager'] }
    ];

    const employeeItems = [
      { icon: 'bi-list-task', label: 'המשימות שלי', path: '/my-tasks', roles: ['employee'] },
      { icon: 'bi-truck', label: 'הרכב שלי', path: '/my-vehicle', roles: ['employee'] },
      { icon: 'bi-laptop', label: 'הציוד שלי', path: '/my-equipment', roles: ['employee'] },
      { icon: 'bi-exclamation-triangle', label: 'דיווח תקלות', path: '/report-issue', roles: ['employee'] }
    ];

    let allItems = [...commonItems];
    
    if (role === 'admin') {
      allItems = [...allItems, ...adminItems];
    } else if (role === 'manager') {
      allItems = [...allItems, ...managerItems];
    } else if (role === 'employee') {
      allItems = [...allItems, ...employeeItems];
    }

    return allItems.filter(item => item.roles.includes(role));
  };

  const menuItems = getMenuItems(userRole);

  const handleMenuClick = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar">
      <div className="d-flex flex-column align-items-center nav-sidebar">
        {/* Logo Icon */}
        <div className="logo-container my-4">
          <div className="logo-circle pulse-animation">
            <i className="bi bi-droplet-half fs-4"></i>
          </div>
        </div>
        
        <nav className="nav flex-column w-100" aria-label="ניווט ראשי">
          {/* Main Menu Items */}
          <div className="menu-section">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`nav-link position-relative menu-item d-flex justify-content-center ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.path)}
                type="button"
              >
                <i className={`${item.icon} fs-5`}></i>
                <span className="menu-tooltip">{item.label}</span>
                {item.notifications && (
                  <span className={`notification-badge ${item.notifications > 10 ? 'pulse' : ''}`}>
                    {item.notifications > 99 ? '99+' : item.notifications}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {/* Divider */}
          <div className="menu-divider my-3"></div>
          
          {/* Personal Area */}
          <div className="menu-section">
            <button
              className="nav-link position-relative menu-item d-flex justify-content-center logout-btn"
              onClick={onLogout}
              type="button"
            >
              <i className="bi bi-box-arrow-in-right fs-5"></i>
              <span className="menu-tooltip">התנתקות</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;