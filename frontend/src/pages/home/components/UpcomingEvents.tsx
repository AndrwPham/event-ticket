import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";

// 1. We import the event data from our single source of truth.
import { allEvents } from "../../../data/_mock_db";

const UpcomingEvents: React.FC = () => {
    // 2. State to manage how many events are currently visible. We start with 3.
    const [visibleCount, setVisibleCount] = useState(3);

    // 3. This function increases the number of visible events when the button is clicked.
    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    // 4. We "slice" the full array of events to get only the ones we need to display.
    const visibleEvents = allEvents.slice(0, visibleCount);

    // Helper function to format the ISO date string into a user-friendly format.
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
                    {/* 5. We map over the `visibleEvents` array to render each card. */}
                    {visibleEvents.map((event) => (
                        <Link
                            to={`/event/${String(event.id)}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 block"
                            key={event.id}
                        >
                            <div className="aspect-[16/9] overflow-hidden">
                                <img
                                    src={event.posterUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 h-14">
                                    {event.title}
                                </h3>
                                <p className="text-sm text-indigo-600 font-semibold mt-2">
                                    {/* Using the first schedule entry's time for display */}
                                    {formatEventDate(
                                        event.schedule[0].datetime,
                                    )}
                                </p>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                                    {event.location.name}
                                </p>
                                <div className="border-t my-4"></div>
                                <div className="flex justify-between items-center text-sm text-gray-800">
                                    <p className="font-bold">
                                        From{" "}
                                        {new Intl.NumberFormat("vi-VN").format(
                                            event.startingPrice,
                                        )}
                                        đ
                                    </p>
                                    <div className="flex items-center text-gray-600">
                                        <FaTicketAlt className="mr-2 text-indigo-500" />
                                        <span>{event.organizer.name}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="flex justify-center mt-12">
                    {/* 6. The button is only shown if there are more events left to load. */}
                    {visibleCount < allEvents.length && (
                        <button
                            onClick={handleLoadMore}
                            className="px-8 py-3 bg-[#2D1D53] text-white font-semibold rounded-full hover:bg-opacity-90 transition-colors duration-300 shadow-lg"
                        >
                            Load More
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
