import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaPlus, FaMinus } from "react-icons/fa";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

import { allEvents } from "../../data/_mock_db";

type TicketQuantities = {
    [tierName: string]: number;
};

const formatEventDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        weekday: "short",
    }).format(new Date(isoString));
};

const TicketDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventData = allEvents.find(
        (event) => event.id === parseInt(id || ""),
    );

    const [quantities, setQuantities] = useState<TicketQuantities>({});
    const [expandedSchedule, setExpandedSchedule] = useState<string | null>(
        eventData?.schedule[0]?.datetime || null,
    );

    // handle changing ticket quantity
    const handleQuantityChange = (tierName: string, amount: number) => {
        setQuantities((prev) => {
            const currentQuantity = prev[tierName] || 0;
            const newQuantity = Math.max(0, currentQuantity + amount); // Prevents quantity from going below 0
            return { ...prev, [tierName]: newQuantity };
        });
    };

    // order details object based on the user's selection
    const orderDetails = {
        tickets:
            eventData?.schedule[0].tiers
                .filter((tier) => quantities[tier.name] > 0) // Only include tickets with quantity > 0
                .map((tier) => ({
                    type: tier.name,
                    quantity: quantities[tier.name],
                    price: tier.price,
                })) || [],
    };

    // total number of tickets selected to update the button
    const totalTickets = orderDetails.tickets.reduce(
        (acc, ticket) => acc + ticket.quantity,
        0,
    );

    const toggleSchedule = (datetime: string) => {
        setExpandedSchedule(expandedSchedule === datetime ? null : datetime);
    };

    if (!eventData) {
        return (
            <div className="text-gray-800 text-center py-20">
                <h1 className="text-3xl font-bold">404 - Event Not Found</h1>
                <p className="mt-4">
                    {"We couldn't find the event you were looking for."}
                </p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-green-500 text-white px-6 py-2 rounded-md"
                >
                    Back to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 text-gray-900">
            <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <img
                        src={eventData.posterUrl}
                        alt={eventData.title}
                        className="w-full rounded-lg shadow-lg"
                    />
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                        <p className="text-gray-600 mb-6">
                            {eventData.description}
                        </p>
                        <h3 className="text-xl font-semibold mb-3">
                            Nghệ sĩ tham gia
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {eventData.artists.map((artist) => (
                                <span
                                    key={artist}
                                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                                >
                                    {artist}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div
                        id="ticket-info"
                        className="bg-white p-6 rounded-lg border border-gray-200"
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            Thông tin vé
                        </h2>
                        {eventData.schedule.map((item) => (
                            <div key={item.datetime}>
                                {expandedSchedule === item.datetime && (
                                    <div className="p-4 bg-white space-y-3">
                                        {item.tiers.map((tier) => (
                                            <div
                                                key={tier.name}
                                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-3 mb-3"
                                            >
                                                <div>
                                                    <p className="text-gray-800 font-semibold">
                                                        {tier.name}
                                                    </p>
                                                    <p className="font-bold text-green-600">
                                                        {new Intl.NumberFormat(
                                                            "vi-VN",
                                                        ).format(
                                                            tier.price,
                                                        )}{" "}
                                                        đ
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                                    <button
                                                        onClick={() => {
                                                            handleQuantityChange(
                                                                tier.name,
                                                                -1,
                                                            );
                                                        }}
                                                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                                                    >
                                                        <FaMinus />
                                                    </button>
                                                    <span className="font-bold text-lg w-8 text-center">
                                                        {quantities[
                                                            tier.name
                                                        ] || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            handleQuantityChange(
                                                                tier.name,
                                                                1,
                                                            );
                                                        }}
                                                        className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                                                    >
                                                        <FaPlus />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-lg lg:sticky lg:top-8 border border-gray-200">
                        <h1 className="text-2xl font-bold mb-4">
                            {eventData.title}
                        </h1>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-green-600" />
                                <span>
                                    {formatEventDate(
                                        eventData.schedule[0].datetime,
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-green-600 mt-1" />
                                <span>
                                    {eventData.location.name}
                                    <br />
                                    {eventData.location.address}
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 my-6"></div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-500">Giá từ</span>
                            <span className="text-2xl font-bold text-green-600">
                                {new Intl.NumberFormat("vi-VN").format(
                                    eventData.startingPrice,
                                )}{" "}
                                đ
                            </span>
                        </div>
                        <Link
                            to="/payment"
                            state={{
                                eventDetails: eventData,
                                orderDetails: orderDetails,
                            }}
                            className={`w-full text-center block px-6 py-3 rounded-md text-lg font-bold transition ${totalTickets > 0 ? "bg-green-500 text-white hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            onClick={(e) => {
                                if (totalTickets === 0) e.preventDefault();
                            }}
                        >
                            Mua vé ({totalTickets})
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailsPage;
