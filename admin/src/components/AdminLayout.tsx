import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const sidebarStyle: React.CSSProperties = {
        width: '220px',
        padding: '20px',
        backgroundColor: '#f9fafb',
        height: '100vh',
        borderRight: '1px solid #e5e7eb',
        boxSizing: 'border-box'
    };

    const navItemStyle: React.CSSProperties = {
        marginBottom: '15px',
    };

    const linkStyle: React.CSSProperties = {
        textDecoration: 'none',
        color: '#111827',
        fontWeight: 500,
        display: 'block',
        padding: '8px 12px',
        borderRadius: '6px',
        transition: 'background 0.2s ease-in-out',
    };

    const linkHoverStyle: React.CSSProperties = {
        backgroundColor: '#e5e7eb',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'background 0.2s ease-in-out',
    };

    const buttonHoverStyle: React.CSSProperties = {
        backgroundColor: '#dc2626',
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: '#ffffff' }}>
            <aside style={sidebarStyle}>
                <h2 style={{ marginBottom: '30px', color: '#1f2937' }}>Admin Panel</h2>
                <nav>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={navItemStyle}>
                            <Link to="/dashboard" style={linkStyle} onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}>
                                Dashboard
                            </Link>
                        </li>
                        <li style={navItemStyle}>
                            <Link to="/validate-events" style={linkStyle} onMouseOver={e => Object.assign(e.currentTarget.style, linkHoverStyle)} onMouseOut={e => Object.assign(e.currentTarget.style, linkStyle)}>
                                Validate Events
                            </Link>
                        </li>
                        <li>
                            <button
                                style={buttonStyle}
                                onMouseOver={e => Object.assign(e.currentTarget.style, buttonHoverStyle)}
                                onMouseOut={e => Object.assign(e.currentTarget.style, buttonStyle)}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: '20px'}}>
                <Outlet />
            </main>
        </div>
    );
};
