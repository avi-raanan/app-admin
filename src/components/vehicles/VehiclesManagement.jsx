// נתיב: client/src/components/vehicles/VehiclesManagement.jsx
import React, { useState, useEffect } from 'react';
import VehicleCard from './VehicleCard';
import VehicleForm from './VehicleForm';
import VehicleFilters from './VehicleFilters';
import './VehiclesManagement.scss';

const VehiclesManagement = ({ userRole }) => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    driver: 'all',
    branch: 'all',
    expiringSoon: false
  });
  const [viewMode, setViewMode] = useState('grid');

  // דמוי נתונים - בהמשך יוחלף בקריאה לשרת
  const mockVehicles = [
    {
      id: 1,
      license_number: '123-45-678',
      model: 'טויוטה קורולה 2022',
      color: 'לבן',
      license_expiry: '2024-12-15',
      maintenance_end: '2024-11-30',
      purchase_date: '2022-03-15',
      kms: '45,000',
      key_count: 2,
      notes: 'רכב חדש יחסית',
      driver: {
        name: 'יוסי כהן',
        start_date: '2023-01-01',
        end_date: null
      },
      insurance: {
        company: 'מנורה מבטחים',
        amount: 15000,
        type: 'מלא',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
      },
      maintenance_history: [
        {
          type: 'טיפול תקופתי',
          date: '2024-06-15',
          description: 'החלפת שמן ומסננים',
          cost: 450
        },
        {
          type: 'תיקון',
          date: '2024-05-10',
          description: 'החלפת צמיגים קדמיים',
          cost: 800
        }
      ],
      status: 'active',
      branch_id: 1,
      branch_name: 'סניף מרכז'
    },
    {
      id: 2,
      license_number: '987-65-432',
      model: 'יונדאי i30 2021',
      color: 'כחול',
      license_expiry: '2024-08-20',
      maintenance_end: '2024-12-20',
      purchase_date: '2021-07-10',
      kms: '62,000',
      key_count: 1,
      notes: 'חסר מפתח אחד',
      driver: {
        name: 'שרה לוי',
        start_date: '2022-08-01',
        end_date: null
      },
      insurance: {
        company: 'הפניקס',
        amount: 12000,
        type: 'חובה פלוס',
        start_date: '2024-03-01',
        end_date: '2025-02-28'
      },
      maintenance_history: [
        {
          type: 'טיפול תקופתי',
          date: '2024-04-20',
          description: 'בדיקת מערכת בלמים',
          cost: 350
        }
      ],
      status: 'maintenance',
      branch_id: 2,
      branch_name: 'סניף צפון'
    },
    {
      id: 3,
      license_number: '555-44-333',
      model: 'מאזדה CX-5 2020',
      color: 'אדום',
      license_expiry: '2025-03-10',
      maintenance_end: '2024-10-15',
      purchase_date: '2020-05-20',
      kms: '78,500',
      key_count: 2,
      notes: 'רכב במצב מעולה',
      driver: null,
      insurance: {
        company: 'כלל ביטוח',
        amount: 18000,
        type: 'מלא',
        start_date: '2024-02-01',
        end_date: '2025-01-31'
      },
      maintenance_history: [],
      status: 'available',
      branch_id: 1,
      branch_name: 'סניף מרכז'
    }
  ];

  useEffect(() => {
    // טעינת רכבים - בהמשך יוחלף בקריאה לשרת
    setTimeout(() => {
      setVehicles(mockVehicles);
      setFilteredVehicles(mockVehicles);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // סינון רכבים
    let filtered = vehicles.filter(vehicle => {
      const matchesSearch = 
        vehicle.license_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || vehicle.status === filters.status;
      const matchesDriver = filters.driver === 'all' || 
        (filters.driver === 'assigned' && vehicle.driver) ||
        (filters.driver === 'unassigned' && !vehicle.driver);
      const matchesBranch = filters.branch === 'all' || vehicle.branch_id.toString() === filters.branch;

      let matchesExpiring = true;
      if (filters.expiringSoon) {
        const today = new Date();
        const licenseExpiry = new Date(vehicle.license_expiry);
        const insuranceExpiry = new Date(vehicle.insurance.end_date);
        const daysUntilLicense = Math.ceil((licenseExpiry - today) / (1000 * 60 * 60 * 24));
        const daysUntilInsurance = Math.ceil((insuranceExpiry - today) / (1000 * 60 * 60 * 24));
        matchesExpiring = daysUntilLicense <= 90 || daysUntilInsurance <= 90;
      }

      return matchesSearch && matchesStatus && matchesDriver && matchesBranch && matchesExpiring;
    });

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, filters]);

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowForm(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הרכב?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
    }
  };

  const handleSaveVehicle = (vehicleData) => {
    if (editingVehicle) {
      setVehicles(vehicles.map(vehicle => 
        vehicle.id === editingVehicle.id ? { ...vehicle, ...vehicleData } : vehicle
      ));
    } else {
      const newVehicle = {
        ...vehicleData,
        id: Date.now(),
        maintenance_history: [],
        status: 'active'
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  const getStatusStats = () => {
    return {
      total: vehicles.length,
      active: vehicles.filter(v => v.status === 'active').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      available: vehicles.filter(v => v.status === 'available').length,
      expiringSoon: vehicles.filter(v => {
        const today = new Date();
        const licenseExpiry = new Date(v.license_expiry);
        const insuranceExpiry = new Date(v.insurance.end_date);
        const daysUntilLicense = Math.ceil((licenseExpiry - today) / (1000 * 60 * 60 * 24));
        const daysUntilInsurance = Math.ceil((insuranceExpiry - today) / (1000 * 60 * 60 * 24));
        return daysUntilLicense <= 90 || daysUntilInsurance <= 90;
      }).length
    };
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="vehicles-loading">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">טוען...</span>
          </div>
        </div>
        <h4>טוען רכבים...</h4>
      </div>
    );
  }

  return (
    <div className="vehicles-management">
      <div className="vehicles-header">
        <div className="header-content">
          <h1 className="page-title">
            <i className="bi bi-truck me-3"></i>
            ניהול רכבים
          </h1>
          <p className="page-subtitle">
            ניהול וארגון צי הרכבים של הארגון
          </p>
        </div>
        
        {(userRole === 'admin' || userRole === 'manager') && (
          <div className="header-actions">
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleAddVehicle}
            >
              <i className="bi bi-plus-circle me-2"></i>
              הוסף רכב חדש
            </button>
          </div>
        )}
      </div>

      {/* סטטיסטיקות מהירות */}
      <div className="vehicles-stats">
        <div className="stat-item">
          <div className="stat-icon bg-primary">
            <i className="bi bi-truck"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>סה"כ רכבים</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-success">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>רכבים פעילים</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-warning">
            <i className="bi bi-tools"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.maintenance}</h3>
            <p>בתחזוקה</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-info">
            <i className="bi bi-car-front"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.available}</h3>
            <p>זמינים להקצאה</p>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon bg-danger">
            <i className="bi bi-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{stats.expiringSoon}</h3>
            <p>טעונים התראה</p>
          </div>
        </div>
      </div>

      {/* סינון וחיפוש */}
      <VehicleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        vehiclesCount={filteredVehicles.length}
      />

      {/* רשימת רכבים */}
      <div className="vehicles-content">
        {filteredVehicles.length === 0 ? (
          <div className="no-vehicles">
            <div className="no-vehicles-icon">
              <i className="bi bi-truck-front-fill"></i>
            </div>
            <h3>לא נמצאו רכבים</h3>
            <p>נסה לשנות את פרמטרי החיפוש או הוסף רכב חדש</p>
            {(userRole === 'admin' || userRole === 'manager') && (
              <button 
                className="btn btn-primary"
                onClick={handleAddVehicle}
              >
                <i className="bi bi-plus-circle me-2"></i>
                הוסף רכב ראשון
              </button>
            )}
          </div>
        ) : (
          <div className={`vehicles-${viewMode}`}>
            {viewMode === 'grid' ? (
              <div className="vehicles-grid">
                {filteredVehicles.map(vehicle => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onEdit={handleEditVehicle}
                    onDelete={handleDeleteVehicle}
                    userRole={userRole}
                  />
                ))}
              </div>
            ) : (
              <div className="vehicles-table-container">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>מספר רישוי</th>
                      <th>דגם</th>
                      <th>נהג</th>
                      <th>סטטוס</th>
                      <th>תוקף רישיון</th>
                      <th>תוקף ביטוח</th>
                      <th>ק"מ</th>
                      <th>פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map(vehicle => (
                      <tr key={vehicle.id}>
                        <td>
                          <strong>{vehicle.license_number}</strong>
                        </td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.driver?.name || 'לא משויך'}</td>
                        <td>
                          <span className={`badge ${
                            vehicle.status === 'active' ? 'bg-success' :
                            vehicle.status === 'maintenance' ? 'bg-warning' :
                            'bg-info'
                          }`}>
                            {vehicle.status === 'active' ? 'פעיל' :
                             vehicle.status === 'maintenance' ? 'בתחזוקה' :
                             'זמין'}
                          </span>
                        </td>
                        <td>
                          {new Date(vehicle.license_expiry).toLocaleDateString('he-IL')}
                        </td>
                        <td>
                          {new Date(vehicle.insurance.end_date).toLocaleDateString('he-IL')}
                        </td>
                        <td>{vehicle.kms}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditVehicle(vehicle)}
                              title="ערוך"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {userRole === 'admin' && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteVehicle(vehicle.id)}
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
        <VehicleForm
          vehicle={editingVehicle}
          onSave={handleSaveVehicle}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default VehiclesManagement;