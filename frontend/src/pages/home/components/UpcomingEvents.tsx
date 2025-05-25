import React from "react";
import { FaTicketAlt } from "react-icons/fa";

const eventTemplate = {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque porttitor sem libero, id pretium lorem elementum quis. ",
    datetime: "Thu, Apr 10, 9:00 AM", // use this format? what if the event in next year?
    venue: "Template venue",
    host: "Organization name",
    payment: "Free",
    tickets: "120 tickets left!",
    image: "https://placehold.co/306x170",
};

// TODO: change this function to an API requests for real-time data
const getEvents = () => {
    const events = [];

    for (let i = 0; i < 6; i++) {
        events.push(
            <div
                className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition"
                key={i}
            >
                <div className="aspect-9/5">
                    <img
                        src={eventTemplate.image}
                        alt={eventTemplate.title}
                        className="w-full h-auto object-cover rounded-lg"
                    />
                </div>
                <div className="p-4 space-y-4">
                    <h3 className="font-semibold text-base leading-snug line-clamp-2">
                        {eventTemplate.title}
                    </h3>
                    <p className="text-sm text-red-500 font-medium mb-1">
                        {eventTemplate.datetime}
                    </p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {eventTemplate.venue}
                    </p>
                    <p className="text-xs mt-2 text-gray-500">Free</p>
                    <p className="text-xs font-semibold text-gray-800 mt-1">
                        {eventTemplate.host}
                    </p>
                    <div className="flex items-center text-sm mt-2 text-gray-600">
                        <FaTicketAlt className="mr-1" />
                        <span>{eventTemplate.tickets}</span>
                    </div>
                </div>
            </div>,
        );
    }

    return events;
};

const UpcomingEvents: React.FC = () => {
    return (
        <section className="py-8 px-4">
            <h2 className="w-5/6 text-2xl font-bold mx-auto mt-3 lg:mt-8">
                Upcoming Events
            </h2>
            <div className="w-5/6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 mx-auto my-6">
                {getEvents()}
            </div>
            <div className="flex justify-center pt-4">
                <button className="px-6 py-2 border-2 border-[#2D1D53] rounded-full text-[#2D1D53] font-semibold hover:bg-[#2D1D53] hover:text-white transition">
                    Load More
                </button>
            </div>
        </section>
    );
};

export default UpcomingEvents;
