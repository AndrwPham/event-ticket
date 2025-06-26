import { FC } from "react";
import { Link } from "react-router-dom";
// Assuming you have a shared type definition like this
import { LiveEvent } from "../types";

interface EventCardProps {
    event: LiveEvent;
    onClick?: (event: LiveEvent) => void;
}

export interface Event {
    id: number;
    title: string;
    date: string;
    location: string;
    price: string;
    followers: string;
    image: string;
    category: string;
}

const EventCard: FC<EventCardProps> = ({ event }) => {
    const eventDate = new Date(event.active_start_date).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
        },
    );

    const eventTime = new Date(event.active_start_date).toLocaleTimeString(
        "en-US",
        {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        },
    );

    const bannerImage = "https://raw.githubusercontent.com/fuisl/cfied25-ticket/main/src/assets/banner.jpg";

    // const bannerImage =
    //     event.images[0]?.url ||
    //     "https://raw.githubusercontent.com/fuisl/cfied25-ticket/main/src/assets/banner.jpg";
        

    return (
        // The `to` prop uses a template literal (backticks ``) to correctly build the URL.
        <Link
            to={`/events/${event.id}/seats`}
            className="block bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group"
        >
            <div className="relative">
                <img
                    src={bannerImage}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold truncate">{event.title}</h3>
                <p className="text-gray-600 text-sm mt-1">
                    {event.venue?.name || "Online Event"}
                </p>
                <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm font-semibold text-indigo-600">
                        {eventDate} - {eventTime}
                    </p>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        ON SALE
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
