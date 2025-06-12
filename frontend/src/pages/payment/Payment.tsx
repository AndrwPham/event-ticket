import { FC, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { QRCodeCanvas } from "qrcode.react"; // <--- 1. Import the new library

import { ILocationState } from "../../types";

import CountdownTimer from "./components/CountdownTimer";
import BuyerInfoForm from "./components/BuyerInfoForm";
import OrderSummary from "./components/OrderSummary";

interface PaymentResponse {
    qrCode: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    bin: string;
    error?: string;
}

const bankNameMapping: { [key: string]: string } = {
    "970415": "VietinBank",
    "970416": "DongA Bank",
    "970418": "Vietcombank",
    "970422": "MB Bank",
    "970432": "VPBank",
    "970436": "Vietcombank",
    "970488": "LienVietPostBank",
};

const getBankName = (bin: string) => {
    return bankNameMapping[bin] || `Bank (BIN: ${bin})`;
};


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
    const [paymentMethod, setPaymentMethod] = useState("momo");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);

    if (!eventDetails || !orderDetails || orderDetails.tickets.length === 0) {
        return (
            <div className="text-gray-800 text-center py-20 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">Your cart is empty</h1>
                <p className="mt-4 text-gray-600">
                    Please select your tickets before proceeding to payment.
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-green-500 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-600"
                >
                    Explore Events
                </Link>
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

        if (paymentMethod === "card") {
            navigate("/payment/card", {
                state: { eventDetails, orderDetails },
            });
        } else {
            try {
                const response = await fetch("http://localhost:5000/api/payment/create-payment-link", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ orderDetails, eventDetails }),
                });

                const data = await response.json() as PaymentResponse;

                if (response.ok && data.qrCode) {
                    setPaymentData(data);
                } else {
                    console.error("Failed to get payment data from backend:", data);
                    const errorMessage = data.error || "Could not retrieve payment information. Please check the console.";
                    alert(`Error: ${errorMessage}`);
                }

            } catch (error) {
                console.error("Payment fetch error:", error);
                alert("There was a critical error processing your payment. Please try again.");
            }
        }
    };

    return (
        <div className="bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <CountdownTimer initialSeconds={600} />

                    {!paymentData ? (
                        <>
                            <BuyerInfoForm
                                buyerInfo={buyerInfo}
                                onInfoChange={handleInputChange}
                            />
                            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Choose Payment Method
                                </h2>
                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "momo" ? "border-indigo-600 ring-2 ring-indigo-600" : "border-gray-200"}`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="momo"
                                            checked={paymentMethod === "momo"}
                                            onChange={(e) => { setPaymentMethod(e.target.value); }}
                                            className="hidden"
                                        />
                                        <IoWallet className="text-2xl text-pink-600 mr-4" />
                                        <span className="font-semibold">PayOS (E-Wallet, QR Code)</span>
                                        <FaRegCheckCircle
                                            className={`ml-auto text-xl ${paymentMethod === "momo" ? "text-indigo-600" : "text-gray-300"}`}
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
                                            onChange={(e) => { setPaymentMethod(e.target.value); }}
                                            className="hidden"
                                        />
                                        <FaCreditCard className="text-2xl text-gray-500 mr-4" />
                                        <span className="font-semibold">
                                            Credit / Debit Card (Not PayOS)
                                        </span>
                                        <FaRegCheckCircle
                                            className={`ml-auto text-xl ${paymentMethod === "card" ? "text-indigo-600" : "text-gray-300"}`}
                                        />
                                    </label>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Scan QR Code to Pay
                            </h2>

                            {/* --- 2. THIS IS THE FIX --- */}
                            <div className="mx-auto bg-white inline-block p-4 rounded-lg">
                                <QRCodeCanvas
                                    value={paymentData.qrCode}
                                    size={256}
                                    bgColor={"#ffffff"}
                                    fgColor={"#000000"}
                                    level={"L"}
                                />
                            </div>

                            <p className="my-4 font-semibold text-gray-600 text-sm">
                                Please make sure to transfer the exact amount and content.
                            </p>
                            <div className="border-t border-b border-gray-200 py-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                    Or Transfer Manually
                                </h3>
                                <div className="text-left space-y-3 bg-gray-50 p-4 rounded-md">
                                    <p><strong>Bank:</strong> {getBankName(paymentData.bin)}</p>
                                    <p><strong>Account Number:</strong> {paymentData.accountNumber}</p>
                                    <p><strong>Account Name:</strong> {paymentData.accountName}</p>
                                    <p><strong>Amount:</strong> <span className="font-bold text-red-600">{new Intl.NumberFormat("vi-VN").format(paymentData.amount)}đ</span></p>
                                    <p><strong>Description:</strong> <span className="font-semibold text-blue-600">{paymentData.description}</span></p>
                                </div>
                            </div>
                            <button onClick={() => { setPaymentData(null); }} className="mt-4 text-sm text-indigo-600 hover:underline">
                                &larr; Go back and change payment method
                            </button>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <OrderSummary
                        eventDetails={eventDetails}
                        orderDetails={orderDetails}
                    />

                    {!paymentData && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-8">
                            <label className="flex items-start text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={() => { setAgreedToTerms(!agreedToTerms); }}
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
                                onClick={() => { void handlePayment(); }}
                                disabled={!isFormValid}
                                className={`w-full mt-4 py-3 rounded-lg text-white font-bold text-lg transition ${isFormValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                            >
                                Pay Now
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;