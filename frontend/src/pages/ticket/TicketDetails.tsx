import { FC, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

// Define a more detailed type for the event data we expect
interface DetailedEvent {
    id: string;
    title: string;
    description: string;
    active_start_date: string;
    images: { url: string }[];
    venue: {
        name: string;
        address?: string;
    } | null;
    organization: {
        name: string;
        logoUrl?: string;
    } | null;
    tickets: {
        class: string;
        price: number;
    }[];
}

const EventDetails: FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const [eventData, setEventData] = useState<DetailedEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);

    // This useEffect hook is now safe from memory leaks.
    useEffect(() => {
        // Use AbortController to cancel fetch on component unmount
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchEvent = async () => {
            if (!eventId) {
                setError("Event ID is missing.");
                setLoading(false);
                return;
            }

            // Reset state for new fetches
            setLoading(true);
            setError(null);
            setEventData(null);

            try {
                const response = await fetch(
                    `http://localhost:5000/events/${eventId}`,
                    { signal },
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch event details.");
                }
                const data = (await response.json()) as DetailedEvent;
                setEventData(data);
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") {
                    return;
                }
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred.",
                );
            } finally {
                if (!signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void fetchEvent();

        return () => {
            controller.abort();
        };
    }, [eventId]);

    const handleBooking = () => {
        if (eventData) {
            navigate(`/event/${eventData.id}/seats`);
        }
    };

    const formatEventDate = (
        isoString: string,
        options: Intl.DateTimeFormatOptions,
    ) => {
        return new Intl.DateTimeFormat("en-GB", options).format(
            new Date(isoString),
        );
    };
    if (loading) {
        return <EventDetailsSkeleton />;
    }
    if (error) {
        return <p className="text-center text-red-500 p-8">Error: {error}</p>;
    }
    if (!eventData) {
        return <p className="text-center p-8">Event not found.</p>;
    }

    const ticketTiers = Array.from(
        new Map(eventData.tickets.map((t) => [t.class, t])).values(),
    );
    const bannerImage =
        eventData.images[0]?.url ||
        "https://placehold.co/800x400/cccccc/ffffff?text=Event+Banner";

    const ticketTiers = Array.from(
        new Map(eventData.tickets.map((t) => [t.class, t])).values(),
    );
    const bannerImage =
        eventData.images[0]?.url ||
        "https://placehold.co/800x400/cccccc/ffffff?text=Event+Banner";

    return (
        <div className="bg-gray-50">
            {/* Banner Section */}
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
                                            eventData.active_start_date,
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            },
                                        )}
                                    </span>
                                </div>
                                {eventData.venue && (
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-indigo-600 mt-1" />
                                        <span>
                                            {eventData.venue.name}
                                            <br />
                                            {eventData.venue.address}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleBooking}
                                className="mt-6 inline-block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Book now
                            </button>
                        </div>
                        <div className="w-full md:w-2/3">
                            <img
                                src={bannerImage}
                                alt={`${eventData.title} banner`}
                                className="bg-gray-200 h-64 w-full object-cover rounded-lg"
                            />
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
                            className={`text-gray-600 space-y-2 transition-all duration-500 ease-in-out overflow-hidden ${isAboutExpanded ? "max-h-full" : "max-h-96"}`}
                        >
                            {eventData.description
                                .split("\n")
                                .map((line, index) => (
                                    <p key={index}>{line.trim()}</p>
                                ))}
                        </div>
                    </div>
                </section>

                <section id="ticket-info">
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Ticket Information
                        </h2>
                        <div>
                            <div className="flex justify-between items-center py-4 border-b-2 border-gray-200">
                                <h3 className="font-semibold text-lg">
                                    {formatEventDate(
                                        eventData.active_start_date,
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        },
                                    )}
                                    ,{" "}
                                    {formatEventDate(
                                        eventData.active_start_date,
                                        {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        },
                                    )}
                                </h3>
                                <button
                                    onClick={handleBooking}
                                    className="bg-indigo-500 text-white px-6 py-2 rounded-md font-bold hover:bg-indigo-600 transition text-sm"
                                >
                                    Book now
                                </button>
                            </div>
                            <div className="mt-4 space-y-3">
                                {ticketTiers.filter(tier => tier.status !== 'UNAVAILABLE').map((tier) => (
                                    <div
                                        key={tier.class}
                                        className="flex justify-between items-center"
                                    >
                                        <p className="font-semibold">
                                            {tier.class}
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
                    </div>
                </section>

                <section>
                    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Organizer
                        </h2>
                        <div className="flex items-center gap-6">
                            <p className="text-xl font-semibold text-gray-700">
                                {eventData.organization?.name}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EventDetails;
