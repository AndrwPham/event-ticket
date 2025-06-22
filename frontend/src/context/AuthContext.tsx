import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { User } from "../types";

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // We will eventually need a backend endpoint like '/auth/profile' to verify the cookie
                // For now, this fetch will fail, and the user will correctly be logged out.
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/auth/profile`,
                    {},
                );

                if (response.ok) {
                    const userData = (await response.json()) as User;
                    login(userData);
                } else {
                    logout();
                }
            } catch (error) {
                console.error("Failed to check auth status:", error);
                logout();
            }
        };

        void checkAuthStatus();
    }, []);

    const login = (userData: User) => {
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = () => {
        // We also need a backend endpoint for logout to clear the cookie
        void fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: "POST",
        });
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = { isAuthenticated, user, login, logout };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
