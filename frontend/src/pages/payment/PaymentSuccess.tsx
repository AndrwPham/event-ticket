import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderReceipt from '../../components/OrderReceipt'; // Import the receipt component
import { FullOrder } from '../../types'; // We'll define this type next


const api = {
    get: async (url: string) => {
        const response = await fetch(`http://localhost:5000${url}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }
};

const PaymentSuccessPage: FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState<FullOrder | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) {
            setError("Order ID not found in URL.");
            setIsLoading(false);
            return;
        }

        const POLLING_INTERVAL = 2000;
        const MAX_ATTEMPTS = 15;
        let attempts = 0;
        let intervalId: number;

        const checkStatus = async () => {
            attempts++;
            try {
                const data = await api.get(`/orders/${orderId}`) as FullOrder;

                if (data.status === 'PAID') {
                    setOrderData(data);
                    setIsLoading(false);
                    clearInterval(intervalId);
                } else if (attempts >= MAX_ATTEMPTS) {
                    setError("Payment confirmation is taking longer than expected. Please check your email for a receipt.");
                    setIsLoading(false);
                    clearInterval(intervalId);
                }
            } catch (err) {
                setError("An error occurred while checking your order status.");
                setIsLoading(false);
                clearInterval(intervalId);
            }
        };

        intervalId = window.setInterval(() => { void checkStatus(); }, POLLING_INTERVAL);
        void checkStatus();

        return () => clearInterval(intervalId);
    }, [orderId]);

    if (isLoading) {
        return (
            <div className="text-center p-10">
                <h2 className="text-2xl font-bold">Processing Your Payment...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-10 text-red-600">
                <h2 className="text-2xl font-bold">Error</h2>
                <p className="mt-2">{error}</p>
            </div>
        );
    }

    return orderData ? <OrderReceipt order={orderData} /> : null;
};

export default PaymentSuccessPage;