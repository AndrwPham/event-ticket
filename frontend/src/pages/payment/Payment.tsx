import { FC, useState, useEffect, KeyboardEvent, MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { usePayOS, PayOSConfig } from "@payos/payos-checkout";

import { ILocationState, IPayOSEvent } from "../../types";

import CountdownTimer from "./components/CountdownTimer";
import BuyerInfoForm from "./components/BuyerInfoForm";
import OrderSummary from "./components/OrderSummary";

interface IPaymentLinkResponse {
    error?: string;
    checkoutUrl: string;
    [key: string]: unknown;
}

const PaymentPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as ILocationState | null;
    const eventDetails = state?.eventDetails;
    const orderDetails = state?.orderDetails;

    const [buyerInfo, setBuyerInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState<string>(
        () => sessionStorage.getItem("paymentMethod") || "payos",
    );

    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPayOSOpen, setIsPayOSOpen] = useState(false);

    useEffect(() => {
        sessionStorage.setItem("paymentMethod", paymentMethod);
    }, [paymentMethod]);

    const [payOSConfig, setPayOSConfig] = useState<PayOSConfig>({
        CHECKOUT_URL: "",
        RETURN_URL: `http://localhost:5173/payment/success`,
        ELEMENT_ID: "payos-container",
        embedded: true,
        onSuccess: (event: IPayOSEvent) => {
            if (event.orderCode) {
                navigate(
                    `/payment/success?orderCode=${String(event.orderCode)}`,
                );
            } else {
                navigate(`/payment/success?error=OrderCodeNotFound`);
            }
        },
        onCancel: () => {
            setIsPayOSOpen(false);
            alert("Payment has been canceled.");
        },
        onExit: () => {
            setIsPayOSOpen(false);
        },
    });

    const { open, exit } = usePayOS(payOSConfig);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL) {
            open();
        }
    }, [payOSConfig.CHECKOUT_URL, open]);

    if (!eventDetails || !orderDetails || orderDetails.tickets.length === 0) {
        return (
            <div className="text-gray-800 text-center py-20 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">Your cart is empty</h1>
                <a
                    href="/"
                    className="mt-6 inline-block bg-green-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600"
                >
                    Explore Events
                </a>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBuyerInfo((prev) => ({ ...prev, [name]: value }));
    };

    const isFormValid =
        buyerInfo.fullName &&
        buyerInfo.email &&
        buyerInfo.phone &&
        agreedToTerms;

    const handlePayment = async () => {
        if (!isFormValid) return;
        setIsProcessing(true);

        if (paymentMethod === "card") {
            navigate("/payment/card", {
                state: { eventDetails, orderDetails },
            });
        } else {
            exit();
            try {
                const response = await fetch(
                    "http://localhost:5000/api/payment/create-payment-link",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ orderDetails, eventDetails }),
                    },
                );

                const paymentLink =
                    (await response.json()) as IPaymentLinkResponse;

                if (!response.ok) {
                    throw new Error(
                        paymentLink.error || "Failed to create payment link.",
                    );
                }

                setPayOSConfig((prev) => ({
                    ...prev,
                    CHECKOUT_URL: paymentLink.checkoutUrl,
                }));
                setIsPayOSOpen(true);
            } catch (error) {
                console.error("Payment fetch error:", error);
                alert(
                    `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`,
                );
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleGoBack = () => {
        exit();
        setIsPayOSOpen(false);
    };

    const handleOverlayKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            handleGoBack();
        }
    };

    // Generic event handler to stop propagation for both mouse and keyboard events
    const stopPropagation = (
        e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>,
    ) => {
        e.stopPropagation();
    };

    const handleTimeout = () => {
        alert("Time has run out, the payment process has been canceled.");
        if (isPayOSOpen) {
            exit();
        }
        navigate(`/event/${String(eventDetails.id)}`);
    };

    return (
        <>
            <div className="bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <CountdownTimer
                            initialSeconds={10}
                            onTimerEnd={handleTimeout}
                        />
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <BuyerInfoForm
                                buyerInfo={buyerInfo}
                                onInfoChange={handleInputChange}
                            />
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Choose Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "payos" ? "border-indigo-600 ring-2 ring-indigo-600" : "border-gray-200"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="payos"
                                            checked={paymentMethod === "payos"}
                                            onChange={(e) => {
                                                setPaymentMethod(
                                                    e.target.value,
                                                );
                                            }}
                                            className="hidden"
                                        />
                                        <IoWallet className="text-2xl text-pink-600 mr-4" />
                                        <span className="font-semibold">
                                            National Banking
                                        </span>
                                        <FaRegCheckCircle
                                            className={`ml-auto text-xl ${paymentMethod === "payos" ? "text-indigo-600" : "text-gray-300"}`}
                                        />
                                    </label>
                                    <label
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "card" ? "border-indigo-600 ring-2 ring-indigo-600" : "border-gray-200"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="card"
                                            checked={paymentMethod === "card"}
                                            onChange={(e) => {
                                                setPaymentMethod(
                                                    e.target.value,
                                                );
                                            }}
                                            className="hidden"
                                        />
                                        <FaCreditCard className="text-2xl text-gray-500 mr-4" />
                                        <span className="font-semibold">
                                            Credit / Debit Card{" "}
                                        </span>
                                        <FaRegCheckCircle
                                            className={`ml-auto text-xl ${paymentMethod === "card" ? "text-indigo-600" : "text-gray-300"}`}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <OrderSummary
                            eventDetails={eventDetails}
                            orderDetails={orderDetails}
                        />
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
                            <label className="flex items-start text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={() => {
                                        setAgreedToTerms(!agreedToTerms);
                                    }}
                                    className="mt-1 mr-2 h-4 w-4 accent-indigo-600"
                                />
                                <span>
                                    I agree to the{" "}
                                    <a
                                        href="/terms-and-conditions"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        terms and conditions
                                    </a>{" "}
                                    of the organizer.
                                </span>
                            </label>
                            <button
                                onClick={() => {
                                    void handlePayment();
                                }}
                                disabled={!isFormValid || isProcessing}
                                className={`w-full mt-4 py-3 rounded-lg text-white font-bold text-lg transition ${!isFormValid || isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
                            >
                                {isProcessing ? "Processing..." : "Pay Now"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isPayOSOpen && (
                <>
                    <style>{`
                        .payment-overlay {
                            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                            background-color: rgba(0, 0, 0, 0.7);
                            display: flex; align-items: center; justify-content: center; z-index: 9999;
                        }
                        .payment-modal {
                            background: white; padding: 1.5rem; border-radius: 8px;
                            width: 95%; max-width: 450px; height: 95%; max-height: 800px;
                            display: flex; flex-direction: column;
                        }
                        .payment-modal-body { flex-grow: 1; overflow: hidden; }
                        #payos-container, #payos-container iframe { width: 100%; height: 100%; border: none; }
                    `}</style>
                    <div
                        className="payment-overlay"
                        onClick={handleGoBack}
                        onKeyDown={handleOverlayKeyDown}
                        role="button"
                        tabIndex={0}
                        aria-label="Close payment modal"
                    >
                        <div
                            className="payment-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="payment-modal-title"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Complete Your Payment
                                </h2>
                                <button
                                    onClick={handleGoBack}
                                    className="text-sm font-medium text-indigo-600 hover:underline"
                                >
                                    &larr; Go Back
                                </button>
                            </div>
                            <div className="payment-modal-body">
                                <div id="payos-container"></div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default PaymentPage;
