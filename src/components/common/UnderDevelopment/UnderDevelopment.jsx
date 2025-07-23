// נתיב: client/src/components/common/UnderDevelopment/UnderDevelopment.jsx
import React from 'react';
import './UnderDevelopment.scss';

const UnderDevelopment = ({ title, description }) => {
  return (
    <div className="under-development">
      <div className="development-container">
        <div className="development-icon">
          <i className="bi bi-tools"></i>
          <div className="icon-gears">
            <i className="bi bi-gear-fill gear-1"></i>
            <i className="bi bi-gear gear-2"></i>
          </div>
        </div>
        
        <div className="development-content">
          <h1 className="development-title">{title}</h1>
          <p className="development-description">{description}</p>
          
          <div className="development-status">
            <div className="status-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>תכנון הושלם</span>
            </div>
            <div className="status-item">
              <i className="bi bi-arrow-repeat spin"></i>
              <span>בפיתוח כעת</span>
            </div>
            <div className="status-item coming-soon">
              <i className="bi bi-clock"></i>
              <span>בקרוב במערכת</span>
            </div>
          </div>
          
          <div className="development-features">
            <h3>תכונות מתוכננות:</h3>
            <div className="features-grid">
              <div className="feature-item">
                <i className="bi bi-lightning-charge"></i>
                <span>ביצועים מהירים</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-shield-check"></i>
                <span>אבטחה מתקדמת</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-phone"></i>
                <span>תמיכה במובייל</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-graph-up"></i>
                <span>דוחות מתקדמים</span>
              </div>
            </div>
          </div>
          
          <div className="development-actions">
            <button 
              className="btn btn-outline-primary"
              onClick={() => window.history.back()}
              type="button"
            >
              <i className="bi bi-arrow-right me-2"></i>
              חזור
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/dashboard'}
              type="button"
            >
              <i className="bi bi-house me-2"></i>
              דף הבית
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;