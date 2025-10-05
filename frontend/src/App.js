import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import ProtectedRoute from './utils/ProtectedRoute';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CashRequestsPage from './pages/CashRequestsPage';
import NewCashRequestPage from './pages/NewCashRequestPage';
import ExpensesPage from './pages/ExpensesPage';
import NewExpensePage from './pages/NewExpensePage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/cash-requests"
              element={
                <ProtectedRoute>
                  <CashRequestsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/cash-requests/new"
              element={
                <ProtectedRoute>
                  <NewCashRequestPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/expenses"
              element={
                <ProtectedRoute>
                  <ExpensesPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/expenses/new"
              element={
                <ProtectedRoute>
                  <NewExpensePage />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;