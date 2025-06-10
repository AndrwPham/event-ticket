import { FC, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { FaCreditCard, FaRegCheckCircle } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";

import { ILocationState } from "../../types";

import CountdownTimer from "./components/CountdownTimer";
import BuyerInfoForm from "./components/BuyerInfoForm";
import OrderSummary from "./components/OrderSummary";

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

    const handlePayment = () => {
        if (!isFormValid) return;

        const finalOrder = {
            buyerInfo,
            eventDetails,
            orderDetails,
            paymentMethod,
        };
        console.log("Submitting Order:", finalOrder);

        if (paymentMethod === "card") {
            navigate("/payment/card", {
                state: { eventDetails, orderDetails },
            });
        } else {
            alert(
                `Simulating payment with ${paymentMethod}... Payment successful!`,
            );
            // navigate('/confirmation', { state: { finalOrder } });
        }
    };

    return (
        <div className="bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <CountdownTimer initialSeconds={600} />
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
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                    }}
                                    className="hidden"
                                />
                                <IoWallet className="text-2xl text-pink-600 mr-4" />
                                <span className="font-semibold">E-Wallet</span>
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
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                    }}
                                    className="hidden"
                                />
                                <FaCreditCard className="text-2xl text-gray-500 mr-4" />
                                <span className="font-semibold">
                                    Credit / Debit Card
                                </span>
                                <FaRegCheckCircle
                                    className={`ml-auto text-xl ${paymentMethod === "card" ? "text-indigo-600" : "text-gray-300"}`}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
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
                            onClick={handlePayment}
                            disabled={!isFormValid}
                            className={`w-full mt-4 py-3 rounded-lg text-white font-bold text-lg transition ${isFormValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
