import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/layout/Header';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Router>
        <AuthProvider>
          <TaskProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #475569',
                },
                success: {
                  style: {
                    background: '#064e3b',
                    color: '#d1fae5',
                    border: '1px solid #047857',
                  },
                },
                error: {
                  style: {
                    background: '#7f1d1d',
                    color: '#fecaca',
                    border: '1px solid #dc2626',
                  },
                },
              }}
            />
            <div className="relative min-h-screen">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <main className="relative z-10">
                        <Dashboard />
                      </main>
                    </>
                  </ProtectedRoute>
                } />
                <Route path="/tasks" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <main className="relative z-10">
                        <TaskList />
                      </main>
                    </>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </TaskProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
