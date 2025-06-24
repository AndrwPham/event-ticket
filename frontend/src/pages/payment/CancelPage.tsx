import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFail: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
            <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
                <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Payment Failed
                </h1>
                <p className="text-gray-600 mb-6">
                    Unfortunately, your payment could not be processed.
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate("/events")}
                        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFail;
