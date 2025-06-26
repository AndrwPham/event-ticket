import React from "react";
import { Link } from "react-router-dom";
import { LiveEvent } from "../page"; // Import type from parent

interface UpcomingEventsProps {
    events: LiveEvent[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
    const formatEventDate = (isoString: string) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
        }).format(new Date(isoString));
    };

    return (
        <section className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Upcoming Events
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const bannerImage =
                            event.posterImage ??
                            "https://placehold.co/400x300/cccccc/ffffff?text=Event";
                        return (
                            // This link now points to the Event Details page
                            <Link
                                to={`/event/${event.id}`}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 block group"
                                key={event.id}
                            >
                                <div className="aspect-[16/9] overflow-hidden">
                                    <img
                                        src={bannerImage}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 h-14">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-indigo-600 font-semibold mt-2">
                                        {formatEventDate(
                                            event.active_start_date,
                                        )}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                                        {event.venue?.name || "Online Event"}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
