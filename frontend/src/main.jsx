import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { apiGet } from './api';

function Main() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchMessage() {
            try {
                const response = await apiGet('/');
                setMessage(response.message || 'Server responded!');
            } catch (error) {
                console.error('Error fetching message:', error.message);
                setMessage('Failed to load message');
            }
        }

        fetchMessage();
    }, []);

    return (
        <StrictMode>
            <App />
            <p style={{ textAlign: 'center', marginTop: '20px' }}>{message}</p>
        </StrictMode>
    );
}

createRoot(document.getElementById('root')).render(
    <Main />
);
