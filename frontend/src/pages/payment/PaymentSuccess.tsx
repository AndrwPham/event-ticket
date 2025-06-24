import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ReceiptItem {
    name: string;
}

interface ReceiptData {
    name?: string;
    orderId: string;
    createdAt: string;
    method: string;
    items: string[]; // or ReceiptItem[] if you want structured items
    totalPrice: number;
}

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as ReceiptData;

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center text-red-500">
                Missing receipt data. Please return to the homepage.
                <button
                    className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>
            </div>
        );
    }

    const { name, orderId, createdAt, method, items, totalPrice } = state;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
            <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Order Receipt</h1>
                <p className="text-lg text-gray-700 mb-2">
                    Hi{ name ? ` ${name}` : "" },
                </p>
                <p className="text-gray-700 text-md mb-6">
                    Thank you for your order! Here are your order details:
                </p>

                <div className="mb-6">
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Date:</strong> {createdAt}</p>
                    <p><strong>Payment Method:</strong> {method}</p>
                </div>

                <table className="w-full border border-gray-300 mb-4">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="text-left p-2 border-b">Item</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item, idx) => (
                        <tr key={idx}>
                            <td className="p-2 border-b">{item}</td>
                        </tr>
                    ))}
                    <tr className="bg-gray-100 font-semibold">
                        <td className="p-2">Total: ${totalPrice.toFixed(2)}</td>
                    </tr>
                    </tbody>
                </table>

                <p className="text-gray-600 text-md">
                    We hope you enjoy your event!
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
