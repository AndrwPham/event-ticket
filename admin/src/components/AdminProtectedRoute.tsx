import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading authentication…</div>;
    }

    if (user?.roles.includes('Admin')) {
        return <Outlet />;
    }

    return <Navigate to="/login" replace />;
};
