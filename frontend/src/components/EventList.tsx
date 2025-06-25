import React, { FC, useState, useEffect } from "react";
import EventCard, { Event } from "./EventCard";
import Pagination from "./Pagination";
import { LiveEvent } from "../types";

interface EventListProps {
    events: LiveEvent[];
    maxCards?: number;
    onCardClick?: (event: LiveEvent) => void;
}

const EventList: FC<EventListProps> = ({
    events,
    maxCards = 12,
    onCardClick,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(events.length / maxCards);
    const paginatedEvents = events.slice(
        (currentPage - 1) * maxCards,
        currentPage * maxCards,
    );

    useEffect(() => {
        setCurrentPage(1); // reset pagination if events change
    }, [events]);

    return (
        <>
            {events.length > 0 ? (
                <div className="w-5/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mx-auto my-6">
                    {paginatedEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={onCardClick}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg mb-2">
                        No events found
                    </div>
                    <div className="text-gray-400 text-sm">
                        Try adjusting your search or filters
                    </div>
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default EventList;
