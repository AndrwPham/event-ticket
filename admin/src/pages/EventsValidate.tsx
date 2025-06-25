// src/pages/admin/EventValidationPage.tsx
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface PendingEvent {
    id: string;
    title: string;
    description: string;
    organization: { name: string };
}

type Status = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

export const EventValidationPage = () => {
    const { loading: authLoading } = useAuth();
    const [events, setEvents] = useState<PendingEvent[]>([]);
    const [status, setStatus] = useState<Status>('IDLE');
    const [error, setError] = useState<string | null>(null);

    const API_BASE = 'http://localhost:5000'; // Adjust if needed

    const fetchPendingEvents = useCallback(async () => {
        setStatus('LOADING');
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/admin/events/pending`, {
                credentials: 'include',
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Failed to fetch events: ${res.status} ${txt}`);
            }
            const data = await res.json();
            setEvents(data);
            setStatus('SUCCESS');
        } catch (err: any) {
            console.error('[EventValidationPage] Fetch error:', err);
            setError(err.message);
            setStatus('ERROR');
        }
    }, []);

    useEffect(() => {
        if (!authLoading) {
            fetchPendingEvents();
        }
    }, [authLoading, fetchPendingEvents]);

    const handleValidate = async (id: string, validationStatus: 'APPROVED' | 'REJECTED') => {
        try {
            const res = await fetch(`${API_BASE}/admin/events/${id}/validate`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: validationStatus }),
            });
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Validation failed: ${res.status} ${txt}`);
            }
            fetchPendingEvents();
        } catch (err: any) {
            console.error('[EventValidationPage] Validation error:', err);
            setError(err.message);
        }
    };

    if (authLoading || status === 'LOADING') {
        return <div>Loading...</div>;
    }

    if (status === 'ERROR') {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    // Main container now has a black background and white text
    return (
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px', backgroundColor: '#000', color: '#fff' }}>
            <h1 style={{ fontSize: 28, marginBottom: 30, color: '#fff' }}>Validate Events</h1>
            {events.length === 0 ? (
                <p>No events are currently awaiting validation.</p>
            ) : (
                events.map(evt => (
                    // Event card has a dark grey background to stand out
                    <div key={evt.id} style={{
                        backgroundColor: '#1a1a1a',
                        border: '1px solid #444',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 20,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <h2 style={{ marginBottom: 8, color: '#fff' }}>{evt.title}</h2>
                        <p style={{ color: '#ccc' }}><strong>By:</strong> {evt.organization.name}</p>
                        <p style={{ color: '#ccc' }}>{evt.description}</p>
                        <div style={{ marginTop: 16 }}>
                            <button
                                onClick={() => handleValidate(evt.id, 'APPROVED')}
                                style={{ marginRight: 10, padding: '10px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleValidate(evt.id, 'REJECTED')}
                                style={{ padding: '10px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};