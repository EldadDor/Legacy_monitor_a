
// Update to /react-app/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContextProvider';
import { ThemeProvider } from './contexts/ThemeContextProvider';
import Login from './components/login/LoginComponent';
import CentralControl from './components/central/ControlCenter';
import Dashboard from './components/dashboard/Dashboard';
import Sidebar from './components/sidebar/SidebarComponent';
import Toolbar from './components/toolbar/ToolbarComponent';
import './App.css';
import './styles/themes/default.css';
import './styles/themes/dark-red.css';
import './styles/themes/light.css';

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

// Main App component with both AuthProvider and ThemeProvider
const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <div className="app-container">
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={
                                <ProtectedRoute element={<Dashboard />} />
                            } />
                            <Route path="/central" element={
                                <ProtectedRoute element={<CentralControl />} />
                            } />
                            {/* Add other protected routes here */}
                            <Route path="/" element={<Navigate to="/central" replace />} />
                            <Route path="*" element={<Navigate to="/central" replace />} />
                        </Routes>
                    </Router>
                </div>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;