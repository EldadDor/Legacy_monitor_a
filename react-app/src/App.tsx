// Update to /react-app/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContextProvider';
import Login from './components/login/LoginComponent';
import Dashboard from './components/dashboard/DashboardComponent';
import Sidebar from './components/sidebar/SidebarComponent';
import Toolbar from './components/toolbar/ToolbarComponent';
import './App.css';

// Protected route component to handle authentication
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <>
            <Sidebar />
            <div className="main-content">
                <Toolbar />
                {element}
            </div>
        </>
    );
};

// Main App component with AuthProvider
const App: React.FC = () => {
    return (
        <AuthProvider>
            <div className="app-container">
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute element={<Dashboard />} />
                        } />
                        {/* Add other protected routes here */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
            </div>
        </AuthProvider>
    );
};

export default App;