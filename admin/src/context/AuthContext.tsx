
import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from 'react';

interface User {
    id: string;
    username: string;
    roles: string[];
    activeRole: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credential: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { throw new Error('AuthContext not initialized'); },
    logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // On mount: check “who am I?” via cookie
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('http://localhost:5000/auth/me', {
                    credentials: 'include',
                });
                if (!res.ok) {
                    const text = await res.text();
                    console.warn('[AuthContext] /auth/me failed:', res.status, text);
                    setUser(null);
                } else {
                    const data = await res.json();
                    console.log('[AuthContext] /auth/me success:', data);
                    setUser(data.user);
                }
            } catch (err) {
                console.error('[AuthContext] /auth/me error:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (credential: string, password: string) => {
        console.log('[AuthContext] attempting login with →', { credential, password });
        try {
            const res = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ credential, password, activeRole: 'Admin' }),
            });

            if (!res.ok) {
                const body = await res.text();
                console.error('[AuthContext] login failed:', res.status, body);
                throw new Error(`Login failed: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            console.log('[AuthContext] login success:', data);

            if (!data.user) {
                console.error('[AuthContext] login response missing user:', data);
                throw new Error('Login succeeded but no user returned');
            }

            setUser(data.user);
            return data.user;
        } catch (err: any) {
            console.error('[AuthContext] login error:', err);
            throw err;
        }
    };

    const logout = async () => {
        console.log('[AuthContext] attempting logout');
        try {
            const res = await fetch('http://localhost:5000/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('[AuthContext] logout failed:', res.status, text);
            } else {
                console.log('[AuthContext] logout success');
            }
        } catch (err) {
            console.error('[AuthContext] logout error:', err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
