import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { TrackSelection } from './components/TrackSelection';
import { Interview } from './components/Interview';
import { Feedback } from './components/Feedback';
import { History } from './components/History';
import { AdminPanel } from './components/Admin/AdminPanel';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002366] to-[#001744]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#002366] to-[#001744]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return currentUser ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/track/:industryId" element={
        <ProtectedRoute>
          <TrackSelection />
        </ProtectedRoute>
      } />
      
      <Route path="/interview/:industryId/:track" element={
        <ProtectedRoute>
          <Interview />
        </ProtectedRoute>
      } />
      
      <Route path="/feedback" element={
        <ProtectedRoute>
          <Feedback />
        </ProtectedRoute>
      } />
      
      <Route path="/history" element={
        <ProtectedRoute>
          <History />
        </ProtectedRoute>
      } />
      
      <Route path="/admin-verbalyst-portal" element={
        <ProtectedRoute>
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
