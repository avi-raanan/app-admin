// נתיב: client/src/components/common/ErrorPage/ErrorPage.jsx
import React from 'react';
import './ErrorPage.scss';

const ErrorPage = ({ 
  errorCode = "404", 
  title = "עמוד לא נמצא", 
  description = "העמוד שביקשת לא קיים במערכת",
  showBackButton = true
}) => {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">
          <div className="error-number">{errorCode}</div>
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        
        <div className="error-content">
          <h1 className="error-title">{title}</h1>
          <p className="error-description">{description}</p>
          
          <div className="error-actions">
            {showBackButton && (
              <button 
                className="btn btn-outline-primary"
                onClick={() => window.history.back()}
                type="button"
              >
                <i className="bi bi-arrow-right me-2"></i>
                חזור
              </button>
            )}
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

export default ErrorPage;