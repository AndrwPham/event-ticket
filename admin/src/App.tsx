import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import { AdminLoginPage } from './pages/Login';
import { AdminDashboardPage } from './pages/Dashboard';
import { EventValidationPage } from './pages/EventsValidate';

import { AdminLayout } from './components/AdminLayout';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<AdminLoginPage />} />

            <Route element={<AdminProtectedRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/validate-events" element={<EventValidationPage />} />
                </Route>
            </Route>

            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;