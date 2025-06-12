import { FC, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

// Interface for the PayOS order data from our backend
interface IOrderResponse {
    status: "PAID" | "PENDING" | "CANCELLED" | "EXPIRED";
    orderCode: number;
    amount: number;
    description: string;
    // You can add any other fields you need from the PayOS response
}

// Interface for the overall API response structure from our backend
interface IApiResponse {
    error: number;
    message: string;
    data: IOrderResponse | null;
}

const SuccessPage: FC = () => {
    const [searchParams] = useSearchParams();
    const [orderInfo, setOrderInfo] = useState<IOrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const orderCode = searchParams.get("orderCode");

        if (!orderCode) {
            setError("Invalid order information provided in URL.");
            setLoading(false);
            return;
        }

        const verifyPayment = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5000/api/payment/order/${orderCode}`,
                );

                // FIX 1: Explicitly type the JSON response to avoid 'any'
                const result = (await response.json()) as IApiResponse;

                if (!response.ok || result.error !== 0) {
                    throw new Error(
                        result.message || "Payment verification failed.",
                    );
                }

                setOrderInfo(result.data);
            } catch (err) {
                // FIX 2: Type-safe error handling
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred during verification.");
                }
            } finally {
                setLoading(false);
            }
        };

        // FIX 3: Use 'void' to explicitly mark the promise as intentionally not awaited
        void verifyPayment();
    }, [searchParams]);

    const renderContent = () => {
        if (loading) {
            return (
                <>
                    <FaSpinner className="text-6xl text-gray-400 mx-auto mb-4 animate-spin" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Verifying Payment...
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Please wait while we confirm your transaction.
                    </p>
                </>
            );
        }

        if (error || !orderInfo) {
            return (
                <>
                    <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-red-700 mb-2">
                        Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {error || "Could not retrieve your order details."}
                    </p>
                </>
            );
        }

        if (orderInfo.status === "PAID") {
            return (
                <>
                    <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your payment has been verified. A confirmation has been
                        sent to your email.
                    </p>
                    <div className="text-left bg-gray-50 p-4 rounded-lg border my-6">
                        <p>
                            <strong>Order Code:</strong> {orderInfo.orderCode}
                        </p>
                        <p>
                            <strong>Amount:</strong>{" "}
                            {new Intl.NumberFormat("vi-VN").format(
                                orderInfo.amount,
                            )}
                            đ
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {orderInfo.description}
                        </p>
                    </div>
                </>
            );
        }

        // Handle other statuses like PENDING, CANCELLED etc.
        return (
            <>
                <FaTimesCircle className="text-6xl text-orange-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-orange-700 mb-2">
                    Payment Status: {orderInfo.status}
                </h1>
                <p className="text-gray-600 mb-6">
                    Your payment was not completed. If you believe this is an
                    error, please contact support.
                </p>
            </>
        );
    };

    return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg border text-center">
            {renderContent()}
            <Link
                to="/"
                className="inline-block mt-6 bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default SuccessPage;
