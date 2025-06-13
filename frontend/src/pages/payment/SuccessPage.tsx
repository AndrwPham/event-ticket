import { FC, useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { IApiResponse, IEvent } from "../../types";
import { allEvents } from "../../data/_mock_db";

const SuccessPage: FC = () => {
    const { id: eventId } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const [eventDetails, setEventDetails] = useState<IEvent | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<
        "VERIFYING" | "SUCCESS" | "FAILED"
    >("VERIFYING");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const foundEvent = allEvents.find(
            (event) => String(event.id) === eventId,
        );
        if (!foundEvent) {
            setError("Event not found.");
            setVerificationStatus("FAILED");
            return;
        }
        setEventDetails(foundEvent);

        const orderCode = searchParams.get("orderCode");
        if (!orderCode) {
            setError("No order code provided for verification.");
            setVerificationStatus("FAILED");
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/payment/order/${orderCode}`,
                );
                const result = (await response.json()) as IApiResponse;

                if (
                    !response.ok ||
                    result.error !== 0 ||
                    result.data?.status !== "PAID"
                ) {
                    throw new Error(
                        result.message ||
                            "Payment verification failed or payment was not completed.",
                    );
                }
                setVerificationStatus("SUCCESS");
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred during verification.",
                );
                setVerificationStatus("FAILED");
            }
        };

        void verifyPayment();
    }, [eventId, searchParams]);

    const renderContent = () => {
        if (verificationStatus === "VERIFYING") {
            return (
                <FaSpinner className="text-6xl text-gray-400 mx-auto mb-4 animate-spin" />
            );
        }
        if (verificationStatus === "FAILED") {
            return (
                <>
                    <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-red-700 mb-2">
                        Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                </>
            );
        }
        return (
            <>
                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                </h1>
                <p className="text-gray-600 mb-6">
                    Your tickets for the event below have been confirmed.
                </p>
                {eventDetails && (
                    <div className="text-left bg-gray-50 p-6 rounded-lg border my-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                            {eventDetails.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                            {new Date(
                                eventDetails.schedule[0].datetime,
                            ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            {eventDetails.location.name}
                        </p>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg border text-center">
            {renderContent()}
            <Link
                to="/"
                className="inline-block mt-6 bg-indigo-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-indigo-700"
            >
                Back to Home
            </Link>
        </div>
    );
};

export default SuccessPage;
