import { FC } from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const CancelPage: FC = () => {
    return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg border text-center">
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Payment Canceled
            </h1>
            <p className="text-gray-600 mb-6">
                Your payment was not completed. You can try again or return to
                the homepage.
            </p>

            <div className="flex justify-center gap-4">
                <Link
                    to="/payment"
                    className="inline-block mt-6 bg-gray-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-700 transition"
                >
                    Try Again
                </Link>
                <Link
                    to="/"
                    className="inline-block mt-6 bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default CancelPage;
