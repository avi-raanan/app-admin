// נתיב: client/src/components/assets/AssetForm.jsx
import React, { useState, useEffect } from 'react';
import './AssetForm.scss';

const AssetForm = ({ asset, onSave, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // פרטי נכס בסיסיים
    name: '',
    address: '',
    city: '',
    phone: '',
    extension: '',
    electricMeter: '',
    electricContract: '',
    waterMeter: '',
    waterContract: '',
    propertyNumber: '',
    notes: '',
    status: 'active',
    branch_id: '',
    
    // פרטי בעל הנכס
    landlord: {
      name: '',
      phone: '',
      email: '',
      address: '',
      id_number: '',
      notes: ''
    },
    
    // פרטי חוזה שכירות
    lease: {
      start_date: '',
      end_date: '',
      monthly_rent: '',
      payment_method: 'bank_transfer'
    }
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setFormData({
        ...asset,
        landlord: asset.landlord || {
          name: '',
          phone: '',
          email: '',
          address: '',
          id_number: '',
          notes: ''
        },
        lease: asset.lease || {
          start_date: '',
          end_date: '',
          monthly_rent: '',
          payment_method: 'bank_transfer'
        }
      });
    }
  }, [asset]);

  const handleInputChange = (field, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // נקה שגיאה אם קיימת
    const errorKey = section ? `${section}.${field}` : field;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          newErrors.name = 'שם הנכס נדרש';
        }
        if (!formData.address.trim()) {
          newErrors.address = 'כתובת נדרשת';
        }
        if (!formData.city.trim()) {
          newErrors.city = 'עיר נדרשת';
        }
        if (!formData.phone.trim()) {
          newErrors.phone = 'טלפון נדרש';
        }
        if (!formData.branch_id) {
          newErrors.branch_id = 'בחירת סניף נדרשת';
        }
        break;
      
      case 2:
        if (!formData.landlord.name.trim()) {
          newErrors['landlord.name'] = 'שם בעל הנכס נדרש';
        }
        if (!formData.landlord.phone.trim()) {
          newErrors['landlord.phone'] = 'טלפון בעל הנכס נדרש';
        }
        if (formData.landlord.email && !/\S+@\S+\.\S+/.test(formData.landlord.email)) {
          newErrors['landlord.email'] = 'כתובת אימייל לא תקינה';
        }
        break;
      
      case 3:
        if (!formData.lease.start_date) {
          newErrors['lease.start_date'] = 'תאריך תחילת חוזה נדרש';
        }
        if (!formData.lease.end_date) {
          newErrors['lease.end_date'] = 'תאריך סיום חוזה נדרש';
        }
        if (!formData.lease.monthly_rent) {
          newErrors['lease.monthly_rent'] = 'סכום שכירות נדרש';
        }
        
        // בדיקה שתאריך הסיום מאוחר מתאריך ההתחלה
        if (formData.lease.start_date && formData.lease.end_date) {
          if (new Date(formData.lease.end_date) <= new Date(formData.lease.start_date)) {
            newErrors['lease.end_date'] = 'תאריך הסיום חייב להיות מאוחר מתאריך ההתחלה';
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // וליד את השלב הנוכחי
    if (!validateStep(currentStep)) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving asset:', error);
    } finally {
      setSaving(false);
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'פרטי הנכס',
      2: 'בעל הנכס',
      3: 'חוזה שכירות',
      4: 'סיכום והערות'
    };
    return titles[step];
  };

  const handleStepClick = (step) => {
    // אפשר מעבר רק לשלבים שכבר עברו validation
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="asset-form-overlay">
      <div className="asset-form-container">
        <div className="asset-form">
          
          {/* כותרת הטופס */}
          <div className="form-header">
            <h2>
              <i className="bi bi-building me-2"></i>
              {asset ? 'עריכת נכס' : 'הוספת נכס חדש'}
            </h2>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="סגור"
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
              >
                <div className="step-number">{step}</div>
                <div className="step-title">{getStepTitle(step)}</div>
              </div>
            ))}
          </div>

          {/* תוכן הטופס */}
          <div className="form-content">
            
            {/* שלב 1: פרטי הנכס */}
            {currentStep === 1 && (
              <div className="form-step">
                <h3>פרטי הנכס הבסיסיים</h3>
                
                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label required">
                        <i className="bi bi-building me-2"></i>
                        שם הנכס
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="למשל: צימר רומנטי - ירושלים"
                      />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="status" className="form-label">
                        <i className="bi bi-circle-fill me-2"></i>
                        סטטוס
                      </label>
                      <select
                        className="form-select"
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                      >
                        <option value="active">פעיל</option>
                        <option value="inactive">לא פעיל</option>
                        <option value="maintenance">בתחזוקה</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8">
                    <div className="form-group">
                      <label htmlFor="address" className="form-label required">
                        <i className="bi bi-geo-alt me-2"></i>
                        כתובת
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="רחוב, מספר בית"
                      />
                      {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label required">
                        <i className="bi bi-map me-2"></i>
                        עיר
                      </label>
                      <select
                        className={`form-select ${errors.city ? 'is-invalid' : ''}`}
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      >
                        <option value="">בחר עיר</option>
                        <option value="ירושלים">ירושלים</option>
                        <option value="תל אביב">תל אביב</option>
                        <option value="חיפה">חיפה</option>
                        <option value="באר שבע">באר שבע</option>
                        <option value="אילת">אילת</option>
                        <option value="צפת">צפת</option>
                        <option value="טבריה">טבריה</option>
                      </select>
                      {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label required">
                        <i className="bi bi-telephone me-2"></i>
                        טלפון ראשי
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="02-1234567"
                      />
                      {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="extension" className="form-label">
                        <i className="bi bi-hash me-2"></i>
                        שלוחה
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="extension"
                        value={formData.extension}
                        onChange={(e) => handleInputChange('extension', e.target.value)}
                        placeholder="101"
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="branch_id" className="form-label required">
                        <i className="bi bi-shop me-2"></i>
                        סניף
                      </label>
                      <select
                        className={`form-select ${errors.branch_id ? 'is-invalid' : ''}`}
                        id="branch_id"
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
                </div>

                <div className="utilities-section">
                  <h4>
                    <i className="bi bi-lightning me-2"></i>
                    פרטי חשמל ומים
                  </h4>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="utility-group">
                        <h5>
                          <i className="bi bi-lightning-charge"></i>
                          חשמל
                        </h5>
                        <div className="form-group">
                          <label htmlFor="electricMeter" className="form-label">מספר מונה חשמל</label>
                          <input
                            type="text"
                            className="form-control"
                            id="electricMeter"
                            value={formData.electricMeter}
                            onChange={(e) => handleInputChange('electricMeter', e.target.value)}
                            placeholder="EL123456"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="electricContract" className="form-label">מספר חוזה חשמל</label>
                          <input
                            type="text"
                            className="form-control"
                            id="electricContract"
                            value={formData.electricContract}
                            onChange={(e) => handleInputChange('electricContract', e.target.value)}
                            placeholder="EC789012"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="utility-group">
                        <h5>
                          <i className="bi bi-droplet"></i>
                          מים
                        </h5>
                        <div className="form-group">
                          <label htmlFor="waterMeter" className="form-label">מספר מד מים</label>
                          <input
                            type="text"
                            className="form-control"
                            id="waterMeter"
                            value={formData.waterMeter}
                            onChange={(e) => handleInputChange('waterMeter', e.target.value)}
                            placeholder="WM345678"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="waterContract" className="form-label">מספר חוזה מים</label>
                          <input
                            type="text"
                            className="form-control"
                            id="waterContract"
                            value={formData.waterContract}
                            onChange={(e) => handleInputChange('waterContract', e.target.value)}
                            placeholder="WC901234"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="propertyNumber" className="form-label">
                    <i className="bi bi-card-list me-2"></i>
                    מספר נכס בארנונה
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="propertyNumber"
                    value={formData.propertyNumber}
                    onChange={(e) => handleInputChange('propertyNumber', e.target.value)}
                    placeholder="PR567890"
                  />
                </div>
              </div>
            )}

            {/* שלב 2: פרטי בעל הנכס */}
            {currentStep === 2 && (
              <div className="form-step">
                <h3>פרטי בעל הנכס</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="landlord-name" className="form-label required">
                        <i className="bi bi-person me-2"></i>
                        שם מלא
                      </label>
                      <input
                        type="text"
                        className={`form-control ${errors['landlord.name'] ? 'is-invalid' : ''}`}
                        id="landlord-name"
                        value={formData.landlord.name}
                        onChange={(e) => handleInputChange('name', e.target.value, 'landlord')}
                        placeholder="שם פרטי ומשפחה"
                      />
                      {errors['landlord.name'] && <div className="invalid-feedback">{errors['landlord.name']}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="landlord-id" className="form-label">
                        <i className="bi bi-card-text me-2"></i>
                        ת.ז. / ח.פ.
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="landlord-id"
                        value={formData.landlord.id_number}
                        onChange={(e) => handleInputChange('id_number', e.target.value, 'landlord')}
                        placeholder="123456789"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="landlord-phone" className="form-label required">
                        <i className="bi bi-telephone me-2"></i>
                        טלפון
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors['landlord.phone'] ? 'is-invalid' : ''}`}
                        id="landlord-phone"
                        value={formData.landlord.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value, 'landlord')}
                        placeholder="050-1234567"
                      />
                      {errors['landlord.phone'] && <div className="invalid-feedback">{errors['landlord.phone']}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="landlord-email" className="form-label">
                        <i className="bi bi-envelope me-2"></i>
                        אימייל
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors['landlord.email'] ? 'is-invalid' : ''}`}
                        id="landlord-email"
                        value={formData.landlord.email}
                        onChange={(e) => handleInputChange('email', e.target.value, 'landlord')}
                        placeholder="example@email.com"
                      />
                      {errors['landlord.email'] && <div className="invalid-feedback">{errors['landlord.email']}</div>}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="landlord-address" className="form-label">
                    <i className="bi bi-geo-alt me-2"></i>
                    כתובת למשלוח דואר
                  </label>
                  <textarea
                    className="form-control"
                    id="landlord-address"
                    rows="3"
                    value={formData.landlord.address}
                    onChange={(e) => handleInputChange('address', e.target.value, 'landlord')}
                    placeholder="כתובת מלאה כולל מיקוד"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="landlord-notes" className="form-label">
                    <i className="bi bi-chat-text me-2"></i>
                    הערות על בעל הנכס
                  </label>
                  <textarea
                    className="form-control"
                    id="landlord-notes"
                    rows="3"
                    value={formData.landlord.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value, 'landlord')}
                    placeholder="הערות נוספות..."
                  ></textarea>
                </div>
              </div>
            )}

            {/* שלב 3: פרטי חוזה השכירות */}
            {currentStep === 3 && (
              <div className="form-step">
                <h3>פרטי חוזה השכירות</h3>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lease-start" className="form-label required">
                        <i className="bi bi-calendar-plus me-2"></i>
                        תאריך תחילת השכירות
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors['lease.start_date'] ? 'is-invalid' : ''}`}
                        id="lease-start"
                        value={formData.lease.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value, 'lease')}
                      />
                      {errors['lease.start_date'] && <div className="invalid-feedback">{errors['lease.start_date']}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lease-end" className="form-label required">
                        <i className="bi bi-calendar-x me-2"></i>
                        תאריך סיום השכירות
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors['lease.end_date'] ? 'is-invalid' : ''}`}
                        id="lease-end"
                        value={formData.lease.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value, 'lease')}
                      />
                      {errors['lease.end_date'] && <div className="invalid-feedback">{errors['lease.end_date']}</div>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="lease-rent" className="form-label required">
                        <i className="bi bi-currency-shekel me-2"></i>
                        סכום השכירות החודשי
                      </label>
                      <div className="input-group">
                        <input
                          type="number"
                          className={`form-control ${errors['lease.monthly_rent'] ? 'is-invalid' : ''}`}
                          id="lease-rent"
                          value={formData.lease.monthly_rent}
                          onChange={(e) => handleInputChange('monthly_rent', e.target.value, 'lease')}
                          placeholder="8500"
                          min="0"
                        />
                        <span className="input-group-text">₪</span>
                      </div>
                      {errors['lease.monthly_rent'] && <div className="invalid-feedback">{errors['lease.monthly_rent']}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="payment-method" className="form-label">
                        <i className="bi bi-credit-card me-2"></i>
                        אמצעי תשלום
                      </label>
                      <select
                        className="form-select"
                        id="payment-method"
                        value={formData.lease.payment_method}
                        onChange={(e) => handleInputChange('payment_method', e.target.value, 'lease')}
                      >
                        <option value="bank_transfer">העברה בנקאית</option>
                        <option value="check">צ'ק</option>
                        <option value="cash">מזומן</option>
                        <option value="other">אחר</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* חישוב מידע נוסף על החוזה */}
                {formData.lease.start_date && formData.lease.end_date && (
                  <div className="lease-info-panel">
                    <h5>
                      <i className="bi bi-info-circle me-2"></i>
                      מידע נוסף על החוזה
                    </h5>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">תקופת החוזה:</span>
                        <span className="info-value">
                          {Math.ceil((new Date(formData.lease.end_date) - new Date(formData.lease.start_date)) / (1000 * 60 * 60 * 24 * 365))} שנים
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">סה"כ שכירות:</span>
                        <span className="info-value">
                          ₪{(formData.lease.monthly_rent * Math.ceil((new Date(formData.lease.end_date) - new Date(formData.lease.start_date)) / (1000 * 60 * 60 * 24 * 30))).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* שלב 4: סיכום והערות */}
            {currentStep === 4 && (
              <div className="form-step">
                <h3>סיכום והערות</h3>
                
                <div className="form-group">
                  <label htmlFor="notes" className="form-label">
                    <i className="bi bi-chat-text me-2"></i>
                    הערות כלליות על הנכס
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows="5"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="הערות נוספות, מיקום מפתחות, הוראות מיוחדות..."
                  ></textarea>
                </div>

                {/* סיכום הנכס */}
                <div className="asset-summary">
                  <h4>
                    <i className="bi bi-check-circle me-2"></i>
                    סיכום הנכס
                  </h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">שם הנכס:</span>
                      <span className="summary-value">{formData.name || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">כתובת:</span>
                      <span className="summary-value">{formData.address || 'לא הוזן'}, {formData.city || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">בעל הנכס:</span>
                      <span className="summary-value">{formData.landlord.name || 'לא הוזן'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">שכירות חודשית:</span>
                      <span className="summary-value">
                        ₪{formData.lease.monthly_rent ? parseInt(formData.lease.monthly_rent).toLocaleString() : '0'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">תקופת החוזה:</span>
                      <span className="summary-value">
                        {formData.lease.start_date && formData.lease.end_date 
                          ? `${formData.lease.start_date} - ${formData.lease.end_date}`
                          : 'לא הוזן'}
                      </span>
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
                  <i className="bi bi-arrow-right me-2"></i>
                  קודם
                </button>
              )}

              <div className="primary-buttons">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg"
                  onClick={onCancel}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  ביטול
                </button>

                {currentStep < 4 ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleNext}
                  >
                    הבא
                    <i className="bi bi-arrow-left ms-2"></i>
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
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">שומר...</span>
                        </div>
                        שומר...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {asset ? 'עדכן נכס' : 'הוסף נכס'}
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

export default AssetForm;