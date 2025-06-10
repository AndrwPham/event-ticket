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

const TicketDetailsPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventData = allEvents.find(
        (event) => event.id === parseInt(id || ""),
    );
    const [expandedSchedule, setExpandedSchedule] = useState<string | null>(
        eventData?.schedule[0]?.datetime || null,
    );

    if (!eventData) {
        return (
            <div className="text-white text-center py-20">
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
        <div className="bg-[#1a1a1a] text-white">
            <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <img
                        src={eventData.posterUrl}
                        alt={eventData.title}
                        className="w-full rounded-lg shadow-lg"
                    />

                    <div className="bg-[#2a2a2a] p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                        <p className="text-gray-300 mb-6">
                            {eventData.description}
                        </p>

                        {/*Artist data*/}
                        <h3 className="text-xl font-semibold mb-3">
                            Nghệ sĩ tham gia
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {eventData.artists.map((artist) => (
                                <span
                                    key={artist}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                                >
                                    {artist}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div
                        id="ticket-info"
                        className="bg-[#2a2a2a] p-6 rounded-lg"
                    >
                        <h2 className="text-2xl font-bold mb-4">
                            Thông tin vé
                        </h2>
                        <div className="space-y-4">
                            {eventData.schedule.map((item) => (
                                <div
                                    key={item.datetime}
                                    className="border border-gray-700 rounded-lg overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        className="w-full text-left bg-gray-800 p-4 flex justify-between items-center cursor-pointer"
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
                                        <div className="p-4 bg-[#2a2a2a] space-y-3">
                                            {item.tiers.map((tier) => (
                                                <div
                                                    key={tier.name}
                                                    className="flex justify-between items-center border-b border-gray-700 pb-2"
                                                >
                                                    <p className="text-gray-300">
                                                        {tier.name}
                                                    </p>
                                                    <p className="font-bold text-green-400">
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
                                <Link
                                    to={`/event/${String(show.id)}`}
                                    key={show.id}
                                    className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg group block"
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
                    <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg lg:sticky lg:top-8">
                        <h1 className="text-2xl font-bold mb-4">
                            {eventData.title}
                        </h1>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-green-400" />
                                <span>
                                    {formatEventDate(
                                        eventData.schedule[0].datetime,
                                    )}
                                </span>
                            </div>

                            {/* location data */}
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-green-400 mt-1" />
                                <span>
                                    {eventData.location.name}
                                    <br />
                                    {eventData.location.address}
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 my-6"></div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400">Giá từ</span>
                            <span className="text-2xl font-bold text-green-400">
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

export default TicketDetailsPage;
