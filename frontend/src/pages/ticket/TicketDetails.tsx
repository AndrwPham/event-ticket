import { FC, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import { allEvents } from "../../data/_mock_db";

// Helper to format dates
const formatEventDate = (
    isoString: string,
    options: Intl.DateTimeFormatOptions,
) => {
    return new Intl.DateTimeFormat("en-GB", options).format(
        new Date(isoString),
    );
};

const TicketDetails: FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const eventData = allEvents.find(
        (event) => event.id === parseInt(id || ""),
    );

    // State to manage the collapsible "About" section
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);

    const handleBooking = () => {
        // Check if the event has a seat map configured

        if (!eventData) {
            console.error("Booking failed: Event data is not available.");
            return;
        }

        if (eventData.venueId) {
            navigate(`/event/${String(eventData.id)}/select-seats`);
        }
    };

    if (!eventData) {
        return (
            <div className="text-gray-800 text-center py-20">
                <h1 className="text-3xl font-bold">404 - Event Not Found</h1>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md"
                >
                    Back to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            {/*Banner Section */}
            <section className="bg-white py-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-8 shadow-lg border border-gray-200">
                        <div className="w-full md:w-1/3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {eventData.title}
                            </h1>
                            <div className="space-y-3 mt-4 text-gray-600">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-indigo-600" />
                                    <span>
                                        {formatEventDate(
                                            eventData.schedule[0].datetime,
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            },
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <FaMapMarkerAlt className="text-indigo-600 mt-1" />
                                    <span>
                                        {eventData.location.name}
                                        <br />
                                        {eventData.location.address}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleBooking}
                                className="mt-6 inline-block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Book now
                            </button>
                        </div>
                        <div className="w-full md:w-2/3">
                            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                                <span className="text-gray-500">
                                    Event Banner Image
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
                <section>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            About
                        </h2>
                        <div
                            className={`text-gray-600 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${isAboutExpanded ? "max-h-full" : "max-h-48"}`}
                        >
                            {eventData.description
                                .split("\n")
                                .map((line, index) => (
                                    <p key={index}>{line.trim()}</p>
                                ))}
                        </div>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => {
                                    setIsAboutExpanded(!isAboutExpanded);
                                }}
                                className="p-2 rounded-full hover:bg-gray-200 transition"
                            >
                                <IoChevronDown
                                    className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${isAboutExpanded ? "rotate-180" : ""}`}
                                />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Ticket Information Section */}
                <section id="ticket-info">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Ticket Information
                        </h2>
                        {eventData.schedule.map((item) => (
                            <div key={item.datetime}>
                                <div className="flex justify-between items-center py-4 border-b-2 border-gray-200">
                                    <h3 className="font-semibold text-lg">
                                        {formatEventDate(item.datetime, {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        })}
                                        ,{" "}
                                        {formatEventDate(item.datetime, {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </h3>
                                    <button
                                        onClick={handleBooking}
                                        className="bg-indigo-500 text-white px-6 py-2 rounded-md font-bold hover:bg-indigo-600 transition text-sm"
                                    >
                                        Book now
                                    </button>
                                </div>
                                <div className="mt-4 space-y-3">
                                    {item.tiers.map((tier) => (
                                        <div
                                            key={tier.name}
                                            className="flex justify-between items-center"
                                        >
                                            <p className="font-semibold">
                                                {tier.name}
                                            </p>
                                            <p className="font-bold text-gray-800">
                                                {new Intl.NumberFormat(
                                                    "vi-VN",
                                                ).format(tier.price)}{" "}
                                                đ
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Organizer Section */}
                <section>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Organizer
                        </h2>
                        <div className="flex items-center gap-6">
                            <img
                                src={eventData.organizer.logoUrl}
                                alt={eventData.organizer.name}
                                className="h-20 w-auto object-contain"
                            />
                            <p className="text-xl font-semibold text-gray-700">
                                {eventData.organizer.name}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TicketDetails;
