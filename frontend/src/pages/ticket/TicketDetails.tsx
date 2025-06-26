import React, { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";

// Define the shape of event data
interface DetailedEvent {
    id: string;
    title: string;
    description: string;
    active_start_date: string;
    images: { url: string }[];
    venue?: {
        name: string;
        address?: string;
    };
    organization?: {
        name: string;
        logoUrl?: string;
    };
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

    useEffect(() => {
        if (!eventId) {
            setError("Event ID is missing.");
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/events/${eventId}`,
                    { signal, credentials: 'include' }
                );

                if (!response.ok) {
                    throw new Error(`Failed to fetch event: ${response.statusText}`);
                }

                const data = (await response.json()) as DetailedEvent;
                setEventData(data);
            } catch (err: any) {
                if (err.name === "AbortError") return;
                setError(err.message || "An unknown error occurred.");
            } finally {
                if (!signal.aborted) setLoading(false);
            }
        };

        void fetchEvent();
        return () => {
            controller.abort();
        };
    }, [eventId]);

    const handleBooking = () => {
        if (eventData) {
            navigate(`/events/${eventData.id}/seats`);
        }
    };

    const formatEventDate = (
        isoString: string,
        options: Intl.DateTimeFormatOptions
    ) => new Intl.DateTimeFormat("en-GB", options).format(new Date(isoString));

    // Render states
    if (loading) {
        return <div className="p-8 text-center">Loading event...</div>;
    }
    if (error) {
        return <p className="p-8 text-center text-red-500">Error: {error}</p>;
    }
    if (!eventData) {
        return <p className="p-8 text-center">Event not found.</p>;
    }

    // Unique ticket classes
    const ticketTiers = Array.from(
        new Map(eventData.tickets.map((t) => [t.class, t])).values()
    );

    const bannerUrl =
        eventData.images[0]?.url ||
        "https://placehold.co/800x400/cccccc/ffffff?text=No+Image";

    return (
        <div className="bg-gray-50">
            {/* Banner Section */}
            <section className="bg-white py-8 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="rounded-lg p-6 flex flex-col md:flex-row items-center gap-8 bg-white shadow-lg border border-gray-200">
                        <div className="w-full md:w-1/3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {eventData.title}
                            </h1>
                            <div className="mt-4 space-y-3 text-gray-600">
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-indigo-600" />
                                    <span>
                    {formatEventDate(eventData.active_start_date, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                  </span>
                                </div>
                                {eventData.venue && (
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-indigo-600 mt-1" />
                                        <span>
                      {eventData.venue.name}
                                            {eventData.venue.address && (
                                                <><br />{eventData.venue.address}</>
                                            )}
                    </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleBooking}
                                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-bold hover:bg-indigo-700 transition"
                            >
                                Book now
                            </button>
                        </div>
                        <div className="w-full md:w-2/3">
                            <img
                                src={bannerUrl}
                                alt="Event banner"
                                className="w-full h-64 object-cover rounded-lg bg-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
                <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                    <div
                        className={`text-gray-600 space-y-2 overflow-hidden transition-all duration-500 ease-in-out ${
                            isAboutExpanded ? "max-h-full" : "max-h-96"
                        }`}
                    >
                        {eventData.description.split("\n").map((line, i) => (
                            <p key={i}>{line.trim()}</p>
                        ))}
                    </div>
                    {eventData.description.split("\n").length > 5 && (
                        <button
                            onClick={() => setIsAboutExpanded((prev) => !prev)}
                            className="mt-2 text-indigo-600 hover:underline flex items-center gap-1"
                        >
                            {isAboutExpanded ? "Show less" : "Show more"}
                            <IoChevronDown
                                className={`transition-transform ${
                                    isAboutExpanded ? "rotate-180" : ""
                                }`} />
                        </button>
                    )}
                </section>

                {/* Ticket Information */}
                <section id="ticket-info" className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Information</h2>
                    <div>
                        {ticketTiers.map((tier) => (
                            <div
                                key={tier.class}
                                className="flex justify-between items-center py-4 border-b-2 border-gray-200"
                            >
                                <p className="font-semibold text-gray-800">{tier.class}</p>
                                <p className="font-bold text-gray-800">
                                    {new Intl.NumberFormat("vi-VN").format(tier.price)} đ
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Organizer Section */}
                <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Organizer</h2>
                    <div className="flex items-center gap-4">
                        {eventData.organization?.logoUrl && (
                            <img
                                src={eventData.organization.logoUrl}
                                alt="Organizer logo"
                                className="w-12 h-12 object-cover rounded-full"
                            />
                        )}
                        <p className="text-xl font-semibold text-gray-700">
                            {eventData.organization?.name || "Unknown organizer"}
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EventDetails;
