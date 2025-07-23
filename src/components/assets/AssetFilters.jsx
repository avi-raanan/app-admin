// נתיב: client/src/components/assets/AssetFilters.jsx
import React from 'react';
import './AssetFilters.scss';

const AssetFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFiltersChange, 
  viewMode, 
  onViewModeChange,
  assetsCount 
}) => {
  
  const handleFilterChange = (filterName, value) => {
    onFiltersChange({
      ...filters,
      [filterName]: value
    });
  };

  const clearAllFilters = () => {
    onSearchChange('');
    onFiltersChange({
      status: 'all',
      city: 'all',
      branch: 'all'
    });
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.status !== 'all' || 
           filters.city !== 'all' || 
           filters.branch !== 'all';
  };

  return (
    <div className="asset-filters">
      {/* כותרת המסננים */}
      <div className="filters-header">
        <div className="search-section">
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="form-control search-input"
              placeholder="חיפוש לפי שם נכס, כתובת או עיר..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-link clear-search"
                onClick={() => onSearchChange('')}
                title="נקה חיפוש"
                type="button"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>

        <div className="view-controls">
          <div className="btn-group view-toggle" role="group">
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onViewModeChange('grid')}
              title="תצוגת כרטיסים"
              type="button"
            >
              <i className="bi bi-grid-3x3-gap"></i>
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onViewModeChange('table')}
              title="תצוגת טבלה"
              type="button"
            >
              <i className="bi bi-table"></i>
            </button>
          </div>
        </div>
      </div>

      {/* תוכן המסננים */}
      <div className="filters-content">
        <div className="filter-group">
          <label className="filter-label">
            <i className="bi bi-funnel"></i>
            סינון מתקדם:
          </label>
          
          <div className="filters-row">
            <div className="filter-item">
              <label htmlFor="status-filter" className="form-label">סטטוס</label>
              <select
                id="status-filter"
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="inactive">לא פעיל</option>
                <option value="maintenance">בתחזוקה</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="city-filter" className="form-label">עיר</label>
              <select
                id="city-filter"
                className="form-select"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                <option value="all">כל הערים</option>
                <option value="ירושלים">ירושלים</option>
                <option value="תל אביב">תל אביב</option>
                <option value="חיפה">חיפה</option>
                <option value="באר שבע">באר שבע</option>
                <option value="אילת">אילת</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="branch-filter" className="form-label">סניף</label>
              <select
                id="branch-filter"
                className="form-select"
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
              >
                <option value="all">כל הסניפים</option>
                <option value="1">סניף מרכז</option>
                <option value="2">סניף צפון</option>
                <option value="3">סניף דרום</option>
              </select>
            </div>

            {hasActiveFilters() && (
              <div className="filter-item">
                <button
                  className="btn btn-outline-secondary clear-filters"
                  onClick={clearAllFilters}
                  title="נקה כל הסינונים"
                  type="button"
                >
                  <i className="bi bi-x-circle me-1"></i>
                  נקה הכל
                </button>
              </div>
            )}
          </div>
        </div>

        {/* מידע על התוצאות */}
        <div className="results-info">
          <div className="results-count">
            <i className="bi bi-info-circle me-1"></i>
            נמצאו {assetsCount} נכסים
          </div>
          
          {hasActiveFilters() && (
            <div className="active-filters">
              <span className="filters-label">מסננים פעילים:</span>
              
              {searchTerm && (
                <span className="filter-tag">
                  <i className="bi bi-search me-1"></i>
                  "{searchTerm}"
                  <button 
                    className="btn-close-tag"
                    onClick={() => onSearchChange('')}
                    type="button"
                    aria-label="הסר חיפוש"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              
              {filters.status !== 'all' && (
                <span className="filter-tag">
                  <i className="bi bi-circle-fill me-1"></i>
                  {filters.status === 'active' ? 'פעיל' : 
                   filters.status === 'inactive' ? 'לא פעיל' : 'בתחזוקה'}
                  <button 
                    className="btn-close-tag"
                    onClick={() => handleFilterChange('status', 'all')}
                    type="button"
                    aria-label="הסר סינון סטטוס"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              
              {filters.city !== 'all' && (
                <span className="filter-tag">
                  <i className="bi bi-geo-alt me-1"></i>
                  {filters.city}
                  <button 
                    className="btn-close-tag"
                    onClick={() => handleFilterChange('city', 'all')}
                    type="button"
                    aria-label="הסר סינון עיר"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              
              {filters.branch !== 'all' && (
                <span className="filter-tag">
                  <i className="bi bi-shop me-1"></i>
                  סניף {filters.branch}
                  <button 
                    className="btn-close-tag"
                    onClick={() => handleFilterChange('branch', 'all')}
                    type="button"
                    aria-label="הסר סינון סניף"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* קיצורי דרך למסננים מהירים */}
      <div className="quick-filters">
        <span className="quick-filters-label">סינון מהיר:</span>
        <div className="quick-filter-buttons">
          <button
            className={`btn btn-sm ${filters.status === 'active' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => handleFilterChange('status', filters.status === 'active' ? 'all' : 'active')}
            type="button"
          >
            <i className="bi bi-check-circle me-1"></i>
            נכסים פעילים
          </button>
          
          <button
            className={`btn btn-sm ${filters.status === 'maintenance' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => handleFilterChange('status', filters.status === 'maintenance' ? 'all' : 'maintenance')}
            type="button"
          >
            <i className="bi bi-tools me-1"></i>
            בתחזוקה
          </button>
          
          <button
            className="btn btn-sm btn-outline-info"
            onClick={() => {
              // סינון נכסים שהחוזה שלהם יפוג בקרוב
              console.log('Filter assets with expiring contracts');
            }}
            type="button"
          >
            <i className="bi bi-calendar-x me-1"></i>
            חוזים שיפוגו בקרוב
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssetFilters;