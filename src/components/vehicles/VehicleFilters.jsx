// נתיב: client/src/components/vehicles/VehicleFilters.jsx
import React from 'react';
import './VehicleFilters.scss';

const VehicleFilters = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFiltersChange, 
  viewMode, 
  onViewModeChange,
  vehiclesCount 
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
      driver: 'all',
      branch: 'all',
      expiringSoon: false
    });
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.status !== 'all' || 
           filters.driver !== 'all' || 
           filters.branch !== 'all' ||
           filters.expiringSoon;
  };

  return (
    <div className="vehicle-filters">
      <div className="filters-header">
        <div className="search-section">
          <div className="search-container">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="form-control search-input"
              placeholder="חיפוש לפי מספר רישוי, דגם או נהג..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-link clear-search"
                onClick={() => onSearchChange('')}
                title="נקה חיפוש"
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
            >
              <i className="bi bi-grid-3x3-gap"></i>
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onViewModeChange('table')}
              title="תצוגת טבלה"
            >
              <i className="bi bi-table"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="filters-content">
        <div className="filter-group">
          <label className="filter-label">
            <i className="bi bi-funnel"></i>
            סינון מתקדם:
          </label>
          
          <div className="filters-row">
            <div className="filter-item">
              <label htmlFor="status-filter" className="form-label">סטטוס רכב</label>
              <select
                id="status-filter"
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="maintenance">בתחזוקה</option>
                <option value="available">זמין להקצאה</option>
              </select>
            </div>

            <div className="filter-item">
              <label htmlFor="driver-filter" className="form-label">הקצאת נהג</label>
              <select
                id="driver-filter"
                className="form-select"
                value={filters.driver}
                onChange={(e) => handleFilterChange('driver', e.target.value)}
              >
                <option value="all">כל הרכבים</option>
                <option value="assigned">רכבים משויכים</option>
                <option value="unassigned">רכבים לא משויכים</option>
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

            <div className="filter-item checkbox-filter">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="expiring-filter"
                  checked={filters.expiringSoon}
                  onChange={(e) => handleFilterChange('expiringSoon', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="expiring-filter">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  רק רכבים טעונים התראה
                </label>
              </div>
            </div>

            {hasActiveFilters() && (
              <div className="filter-item">
                <button
                  className="btn btn-outline-secondary clear-filters"
                  onClick={clearAllFilters}
                  title="נקה כל הסינונים"
                >
                  <i className="bi bi-x-circle me-1"></i>
                  נקה הכל
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="results-info">
          <div className="results-count">
            <i className="bi bi-info-circle me-1"></i>
            נמצאו {vehiclesCount} רכבים
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
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="filter-tag">
                  <i className="bi bi-circle-fill me-1"></i>
                  {filters.status === 'active' ? 'פעיל' : 
                   filters.status === 'maintenance' ? 'בתחזוקה' : 'זמין'}
                  <button 
                    className="btn-close-tag"
                    onClick={() => handleFilterChange('status', 'all')}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.driver !== 'all' && (
                <span className="filter-tag">
                  <i className="bi bi-person me-1"></i>
                  {filters.driver === 'assigned' ? 'משויכים' : 'לא משויכים'}
                  <button 
                    className="btn-close-tag"
                    onClick={() => handleFilterChange('driver', 'all')}
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
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {filters.expiringSoon && (
                <span className="filter-tag">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  טעונים התראה
                  <button 
                    className="btn-close-tag"
                    onClick={() => handleFilterChange('expiringSoon', false)}
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
          >
            <i className="bi bi-check-circle me-1"></i>
            רכבים פעילים
          </button>
          <button
            className={`btn btn-sm ${filters.status === 'maintenance' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => handleFilterChange('status', filters.status === 'maintenance' ? 'all' : 'maintenance')}
          >
            <i className="bi bi-tools me-1"></i>
            בתחזוקה
          </button>
          <button
            className={`btn btn-sm ${filters.driver === 'unassigned' ? 'btn-info' : 'btn-outline-info'}`}
            onClick={() => handleFilterChange('driver', filters.driver === 'unassigned' ? 'all' : 'unassigned')}
          >
            <i className="bi bi-person-x me-1"></i>
            ללא נהג
          </button>
          <button
            className={`btn btn-sm ${filters.expiringSoon ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => handleFilterChange('expiringSoon', !filters.expiringSoon)}
          >
            <i className="bi bi-exclamation-triangle me-1"></i>
            טעונים התראה
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;