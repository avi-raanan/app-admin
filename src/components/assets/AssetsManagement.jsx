// נתיב: client/src/components/assets/AssetsManagement.jsx
import React, { useState, useEffect } from 'react';
import AssetCard from './AssetCard';
import AssetForm from './AssetForm';
import AssetFilters from './AssetFilters';
import './AssetsManagement.scss';

const AssetsManagement = ({ userRole }) => {
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    city: 'all',
    branch: 'all'
  });
  const [viewMode, setViewMode] = useState('grid'); // grid או table

  // דמוי נתונים - בהמשך יוחלף בקריאה לשרת
  const mockAssets = [
    {
      id: 1,
      name: 'צימר רומנטי - ירושלים',
      address: 'רחוב הנביאים 15, ירושלים',
      city: 'ירושלים',
      phone: '02-6234567',
      extension: '101',
      electricMeter: 'EL123456',
      electricContract: 'EC789012',
      waterMeter: 'WM345678',
      waterContract: 'WC901234',
      propertyNumber: 'PR567890',
      status: 'active',
      branch_id: 1,
      branch_name: 'סניף מרכז',
      landlord: {
        name: 'משה כהן',
        phone: '050-1234567',
        email: 'moshe@example.com',
        address: 'רחוב הרצל 25, תל אביב',
        id_number: '123456789'
      },
      lease: {
        start_date: '2023-01-01',
        end_date: '2025-12-31',
        monthly_rent: 8500,
        payment_method: 'bank_transfer'
      },
      documents: [
        { type: 'lease_contract', url: '/docs/lease1.pdf' },
        { type: 'electric_bill', url: '/docs/electric1.pdf' }
      ],
      created_at: '2023-01-15',
      notes: 'נכס מרכזי עם נוף יפה'
    },
    {
      id: 2,
      name: 'וילה משפחתית - תל אביב',
      address: 'שדרות רוטשילד 88, תל אביב',
      city: 'תל אביב',
      phone: '03-5555555',
      extension: '',
      electricMeter: 'EL987654',
      electricContract: 'EC456789',
      waterMeter: 'WM876543',
      waterContract: 'WC123456',
      propertyNumber: 'PR098765',
      status: 'maintenance',
      branch_id: 2,
      branch_name: 'סניף צפון',
      landlord: {
        name: 'רחל לוי',
        phone: '054-9876543',
        email: 'rachel@example.com',
        address: 'רחוב דיזנגוף 100, תל אביב',
        id_number: '987654321'
      },
      lease: {
        start_date: '2023-06-01',
        end_date: '2026-05-31',
        monthly_rent: 12000,
        payment_method: 'check'
      },
      documents: [
        { type: 'lease_contract', url: '/docs/lease2.pdf' }
      ],
      created_at: '2023-06-10',
      notes: 'וילה גדולה מתאימה למשפחות'
    }
  ];

  useEffect(() => {
    // טעינת נכסים - בהמשך יוחלף בקריאה לשרת
    setTimeout(() => {
      setAssets(mockAssets);
      setFilteredAssets(mockAssets);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // סינון נכסים
    let filtered = assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || asset.status === filters.status;
      const matchesCity = filters.city === 'all' || asset.city === filters.city;
      const matchesBranch = filters.branch === 'all' || asset.branch_id.toString() === filters.branch;

      return matchesSearch && matchesStatus && matchesCity && matchesBranch;
    });

    setFilteredAssets(filtered);
  }, [assets, searchTerm, filters]);

  const handleAddAsset = () => {
    setEditingAsset(null);
    setShowForm(true);
  };

  const handleEditAsset = (asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleDeleteAsset = async (assetId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הנכס?')) {
      // כאן תהיה קריאה לשרת למחיקה
      setAssets(assets.filter(asset => asset.id !== assetId));
    }
  };

  const handleSaveAsset = (assetData) => {
    if (editingAsset) {
      // עדכון נכס קיים
      setAssets(assets.map(asset => 
        asset.id === editingAsset.id ? { ...asset, ...assetData } : asset
      ));
    } else {
      // הוספת נכס חדש
      const newAsset = {
        ...assetData,
        id: Date.now(),
        created_at: new Date().toISOString().split('T')[0]
      };
      setAssets([...assets, newAsset]);
    }
    setShowForm(false);
    setEditingAsset(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'פעיל', class: 'success' },
      inactive: { text: 'לא פעיל', class: 'secondary' },
      maintenance: { text: 'בתחזוקה', class: 'warning' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="assets-loading">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">טוען...</span>
          </div>
        </div>
        <h4>טוען נכסים...</h4>
      </div>
    );
  }

  return (
    <div className="assets-management">
      <div className="assets-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="bi bi-buildings me-3"></i>
            ניהול נכסים
          </h1>
          <p className="page-subtitle">
            ניהול וארגון כלל הנכסים בארגון
          </p>
        </div>
        
        {(userRole === 'admin' || userRole === 'manager') && (
          <div className="header-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleAddAsset}
            >
              <i className="bi bi-plus-circle me-2"></i>
              הוסף נכס חדש
            </button>
          </div>
        )}
      </div>

      {/* סטטיסטיקות מהירות */}
      <div className="assets-stats">
        <div className="stat-item">
          <div className="stat-icon bg-primary">
            <i className="bi bi-buildings"></i>
          </div>
          <div className="stat-content">
            <h3>{assets.length}</h3>
            <p>סה"כ נכסים</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-success">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{assets.filter(a => a.status === 'active').length}</h3>
            <p>נכסים פעילים</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-warning">
            <i className="bi bi-tools"></i>
          </div>
          <div className="stat-content">
            <h3>{assets.filter(a => a.status === 'maintenance').length}</h3>
            <p>בתחזוקה</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-info">
            <i className="bi bi-currency-shekel"></i>
          </div>
          <div className="stat-content">
            <h3>{assets.reduce((sum, a) => sum + (a.lease?.monthly_rent || 0), 0).toLocaleString()}</h3>
            <p>סה"כ שכירות חודשית</p>
          </div>
        </div>
      </div>

      {/* סינון וחיפוש */}
      <AssetFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        assetsCount={filteredAssets.length}
      />

      {/* רשימת נכסים */}
      <div className="assets-content">
        {filteredAssets.length === 0 ? (
          <div className="no-assets">
            <div className="no-assets-icon">
              <i className="bi bi-building-x"></i>
            </div>
            <h3>לא נמצאו נכסים</h3>
            <p>נסה לשנות את פרמטרי החיפוש או הוסף נכס חדש</p>
            {(userRole === 'admin' || userRole === 'manager') && (
              <button 
                className="btn btn-primary"
                onClick={handleAddAsset}
              >
                <i className="bi bi-plus-circle me-2"></i>
                הוסף נכס ראשון
              </button>
            )}
          </div>
        ) : (
          <div className={`assets-${viewMode}`}>
            {viewMode === 'grid' ? (
              <div className="assets-grid">
                {filteredAssets.map(asset => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onEdit={handleEditAsset}
                    onDelete={handleDeleteAsset}
                    userRole={userRole}
                  />
                ))}
              </div>
            ) : (
              <div className="assets-table-container">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>שם הנכס</th>
                      <th>עיר</th>
                      <th>כתובת</th>
                      <th>סטטוס</th>
                      <th>שכירות חודשית</th>
                      <th>בעל הנכס</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map(asset => (
                      <tr key={asset.id}>
                        <td>
                          <strong>{asset.name}</strong>
                        </td>
                        <td>{asset.city}</td>
                        <td>{asset.address}</td>
                        <td>{getStatusBadge(asset.status)}</td>
                        <td>₪{asset.lease?.monthly_rent?.toLocaleString()}</td>
                        <td>{asset.landlord?.name}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditAsset(asset)}
                              title="ערוך"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {userRole === 'admin' && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteAsset(asset.id)}
                                title="מחק"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* טופס הוספה/עריכה */}
      {showForm && (
        <AssetForm
          asset={editingAsset}
          onSave={handleSaveAsset}
          onCancel={() => {
            setShowForm(false);
            setEditingAsset(null);
          }}
        />
      )}
    </div>
  );
};

export default AssetsManagement;