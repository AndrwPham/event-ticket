import { FC } from "react";
import { useLocation, Link } from "react-router-dom";
import { LocationState } from "../../types";

const CardPaymentPage: FC = () => {
    const location = useLocation();
    const state = location.state as LocationState | null;

    return (
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-lg border">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Enter Card Details
            </h1>
            <p className="text-gray-600 mb-6">
                Please enter your credit or debit card information to complete
                the payment.
            </p>

            <div className="space-y-4">
                <div>
                    <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Card Number
                    </label>
                    <input
                        type="text"
                        id="cardNumber"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Expiry Date
                    </label>
                    <input
                        type="text"
                        id="expiryDate"
                        placeholder="MM / YY"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="cvc"
                        className="block text-sm font-medium text-gray-700"
                    >
                        CVC
                    </label>
                    <input
                        type="text"
                        id="cvc"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            </div>

            <button className="w-full mt-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition">
                Confirm Payment
            </button>
            <div className="text-center mt-4">
                <Link
                    to="/payment"
                    state={state}
                    className="text-sm text-gray-500 hover:underline"
                >
                    &larr; Go back and change payment method
                </Link>
            </div>
        </div>
    );
};

export default CardPaymentPage;
