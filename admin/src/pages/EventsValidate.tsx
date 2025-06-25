import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Event {
    id: string;
    title: string;
    description: string;
    organization: {
        name: string;
    };
}

export const EventValidationPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const { token } = useAuth();

    const fetchPendingEvents = async () => {
        const response = await fetch('/api/admin/events/pending', {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
            setEvents(await response.json());
        } else {
            console.error("Failed to fetch pending events");
        }
    };

    useEffect(() => {
        if (token) {
            fetchPendingEvents();
        }
    }, [token]);

    const handleValidate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        await fetch(`/api/admin/events/${id}/validate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ status }),
        });
        fetchPendingEvents(); // Refresh
    };

    const cardStyle: React.CSSProperties = {
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        backgroundColor: '#fff'
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px 16px',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: 'pointer',
        border: 'none',
        fontSize: '14px'
    };

    const approveStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#10b981',
        color: 'white',
        marginRight: '10px',
    };

    const rejectStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#ef4444',
        color: 'white',
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ fontSize: '28px', marginBottom: '30px', color: '#111827' }}>Validate Events</h1>
            {events.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No events are currently awaiting validation.</p>
            ) : (
                events.map((event) => (
                    <div key={event.id} style={cardStyle}>
                        <h2 style={{ fontSize: '20px', color: '#1f2937', marginBottom: '8px' }}>{event.title}</h2>
                        <p style={{ color: '#4b5563', marginBottom: '4px' }}><strong>By:</strong> {event.organization.name}</p>
                        <p style={{ color: '#374151' }}>{event.description}</p>
                        <div style={{ marginTop: '16px' }}>
                            <button style={approveStyle} onClick={() => handleValidate(event.id, 'APPROVED')}>Approve</button>
                            <button style={rejectStyle} onClick={() => handleValidate(event.id, 'REJECTED')}>Reject</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
