import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

import { allEvents } from "../../data/_mock_db";

const recommendedShows = allEvents.slice(0, 3);

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

const TicketDetails: FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventData = allEvents.find(
        (event) => event.id === parseInt(id || ""),
    );
    const [expandedSchedule, setExpandedSchedule] = useState<string | null>(
        eventData?.schedule[0]?.datetime || null,
    );

    if (!eventData) {
        return (
            // CHANGED: Text color for the "Not Found" message
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

    const toggleSchedule = (datetime: string) => {
        setExpandedSchedule(expandedSchedule === datetime ? null : datetime);
    };

    return (
        <div className="text-gray-900">
            <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <img
                        src={eventData.posterUrl}
                        alt={eventData.title}
                        className="w-full rounded-lg shadow-lg"
                    />

                    {/* CHANGED: Background to white, added a border */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                        {/* CHANGED: Text color for better readability */}
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
                        <div className="space-y-4">
                            {eventData.schedule.map((item) => (
                                // CHANGED: Border color
                                <div
                                    key={item.datetime}
                                    className="border border-gray-200 rounded-lg overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        // CHANGED: Background color for the button
                                        className="w-full text-left bg-gray-50 hover:bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                                        onClick={() => {
                                            toggleSchedule(item.datetime);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedSchedule ===
                                            item.datetime ? (
                                                <IoChevronDown />
                                            ) : (
                                                <IoChevronForward />
                                            )}
                                            <span className="font-semibold">
                                                {formatEventDate(item.datetime)}
                                            </span>
                                        </div>
                                        <Link
                                            to="/payment"
                                            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-600 transition z-10 relative"
                                        >
                                            Mua vé ngay
                                        </Link>
                                    </button>
                                    {expandedSchedule === item.datetime && (
                                        // CHANGED: Background and border colors
                                        <div className="p-4 bg-white space-y-3">
                                            {item.tiers.map((tier) => (
                                                <div
                                                    key={tier.name}
                                                    className="flex justify-between items-center border-b border-gray-200 pb-2"
                                                >
                                                    <p className="text-gray-600">
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
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-4">
                            Sự kiện khác
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {recommendedShows.map((show) => (
                                // CHANGED: Background to white, added border
                                <Link
                                    to={`/event/${String(show.id)}`}
                                    key={show.id}
                                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg group block"
                                >
                                    <img
                                        src={show.posterUrl}
                                        alt={show.title}
                                        className="w-full h-48 object-cover group-hover:opacity-80 transition"
                                    />
                                    <div className="p-4">
                                        <h3 className="font-semibold truncate">
                                            {show.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {/* CHANGED: Sidebar background to white, added border */}
                    <div className="bg-white p-6 rounded-lg shadow-lg lg:sticky lg:top-8 border border-gray-200">
                        <h1 className="text-2xl font-bold mb-4">
                            {eventData.title}
                        </h1>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-center gap-3">
                                {/* CHANGED: Icon color for better contrast */}
                                <FaCalendarAlt className="text-green-600" />
                                <span>
                                    {formatEventDate(
                                        eventData.schedule[0].datetime,
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-green-600" />
                                <span>
                                    {eventData.location.name}
                                    <br />
                                    {eventData.location.address}
                                </span>
                            </div>
                        </div>
                        {/* CHANGED: Border color */}
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
                        <a
                            href="#ticket-info"
                            className="w-full text-center bg-green-500 text-white px-6 py-3 rounded-md text-lg font-bold hover:bg-green-600 transition block"
                        >
                            Chọn lịch diễn
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
