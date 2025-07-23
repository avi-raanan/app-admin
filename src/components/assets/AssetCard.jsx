// נתיב: client/src/components/assets/AssetCard.jsx
import React, { useState } from 'react';
import './AssetCard.scss';

const AssetCard = ({ asset, onEdit, onDelete, userRole }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = (status) => {
    const statusConfig = {
      active: { 
        text: 'פעיל', 
        class: 'success',
        icon: 'bi-check-circle-fill'
      },
      inactive: { 
        text: 'לא פעיל', 
        class: 'secondary',
        icon: 'bi-pause-circle-fill'
      },
      maintenance: { 
        text: 'בתחזוקה', 
        class: 'warning',
        icon: 'bi-tools'
      }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const statusConfig = getStatusConfig(asset.status);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const calculateDaysUntilLeaseEnd = () => {
    const endDate = new Date(asset.lease?.end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilLeaseEnd = calculateDaysUntilLeaseEnd();

  return (
    <div className={`asset-card ${asset.status}`}>
      <div className="asset-card-header">
        <div className="asset-status">
          <span className={`status-badge status-${statusConfig.class}`}>
            <i className={statusConfig.icon}></i>
            {statusConfig.text}
          </span>
        </div>
        <div className="asset-actions">
          {(userRole === 'admin' || userRole === 'manager') && (
            <>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onEdit(asset)}
                title="ערוך נכס"
              >
                <i className="bi bi-pencil"></i>
              </button>
              {userRole === 'admin' && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(asset.id)}
                  title="מחק נכס"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="asset-card-body">
        <div className="asset-main-info">
          <h3 className="asset-name">
            <i className="bi bi-building"></i>
            {asset.name}
          </h3>
          <div className="asset-location">
            <i className="bi bi-geo-alt"></i>
            <span>{asset.address}</span>
          </div>
          <div className="asset-city">
            <i className="bi bi-map"></i>
            <span>{asset.city}</span>
          </div>
        </div>

        <div className="asset-details">
          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-telephone"></i>
              טלפון:
            </span>
            <span className="detail-value">
              {asset.phone}
              {asset.extension && ` ש. ${asset.extension}`}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-shop"></i>
              סניף:
            </span>
            <span className="detail-value">{asset.branch_name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-currency-shekel"></i>
              שכירות:
            </span>
            <span className="detail-value rent-amount">
              ₪{asset.lease?.monthly_rent?.toLocaleString()} לחודש
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-person"></i>
              בעל הנכס:
            </span>
            <span className="detail-value">{asset.landlord?.name}</span>
          </div>

          {/* התראה לתוקף חוזה */}
          {daysUntilLeaseEnd <= 90 && daysUntilLeaseEnd > 0 && (
            <div className="lease-warning">
              <i className="bi bi-exclamation-triangle"></i>
              <span>החוזה יפוג בעוד {daysUntilLeaseEnd} ימים</span>
            </div>
          )}

          {daysUntilLeaseEnd <= 0 && (
            <div className="lease-expired">
              <i className="bi bi-x-circle"></i>
              <span>החוזה פג תוקף</span>
            </div>
          )}
        </div>

        <div className="asset-footer">
          <button
            className="btn btn-outline-info btn-sm details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            <i className={`bi ${showDetails ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            {showDetails ? 'פחות פרטים' : 'עוד פרטים'}
          </button>

          <div className="asset-documents">
            <i className="bi bi-paperclip"></i>
            <span>{asset.documents?.length || 0} מסמכים</span>
          </div>
        </div>

        {/* פרטים מורחבים */}
        {showDetails && (
          <div className="asset-expanded-details">
            <div className="details-section">
              <h5>
                <i className="bi bi-lightning"></i>
                פרטי חשמל
              </h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">מספר מונה:</span>
                  <span className="value">{asset.electricMeter || 'לא זמין'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">מספר חוזה:</span>
                  <span className="value">{asset.electricContract || 'לא זמין'}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h5>
                <i className="bi bi-droplet"></i>
                פרטי מים
              </h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">מספר מד:</span>
                  <span className="value">{asset.waterMeter || 'לא זמין'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">מספר חוזה:</span>
                  <span className="value">{asset.waterContract || 'לא זמין'}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h5>
                <i className="bi bi-person-lines-fill"></i>
                פרטי בעל הנכס
              </h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">טלפון:</span>
                  <span className="value">{asset.landlord?.phone || 'לא זמין'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">אימייל:</span>
                  <span className="value">{asset.landlord?.email || 'לא זמין'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">כתובת:</span>
                  <span className="value">{asset.landlord?.address || 'לא זמין'}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h5>
                <i className="bi bi-file-text"></i>
                פרטי חוזה
              </h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">תחילת חוזה:</span>
                  <span className="value">{formatDate(asset.lease?.start_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">סיום חוזה:</span>
                  <span className="value">{formatDate(asset.lease?.end_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">אמצעי תשלום:</span>
                  <span className="value">
                    {asset.lease?.payment_method === 'bank_transfer' ? 'העברה בנקאית' : 
                     asset.lease?.payment_method === 'check' ? 'צ\'ק' : 'אחר'}
                  </span>
                </div>
              </div>
            </div>

            {asset.notes && (
              <div className="details-section">
                <h5>
                  <i className="bi bi-chat-text"></i>
                  הערות
                </h5>
                <p className="notes-text">{asset.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetCard;