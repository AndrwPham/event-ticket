import { FC, useEffect, useState, useRef } from "react";
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
    const state = location.state as PaymentLocationState | null;
    const { order, eventDetails, orderDetails } = state || {};
    const checkoutUrl = order?.paymentLink.checkoutUrl;
    const qrCode = order?.paymentLink.qrCode;
    const iframeOpenedRef = useRef(false);

    const [error, setError] = useState<string | null>(null);

    // Console logs for debugging
    useEffect(() => {
        console.log("PaymentPage mounted");
        console.log("State:", state);
        console.log("checkoutUrl:", checkoutUrl);
        console.log("qrCode:", qrCode);
    }, [state, checkoutUrl, qrCode]);

    const { open, exit } = usePayOS({
        CHECKOUT_URL: checkoutUrl || "",
        ELEMENT_ID: "payos-container",
        embedded: true,
        RETURN_URL: "https://11ac-2405-4802-a460-4040-f4df-4cb3-dbd7-a06a.ngrok-free.app/payment/return",
        CANCEL_URL: "https://11ac-2405-4802-a460-4040-f4df-4cb3-dbd7-a06a.ngrok-free.app/payment/return",
        onExit: () => {
            if (eventDetails?.id) {
                navigate(`/event/${String(eventDetails.id)}`);
            } else
            {
                navigate("/");
            }
        },
        onSuccess: () => {
            navigate(`/event/${String(eventDetails?.id)}/payment/success/${String(order?.id)}`);
        },
        onCancel: () => {
            if (eventDetails?.id) {
                navigate(`/event/${String(eventDetails.id)}`);
            } else {
                navigate("/");
            }
        },
    } as PayOSConfig);

    useEffect(() => {
        if (!checkoutUrl) {
            return;
        }
        const timeout = setTimeout(() => {
            const containerExists = document.getElementById("payos-container");
            if (containerExists) {
                open();
                iframeOpenedRef.current = true;
            } else {
                console.error("Element ID: payos-container not found in DOM");
                setError(
                    "Không thể hiển thị giao diện thanh toán. Vui lòng tải lại trang.",
                );
            }
        }, 100);

        return () => {
            clearTimeout(timeout);
            // If you are using the fix from the previous step, keep this logic:
            if (iframeOpenedRef.current) {
                exit();
            }
        };
    }, [checkoutUrl, open, exit]); // The dependency array is correct

    if (!order || !eventDetails || !orderDetails) {
        return (
            <div className="text-gray-800 text-center py-20 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">
                    Your session has expired.
                </h1>
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

    return (
        <div className="bg-gray-100 py-8 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <CountdownTimer
                        initialSeconds={900}
                        onTimerEnd={() => {
                            if (eventDetails.id) {
                                navigate(`/event/${String(eventDetails.id)}`);
                            }
                        }}
                    />
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Complete Your Payment
                        </h2>

                        {/* Error message */}
                        {error && (
                            <div className="text-red-500 text-center mb-4">
                                {error}
                            </div>
                        )}

                        {/* PayOS Embedded Container */}
                        <div className="relative w-full max-w-full overflow-hidden">
                            <div
                                id="payos-container"
                                className="w-full h-[500px]"
                            />
                        </div>

                        {/* Fallback QR Code */}
                        {!checkoutUrl && qrCode && (
                            <div className="mt-6 text-center">
                                <p className="mb-2 text-gray-600">
                                    Scan this QR code to pay:
                                </p>
                                <img
                                    src={qrCode}
                                    alt="QR Code"
                                    className="mx-auto w-64 h-64"
                                />
                            </div>
                        )}
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
