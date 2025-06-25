import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
    pendingEvents: number;
    approvedEvents: number;
    userCount: number;
}

export const AdminDashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchStats = async () => {
            const response = await fetch('/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            } else {
                console.error("Failed to fetch dashboard stats");
            }
        };
        if(token) {
            fetchStats();
        }
    }, [token]);

    if (!stats) return <div>Loading dashboard...</div>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Pending Events for Validation: {stats.pendingEvents}</p>
            <p>Total Approved Events: {stats.approvedEvents}</p>
            <p>Total Users: {stats.userCount}</p>
        </div>
    );
};