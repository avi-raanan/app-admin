// נתיב: client/src/components/vehicles/VehicleForm.jsx
import React, { useState, useEffect } from 'react';
import './VehicleForm.scss';

const VehicleForm = ({ vehicle, onSave, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    license_number: '',
    model: '',
    color: '',
    license_expiry: '',
    maintenance_end: '',
    purchase_date: '',
    kms: '',
    key_count: 2,
    notes: '',
    status: 'active',
    branch_id: '',
    driver_name: '',
    driver_start_date: '',
    driver_end_date: '',
    insurance_company: '',
    insurance_amount: '',
    insurance_type: 'comprehensive',
    insurance_start_date: '',
    insurance_end_date: ''
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        license_number: vehicle.license_number || '',
        model: vehicle.model || '',
        color: vehicle.color || '',
        license_expiry: vehicle.license_expiry || '',
        maintenance_end: vehicle.maintenance_end || '',
        purchase_date: vehicle.purchase_date || '',
        kms: vehicle.kms || '',
        key_count: vehicle.key_count || 2,
        notes: vehicle.notes || '',
        status: vehicle.status || 'active',
        branch_id: vehicle.branch_id || '',
        driver_name: vehicle.driver_name || '',
        driver_start_date: vehicle.driver_start_date || '',
        driver_end_date: vehicle.driver_end_date || '',
        insurance_company: vehicle.insurance_company || '',
        insurance_amount: vehicle.insurance_amount || '',
        insurance_type: vehicle.insurance_type || 'comprehensive',
        insurance_start_date: vehicle.insurance_start_date || '',
        insurance_end_date: vehicle.insurance_end_date || ''
      });
    }
  }, [vehicle]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.license_number.trim()) {
        newErrors.license_number = 'מספר רישוי נדרש';
      }
      if (!formData.model.trim()) {
        newErrors.model = 'דגם הרכב נדרש';
      }
      if (!formData.color) {
        newErrors.color = 'צבע הרכב נדרש';
      }
      if (!formData.branch_id) {
        newErrors.branch_id = 'בחירת סניף נדרשת';
      }
    }

    if (currentStep === 2) {
      if (!formData.license_expiry) {
        newErrors.license_expiry = 'תאריך פקיעת רישיון נדרש';
      }
      if (!formData.maintenance_end) {
        newErrors.maintenance_end = 'תאריך סיום תחזוקה נדרש';
      }
      if (!formData.purchase_date) {
        newErrors.purchase_date = 'תאריך רכישה נדרש';
      }
      if (!formData.kms) {
        newErrors.kms = 'קילומטראז נדרש';
      }
    }

    if (currentStep === 3) {
      if (!formData.insurance_company.trim()) {
        newErrors.insurance_company = 'חברת ביטוח נדרשת';
      }
      if (!formData.insurance_amount) {
        newErrors.insurance_amount = 'סכום ביטוח נדרש';
      }
      if (!formData.insurance_start_date) {
        newErrors.insurance_start_date = 'תאריך תחילת ביטוח נדרש';
      }
      if (!formData.insurance_end_date) {
        newErrors.insurance_end_date = 'תאריך סיום ביטוח נדרש';
      }
      
      if (formData.insurance_start_date && formData.insurance_end_date) {
        if (new Date(formData.insurance_end_date) <= new Date(formData.insurance_start_date)) {
          newErrors.insurance_end_date = 'תאריך הסיום חייב להיות מאוחר מתאריך ההתחלה';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // תיקון: יצירת אובייקט במבנה הנכון
      const vehicleData = {
        id: vehicle?.id || Date.now(),
        license_number: formData.license_number,
        model: formData.model,
        color: formData.color,
        license_expiry: formData.license_expiry,
        maintenance_end: formData.maintenance_end,
        purchase_date: formData.purchase_date,
        kms: formData.kms,
        key_count: formData.key_count,
        notes: formData.notes,
        status: formData.status,
        branch_id: formData.branch_id,
        // מבנה נהג
        driver: {
          name: formData.driver_name,
          start_date: formData.driver_start_date,
          end_date: formData.driver_end_date
        },
        // מבנה ביטוח
        insurance: {
          company: formData.insurance_company,
          amount: formData.insurance_amount,
          type: formData.insurance_type,
          start_date: formData.insurance_start_date,
          end_date: formData.insurance_end_date
        }
      };

      console.log('Saving vehicle data:', vehicleData);
      await onSave(vehicleData);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('שגיאה בשמירת הרכב. אנא נסה שוב.');
    } finally {
      setSaving(false);
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'פרטי הרכב',
      2: 'תאריכים וקילומטר',
      3: 'פרטי ביטוח',
      4: 'נהג והערות'
    };
    return titles[step];
  };

  const canGoToStep = (step) => {
    return step <= currentStep;
  };

  const handleStepClick = (step) => {
    if (canGoToStep(step)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="vehicle-form-overlay">
      <div className="vehicle-form-container">
        <div className="vehicle-form">
          
          {/* כותרת */}
          <div className="form-header">
            <h2>
              <i className="bi bi-truck"></i>
              {vehicle ? 'עריכת רכב' : 'הוספת רכב חדש'}
            </h2>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>

          {/* אינדיקטור שלבים */}
          <div className="form-steps">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`step ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                onClick={() => handleStepClick(step)}
                style={{ cursor: canGoToStep(step) ? 'pointer' : 'default' }}
              >
                <div className="step-number">{step}</div>
                <div className="step-title">{getStepTitle(step)}</div>
              </div>
            ))}
          </div>

          {/* תוכן הטופס */}
          <div className="form-content">
            
            {/* שלב 1: פרטי הרכב */}
            {currentStep === 1 && (
              <div className="form-step">
                <h3>פרטי הרכב הבסיסיים</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-card-text"></i>
                        מספר רישוי
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.license_number ? 'is-invalid' : ''}`}
                        value={formData.license_number}
                        onChange={(e) => handleInputChange('license_number', e.target.value)}
                        placeholder="123-45-678"
                      />
                      {errors.license_number && <div className="invalid-feedback">{errors.license_number}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="bi bi-circle-fill"></i>
                        סטטוס
                      </label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="active">פעיל</option>
                        <option value="maintenance">בתחזוקה</option>
                        <option value="available">זמין להקצאה</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-car-front"></i>
                        דגם הרכב
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.model ? 'is-invalid' : ''}`}
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        placeholder="טויוטה קורולה 2022"
                      />
                      {errors.model && <div className="invalid-feedback">{errors.model}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-palette"></i>
                        צבע
                      </label>
                      <select
                        className={`form-select ${errors.color ? 'is-invalid' : ''}`}
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                      >
                        <option value="">בחר צבע</option>
                        <option value="לבן">לבן</option>
                        <option value="שחור">שחור</option>
                        <option value="כסוף">כסוף</option>
                        <option value="אפור">אפור</option>
                        <option value="כחול">כחול</option>
                        <option value="אדום">אדום</option>
                        <option value="ירוק">ירוק</option>
                        <option value="צהוב">צהוב</option>
                      </select>
                      {errors.color && <div className="invalid-feedback">{errors.color}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-shop"></i>
                        סניף
                      </label>
                      <select
                        className={`form-select ${errors.branch_id ? 'is-invalid' : ''}`}
                        value={formData.branch_id}
                        onChange={(e) => handleInputChange('branch_id', e.target.value)}
                      >
                        <option value="">בחר סניף</option>
                        <option value="1">סניף מרכז</option>
                        <option value="2">סניף צפון</option>
                        <option value="3">סניף דרום</option>
                      </select>
                      {errors.branch_id && <div className="invalid-feedback">{errors.branch_id}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="bi bi-key"></i>
                        מספר מפתחות
                      </label>
                      <select
                        className="form-select"
                        value={formData.key_count}
                        onChange={(e) => handleInputChange('key_count', parseInt(e.target.value))}
                      >
                        <option value={1}>1 מפתח</option>
                        <option value={2}>2 מפתחות</option>
                        <option value={3}>3 מפתחות</option>
                        <option value={4}>4 מפתחות</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* שלב 2: תאריכים וקילומטראז */}
            {currentStep === 2 && (
              <div className="form-step">
                <h3>תאריכים וקילומטראז</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-calendar-plus"></i>
                        תאריך רכישה
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.purchase_date ? 'is-invalid' : ''}`}
                        value={formData.purchase_date}
                        onChange={(e) => handleInputChange('purchase_date', e.target.value)}
                      />
                      {errors.purchase_date && <div className="invalid-feedback">{errors.purchase_date}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-calendar-x"></i>
                        תוקף רישיון נהיגה
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.license_expiry ? 'is-invalid' : ''}`}
                        value={formData.license_expiry}
                        onChange={(e) => handleInputChange('license_expiry', e.target.value)}
                      />
                      {errors.license_expiry && <div className="invalid-feedback">{errors.license_expiry}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-tools"></i>
                        תאריך סיום תחזוקה
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.maintenance_end ? 'is-invalid' : ''}`}
                        value={formData.maintenance_end}
                        onChange={(e) => handleInputChange('maintenance_end', e.target.value)}
                      />
                      {errors.maintenance_end && <div className="invalid-feedback">{errors.maintenance_end}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-speedometer2"></i>
                        קילומטראז נוכחי
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.kms ? 'is-invalid' : ''}`}
                        value={formData.kms}
                        onChange={(e) => handleInputChange('kms', e.target.value)}
                        placeholder="45,000"
                      />
                      {errors.kms && <div className="invalid-feedback">{errors.kms}</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* שלב 3: פרטי ביטוח */}
            {currentStep === 3 && (
              <div className="form-step">
                <h3>פרטי ביטוח</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-shield-check"></i>
                        חברת ביטוח
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.insurance_company ? 'is-invalid' : ''}`}
                        value={formData.insurance_company}
                        onChange={(e) => handleInputChange('insurance_company', e.target.value)}
                        placeholder="מנורה מבטחים"
                      />
                      {errors.insurance_company && <div className="invalid-feedback">{errors.insurance_company}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <i className="bi bi-list-ul"></i>
                        סוג ביטוח
                      </label>
                      <select
                        className="form-select"
                        value={formData.insurance_type}
                        onChange={(e) => handleInputChange('insurance_type', e.target.value)}
                      >
                        <option value="comprehensive">מלא</option>
                        <option value="third_party_plus">חובה פלוס</option>
                        <option value="third_party">חובה</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-calendar-plus"></i>
                        תחילת ביטוח
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.insurance_start_date ? 'is-invalid' : ''}`}
                        value={formData.insurance_start_date}
                        onChange={(e) => handleInputChange('insurance_start_date', e.target.value)}
                      />
                      {errors.insurance_start_date && <div className="invalid-feedback">{errors.insurance_start_date}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label required">
                        <i className="bi bi-calendar-x"></i>
                        סיום ביטוח
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.insurance_end_date ? 'is-invalid' : ''}`}
                        value={formData.insurance_end_date}
                        onChange={(e) => handleInputChange('insurance_end_date', e.target.value)}
                      />
                      {errors.insurance_end_date && <div className="invalid-feedback">{errors.insurance_end_date}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <i className="bi bi-currency-shekel"></i>
                    סכום ביטוח
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className={`form-control ${errors.insurance_amount ? 'is-invalid' : ''}`}
                      value={formData.insurance_amount}
                      onChange={(e) => handleInputChange('insurance_amount', e.target.value)}
                      placeholder="15000"
                      min="0"
                    />
                    <span className="input-group-text">₪</span>
                  </div>
                  {errors.insurance_amount && <div className="invalid-feedback">{errors.insurance_amount}</div>}
                </div>
              </div>
            )}

            {/* שלב 4: נהג והערות */}
            {currentStep === 4 && (
              <div className="form-step">
                <h3>נהג והערות</h3>
                
                <div className="driver-section">
                  <h4>
                    <i className="bi bi-person"></i>
                    פרטי נהג (אופציונלי)
                  </h4>
                  
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-label">שם הנהג</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.driver_name}
                          onChange={(e) => handleInputChange('driver_name', e.target.value)}
                          placeholder="שם פרטי ומשפחה"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-label">תחילת נהיגה</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.driver_start_date}
                          onChange={(e) => handleInputChange('driver_start_date', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="form-group">
                        <label className="form-label">סיום נהיגה</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.driver_end_date}
                          onChange={(e) => handleInputChange('driver_end_date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-chat-text"></i>
                    הערות על הרכב
                  </label>
                  <textarea
                    className="form-control"
                    rows="5"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="הערות נוספות, מצב הרכב, בעיות ידועות..."
                  ></textarea>
                </div>

                {/* סיכום הרכב */}
                <div className="vehicle-summary">
                  <h4>
                    <i className="bi bi-check-circle"></i>
                    סיכום הרכב
                  </h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">מספר רישוי:</span>
                      <span className="summary-value">{formData.license_number || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">דגם:</span>
                      <span className="summary-value">{formData.model || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">צבע:</span>
                      <span className="summary-value">{formData.color || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">ביטוח:</span>
                      <span className="summary-value">{formData.insurance_company || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">נהג:</span>
                      <span className="summary-value">{formData.driver_name || 'לא משויך'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* כפתורי ניווט */}
          <div className="form-footer">
            <div className="navigation-buttons">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={handlePrev}
                >
                  <i className="bi bi-arrow-right"></i>
                  קודם
                </button>
              )}

              <div className="primary-buttons">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={onCancel}
                >
                  <i className="bi bi-x-circle"></i>
                  ביטול
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleNext}
                  >
                    הבא
                    <i className="bi bi-arrow-left"></i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-success btn-lg"
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="spinner-border spinner-border-sm"></div>
                        שומר...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle"></i>
                        {vehicle ? 'עדכן רכב' : 'הוסף רכב'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;