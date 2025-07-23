// נתיב: client/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// רכיבי אימות
import Login from './components/auth/Login';

// רכיבי לייאאוט
import MainLayout from './components/common/Layout/MainLayout';

// רכיבים כלליים
import UnderDevelopment from './components/common/UnderDevelopment/UnderDevelopment';
import ErrorPage from './components/common/ErrorPage/ErrorPage';

// דשבורד
import Dashboard from './components/dashboards/Dashboard';

// רכיבי ניהול נכסים
import AssetsManagement from './components/assets/AssetsManagement';

// רכיבי ניהול רכבים
import VehiclesManagement from './components/vehicles/VehiclesManagement';

// סגנונות גלובליים
import './styles/globals/app.scss';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // בדיקה אם יש משתמש מחובר (לדוגמה מ-localStorage)
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // בדיקה שהמשתמש תקין
          if (parsedUser && parsedUser.id && parsedUser.role) {
            setUser(parsedUser);
          } else {
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    // דמוי טעינה ראשונית
    setTimeout(() => {
      checkAuthStatus();
    }, 500);
  }, []);

  const handleLogin = (userData) => {
    try {
      // וידוא שהנתונים תקינים
      if (!userData || !userData.id || !userData.role) {
        throw new Error('Invalid user data');
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // ניתן להוסיף כאן קריאה לשרת לביטול ה-token
  };

  // רכיב עמוד בפיתוח
  const DevelopmentPage = ({ title, description }) => (
    <UnderDevelopment title={title} description={description} />
  );

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <h3>טוען את המערכת...</h3>
          <p>אנא המתן בזמן שאנו מכינים הכל עבורך</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <MainLayout user={user} onLogout={handleLogout}>
            <Routes>
              {/* נתיב ברירת מחדל - דשבורד */}
              <Route 
                path="/dashboard" 
                element={<Dashboard userRole={user.role} />} 
              />
              
              {/* פרופיל אישי - זמין לכולם */}
              <Route 
                path="/profile" 
                element={
                  <DevelopmentPage 
                    title="פרופיל אישי" 
                    description="עריכת פרטים אישיים והגדרות חשבון"
                  />
                } 
              />
              
              {/* נתיבים למנהל ראשי בלבד */}
              {user.role === 'admin' && (
                <>
                  <Route 
                    path="/assets" 
                    element={<AssetsManagement userRole={user.role} />} 
                  />
                  <Route 
                    path="/vehicles" 
                    element={<VehiclesManagement userRole={user.role} />} 
                  />
                  <Route 
                    path="/users" 
                    element={
                      <DevelopmentPage 
                        title="ניהול משתמשים" 
                        description="הוספה, עריכה וניהול משתמשי המערכת"
                      />
                    } 
                  />
                  <Route 
                    path="/branches" 
                    element={
                      <DevelopmentPage 
                        title="ניהול סניפים" 
                        description="ניהול סניפי הארגון ומיקומים"
                      />
                    } 
                  />
                  <Route 
                    path="/documents" 
                    element={
                      <DevelopmentPage 
                        title="ניהול מסמכים" 
                        description="ארגון וניהול מסמכי הארגון"
                      />
                    } 
                  />
                  <Route 
                    path="/reports" 
                    element={
                      <DevelopmentPage 
                        title="דוחות מערכת" 
                        description="דוחות כלליים ואנליטיקה מתקדמת"
                      />
                    } 
                  />
                  <Route 
                    path="/settings" 
                    element={
                      <DevelopmentPage 
                        title="הגדרות מערכת" 
                        description="הגדרות כלליות וקונפיגורציה"
                      />
                    } 
                  />
                </>
              )}

              {/* נתיבים למנהל סניף */}
              {user.role === 'manager' && (
                <>
                  <Route 
                    path="/branch-assets" 
                    element={<AssetsManagement userRole={user.role} />} 
                  />
                  <Route 
                    path="/branch-vehicles" 
                    element={<VehiclesManagement userRole={user.role} />} 
                  />
                  <Route 
                    path="/branch-employees" 
                    element={
                      <DevelopmentPage 
                        title="עובדי הסניף" 
                        description="ניהול עובדי הסניף והקצאות"
                      />
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <DevelopmentPage 
                        title="ניהול משימות" 
                        description="יצירה והקצאת משימות לעובדים"
                      />
                    } 
                  />
                  <Route 
                    path="/branch-documents" 
                    element={
                      <DevelopmentPage 
                        title="מסמכי הסניף" 
                        description="ניהול מסמכים ברמת הסניף"
                      />
                    } 
                  />
                  <Route 
                    path="/branch-reports" 
                    element={
                      <DevelopmentPage 
                        title="דוחות הסניף" 
                        description="דוחות וסטטיסטיקות ברמת הסניף"
                      />
                    } 
                  />
                </>
              )}

              {/* נתיבים לעובד */}
              {user.role === 'employee' && (
                <>
                  <Route 
                    path="/my-tasks" 
                    element={
                      <DevelopmentPage 
                        title="המשימות שלי" 
                        description="צפייה ועדכון משימות אישיות"
                      />
                    } 
                  />
                  <Route 
                    path="/my-vehicle" 
                    element={
                      <DevelopmentPage 
                        title="הרכב שלי" 
                        description="פרטי הרכב המשויך ומעקב שימוש"
                      />
                    } 
                  />
                  <Route 
                    path="/my-equipment" 
                    element={
                      <DevelopmentPage 
                        title="הציוד שלי" 
                        description="ציוד שהוקצה ומעקב מצב"
                      />
                    } 
                  />
                  <Route 
                    path="/report-issue" 
                    element={
                      <DevelopmentPage 
                        title="דיווח תקלות" 
                        description="דיווח על תקלות בנכסים או ציוד"
                      />
                    } 
                  />
                </>
              )}

              {/* נתיבי ברירת מחדל */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* עמוד שגיאה 404 */}
              <Route 
                path="*" 
                element={
                  <ErrorPage 
                    errorCode="404"
                    title="עמוד לא נמצא"
                    description="העמוד שביקשת לא קיים במערכת"
                    showBackButton={true}
                  />
                } 
              />
            </Routes>
          </MainLayout>
        )}
      </div>
    </Router>
  );
}

export default App;