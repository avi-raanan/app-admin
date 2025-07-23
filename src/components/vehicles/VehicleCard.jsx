// נתיב: client/src/components/vehicles/VehicleCard.jsx
import React, { useState } from 'react';
import './VehicleCard.scss';

const VehicleCard = ({ vehicle, onEdit, onDelete, userRole }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusConfig = (status) => {
    const statusConfig = {
      active: { 
        text: 'פעיל', 
        class: 'success',
        icon: 'bi-check-circle-fill'
      },
      maintenance: { 
        text: 'בתחזוקה', 
        class: 'warning',
        icon: 'bi-tools'
      },
      available: { 
        text: 'זמין', 
        class: 'info',
        icon: 'bi-car-front'
      }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const statusConfig = getStatusConfig(vehicle.status);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const calculateDaysUntilExpiry = (dateString) => {
    const expiryDate = new Date(dateString);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilLicenseExpiry = calculateDaysUntilExpiry(vehicle.license_expiry);
  const daysUntilInsuranceExpiry = calculateDaysUntilExpiry(vehicle.insurance.end_date);

  const getExpiryWarning = (days, type) => {
    if (days <= 0) return { type: 'expired', text: `${type} פג תוקף`, class: 'danger' };
    if (days <= 30) return { type: 'critical', text: `${type} יפוג בעוד ${days} ימים`, class: 'danger' };
    if (days <= 90) return { type: 'warning', text: `${type} יפוג בעוד ${days} ימים`, class: 'warning' };
    return null;
  };

  const licenseWarning = getExpiryWarning(daysUntilLicenseExpiry, 'רישיון נהיגה');
  const insuranceWarning = getExpiryWarning(daysUntilInsuranceExpiry, 'ביטוח');

  return (
    <div className={`vehicle-card ${vehicle.status}`}>
      <div className="vehicle-card-header">
        <div className="vehicle-status">
          <span className={`status-badge status-${statusConfig.class}`}>
            <i className={statusConfig.icon}></i>
            {statusConfig.text}
          </span>
        </div>
        <div className="vehicle-actions">
          {(userRole === 'admin' || userRole === 'manager') && (
            <>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => onEdit(vehicle)}
                title="ערוך רכב"
              >
                <i className="bi bi-pencil"></i>
              </button>
              {userRole === 'admin' && (
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(vehicle.id)}
                  title="מחק רכב"
                >
                  <i className="bi bi-trash"></i>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="vehicle-card-body">
        <div className="vehicle-main-info">
          <h3 className="vehicle-license">
            <i className="bi bi-car-front"></i>
            {vehicle.license_number}
          </h3>
          <div className="vehicle-model">
            <i className="bi bi-gear"></i>
            <span>{vehicle.model}</span>
          </div>
          <div className="vehicle-color">
            <i className="bi bi-palette"></i>
            <span>צבע: {vehicle.color}</span>
          </div>
        </div>

        <div className="vehicle-details">
          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-person"></i>
              נהג:
            </span>
            <span className="detail-value">
              {vehicle.driver ? vehicle.driver.name : 'לא משויך'}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-speedometer2"></i>
              ק"מ:
            </span>
            <span className="detail-value">{vehicle.kms}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-key"></i>
              מפתחות:
            </span>
            <span className="detail-value">{vehicle.key_count}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-shop"></i>
              סניף:
            </span>
            <span className="detail-value">{vehicle.branch_name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">
              <i className="bi bi-shield-check"></i>
              ביטוח:
            </span>
            <span className="detail-value">{vehicle.insurance.company}</span>
          </div>
        </div>

        {/* התראות תוקף */}
        <div className="expiry-warnings">
          {licenseWarning && (
            <div className={`expiry-warning ${licenseWarning.class}`}>
              <i className="bi bi-exclamation-triangle"></i>
              <span>{licenseWarning.text}</span>
            </div>
          )}
          
          {insuranceWarning && (
            <div className={`expiry-warning ${insuranceWarning.class}`}>
              <i className="bi bi-shield-x"></i>
              <span>{insuranceWarning.text}</span>
            </div>
          )}
        </div>

        <div className="vehicle-footer">
          <button
            className="btn btn-outline-info btn-sm details-toggle"
            onClick={() => setShowDetails(!showDetails)}
          >
            <i className={`bi ${showDetails ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
            {showDetails ? 'פחות פרטים' : 'עוד פרטים'}
          </button>

          <div className="maintenance-count">
            <i className="bi bi-tools"></i>
            <span>{vehicle.maintenance_history?.length || 0} טיפולים</span>
          </div>
        </div>

        {/* פרטים מורחבים */}
        {showDetails && (
          <div className="vehicle-expanded-details">
            <div className="details-section">
              <h5>
                <i className="bi bi-calendar"></i>
                תאריכים חשובים
              </h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">תאריך רכישה:</span>
                  <span className="value">{formatDate(vehicle.purchase_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">תוקף רישיון:</span>
                  <span className="value">{formatDate(vehicle.license_expiry)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">סיום תחזוקה:</span>
                  <span className="value">{formatDate(vehicle.maintenance_end)}</span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h5>
                <i className="bi bi-shield-check"></i>
                פרטי ביטוח
              </h5>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">סוג ביטוח:</span>
                  <span className="value">{vehicle.insurance.type}</span>
                </div>
                <div className="detail-item">
                  <span className="label">סכום ביטוח:</span>
                  <span className="value">₪{vehicle.insurance.amount?.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">תחילת ביטוח:</span>
                  <span className="value">{formatDate(vehicle.insurance.start_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">סיום ביטוח:</span>
                  <span className="value">{formatDate(vehicle.insurance.end_date)}</span>
                </div>
              </div>
            </div>

            {vehicle.driver && (
              <div className="details-section">
                <h5>
                  <i className="bi bi-person-lines-fill"></i>
                  פרטי נהג
                </h5>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">תחילת נהיגה:</span>
                    <span className="value">{formatDate(vehicle.driver.start_date)}</span>
                  </div>
                  {vehicle.driver.end_date && (
                    <div className="detail-item">
                      <span className="label">סיום נהיגה:</span>
                      <span className="value">{formatDate(vehicle.driver.end_date)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {vehicle.maintenance_history && vehicle.maintenance_history.length > 0 && (
              <div className="details-section">
                <h5>
                  <i className="bi bi-wrench"></i>
                  היסטוריית תיקונים
                </h5>
                <div className="maintenance-list">
                  {vehicle.maintenance_history.slice(0, 3).map((maintenance, index) => (
                    <div key={index} className="maintenance-item">
                      <div className="maintenance-header">
                        <span className="maintenance-type">{maintenance.type}</span>
                        <span className="maintenance-date">{formatDate(maintenance.date)}</span>
                      </div>
                      <div className="maintenance-description">{maintenance.description}</div>
                      <div className="maintenance-cost">₪{maintenance.cost?.toLocaleString()}</div>
                    </div>
                  ))}
                  {vehicle.maintenance_history.length > 3 && (
                    <div className="maintenance-more">
                      +{vehicle.maintenance_history.length - 3} טיפולים נוספים
                    </div>
                  )}
                </div>
              </div>
            )}

            {vehicle.notes && (
              <div className="details-section">
                <h5>
                  <i className="bi bi-chat-text"></i>
                  הערות
                </h5>
                <p className="notes-text">{vehicle.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;