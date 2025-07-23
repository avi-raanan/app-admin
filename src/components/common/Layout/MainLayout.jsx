// נתיב: client/src/components/common/Layout/MainLayout.jsx
import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import TopPanel from '../TopPanel/TopPanel';
import './MainLayout.scss';

const MainLayout = ({ user, onLogout, children }) => {
  return (
    <div className="main-layout">
      {/* סיידבר */}
      <Sidebar userRole={user.role} onLogout={onLogout} />
      
      {/* אזור התוכן הראשי */}
      <div className="main-content">
        {/* פאנל עליון */}
        <TopPanel user={user} />
        
        {/* אזור התוכן המשתנה */}
        <div className="content-area">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;