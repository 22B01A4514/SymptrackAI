import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import SymptomPredictor from './components/SymptomPredictor.jsx';
import PatientVlogs from './components/PatientVlogs.jsx';
import CommunityAlerts from './components/CommunityAlerts.jsx';
import Profile from './components/Profile.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return user ? <Navigate to="/dashboard" /> : children;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/predict" element={<ProtectedRoute><SymptomPredictor /></ProtectedRoute>} />
            <Route path="/vlogs" element={<ProtectedRoute><PatientVlogs /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><CommunityAlerts /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
