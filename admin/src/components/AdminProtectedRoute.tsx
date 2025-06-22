import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminProtectedRoute = () => {
    const { user, token } = useAuth();

    // If there's no token, we are still loading or logged out
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If we have a user object and they are an admin, allow access
    if (user && user.roles.includes('Admin')) {
        return <Outlet />;
    }

    // If token exists but user is not admin (or user is null during async check),
    // they should be sent back to login. The `replace` prop is important.
    if(!user){
        // You can optionally show a loading spinner here while auth state is being determined
        return <div>Loading user authentication...</div>;
    }

    return <Navigate to="/login" replace />;
};