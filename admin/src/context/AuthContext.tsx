import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedJwtPayload {
    sub: string;
    username: string;
    roles: string[];
    iat: number;
    exp: number;
}

interface User {
    id: string;
    username: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromToken = (token: string): User | null => {
    try {
        const decoded = jwtDecode<DecodedJwtPayload>(token);
        // Based on your new schema, username is not in the token payload by default
        // 'sub' is the userId, and roles are included. We can fetch username later if needed.
        return { id: decoded.sub, username: 'Admin', roles: decoded.roles || [] };
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));

    useEffect(() => {
        if (token) {
            const userData = getUserFromToken(token);
            if (userData && userData.roles.includes('Admin')) {
                setUser(userData);
            } else {
                logout();
            }
        }
    }, [token]);

    const login = async (username: string, password: string) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                password,
                activeRole: 'Admin',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const data = await response.json();

        // **FIX:** Access the token from the nested 'tokens' object
        const accessToken = data.tokens.accessToken;

        if (!accessToken) {
            throw new Error("Login successful, but no access token received from server.");
        }

        const loggedInUser = getUserFromToken(accessToken);

        if (!loggedInUser || !loggedInUser.roles.includes('Admin')) {
            throw new Error('User is not an administrator.');
        }

        localStorage.setItem('adminToken', accessToken);
        setToken(accessToken);
        setUser(loggedInUser);
        return loggedInUser;
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};