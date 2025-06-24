import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePayOS, PayOSConfig } from "@payos/payos-checkout";
import CountdownTimer from "./components/CountdownTimer";
import OrderSummary from "./components/OrderSummary";
import { Event, Order, OrderDetails } from "../../types";

// An interface for the data expected from the previous page
interface PaymentLocationState {
    order: Order & {
        paymentLink: {
            checkoutUrl: string;
            qrCode: string;
        };
    };
    eventDetails: Event;
    orderDetails: OrderDetails;
}

const PaymentPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Safely destructure state, providing a fallback to prevent runtime errors
    const state = location.state as PaymentLocationState | null;
    const { order, eventDetails, orderDetails } = state || {};
    const checkoutUrl = order?.paymentLink?.checkoutUrl;

    const [error, setError] = useState<string | null>(null);

    // Configure the PayOS hook with all required properties.
    const { open, exit } = usePayOS({
        CHECKOUT_URL: checkoutUrl || '',
        ELEMENT_ID: "payos-container",
        embedded: true,
        // --- FIX: Added the missing RETURN_URL and CANCEL_URL properties ---
        // These are required by the PayOS library, even in embedded mode.
        RETURN_URL: `http://localhost:5173/payment/success`,
        CANCEL_URL: `http://localhost:5173/payment/cancel`,
        // --- End of Fix ---
        onExit: () => {
            if (eventDetails?.id) {
                navigate(`/events/${String(eventDetails.id)}`);
            } else {
                navigate('/');
            }
        },
        onSuccess: () => {
            navigate(`/payment/success`);
        },
        onCancel: () => {
            if (eventDetails?.id) {
                navigate(`/events/${String(eventDetails.id)}`);
            } else {
                navigate('/');
            }
        }
    } as PayOSConfig);

    useEffect(() => {
        if (checkoutUrl) {
            open();
        } else if (!state) {
            setError("Payment information is missing or the session has expired. Please try again.");
        }

        return () => {
            exit();
        };
    }, [checkoutUrl, state, open, exit]);


    // Handle the case where essential data is missing
    if (!order || !eventDetails || !orderDetails) {
        return (
            <div className="text-gray-800 text-center py-20 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">Your session has expired.</h1>
                <p className="mt-2 text-gray-600">
                    Please select tickets for an event to proceed.
                </p>
                <a
                    href="/"
                    className="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700"
                >
                    Explore Events
                </a>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-100 py-8 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <CountdownTimer
                        initialSeconds={900}
                        onTimerEnd={() => {
                            if(eventDetails?.id) {
                                navigate(`/events/${String(eventDetails.id)}`);
                            }
                        }}
                    />
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Complete Your Payment
                        </h2>
                        <div id="payos-container" className="w-full h-[500px]">
                            {/* The PayOS UI will be injected here. */}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <OrderSummary
                        eventDetails={eventDetails}
                        orderDetails={orderDetails}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
