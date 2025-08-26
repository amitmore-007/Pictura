import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Layout/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import FolderPage from './pages/FolderPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LoadingSpinner from './components/UI/LoadingSpinner.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-950">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/folder/:id"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <FolderPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgb(255, 255, 255)',
            color: 'rgb(17, 24, 39)',
            borderRadius: '12px',
            border: '1px solid rgb(229, 231, 235)',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            style: {
              background: 'rgb(240, 253, 244)',
              color: 'rgb(22, 163, 74)',
              border: '1px solid rgb(187, 247, 208)',
            },
            iconTheme: {
              primary: 'rgb(22, 163, 74)',
              secondary: 'rgb(240, 253, 244)',
            },
          },
          error: {
            style: {
              background: 'rgb(254, 242, 242)',
              color: 'rgb(220, 38, 38)',
              border: '1px solid rgb(254, 202, 202)',
            },
            iconTheme: {
              primary: 'rgb(220, 38, 38)',
              secondary: 'rgb(254, 242, 242)',
            },
          },
        }}
      />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-dark-950 transition-colors duration-300">
            <AppContent />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
