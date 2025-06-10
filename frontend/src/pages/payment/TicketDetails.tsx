// src/pages/TicketDetailsPage.tsx

import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoChevronDown, IoChevronForward } from "react-icons/io5";

// --- MOCK DATA ---
const showData = {
    id: 1, // Added ID for potential future use
    title: "Hài Kịch: Náo Loạn Tiếu Lâm Đường",
    organizer: "Nhà hát Thanh Niên",
    posterUrl: "/image_d4e69a.jpg",
    description:
        "Một vở hài kịch đặc sắc với sự tham gia của các nghệ sĩ hàng đầu, hứa hẹn mang lại những tràng cười sảng khoái và những giây phút giải trí khó quên. Vở kịch xoay quanh những tình huống dở khóc dở cười tại một võ đường, nơi các môn sinh và sư phụ liên tục gây ra những chuyện náo loạn.",
    artists: [
        "Hoài Linh",
        "Trường Giang",
        "Trấn Thành",
        "Thu Trang",
        "Tiến Luật",
        "Nam Thư",
    ],
    startingPrice: 250000,
    location: {
        name: "Nhà hát Thanh Niên",
        address:
            "Số 4 Phạm Ngọc Thạch, Phường Bến Nghé, Quận 1, Thành Phố Hồ Chí Minh",
    },
    schedule: [
        {
            date: "13 Tháng 06, 2025",
            time: "19:00 - 22:00",
            tiers: [
                {
                    name: "Hạng VIP (không dành cho trẻ em dưới 16t)",
                    price: 300000,
                },
                {
                    name: "Hạng thường (không dành cho trẻ em dưới 16t)",
                    price: 250000,
                },
            ],
        },
        {
            date: "21 Tháng 06, 2025",
            time: "20:00 - 23:00",
            tiers: [
                {
                    name: "Hạng VIP (không dành cho trẻ em dưới 16t)",
                    price: 320000,
                },
                {
                    name: "Hạng thường (không dành cho trẻ em dưới 16t)",
                    price: 270000,
                },
            ],
        },
    ],
};

const recommendedShows = [
    {
        id: 1,
        title: "Đại Nhạc Kịch Mùa Hè",
        posterUrl: "https://via.placeholder.com/300x400?text=Show+1",
    },
    {
        id: 2,
        title: "Liveshow Ca Sĩ Nổi Tiếng",
        posterUrl: "https://via.placeholder.com/300x400?text=Show+2",
    },
    {
        id: 3,
        title: "Kịch Cổ Điển: Đêm Trắng",
        posterUrl: "https://via.placeholder.com/300x400?text=Show+3",
    },
];
// --- END MOCK DATA ---

const TicketDetailsPage: FC = () => {
    const { id } = useParams();
    console.log("Displaying event with ID:", id);

    const [expandedDate, setExpandedDate] = useState<string | null>(
        showData.schedule[0].date,
    );

    const toggleDate = (date: string) => {
        setExpandedDate(expandedDate === date ? null : date);
    };

    return (
        <div className="bg-[#1a1a1a] text-white">
            <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* --- LEFT COLUMN: Main Content --- */}
                <div className="lg:col-span-2 space-y-10">
                    <img
                        src={showData.posterUrl}
                        alt={showData.title}
                        className="w-full rounded-lg shadow-lg"
                    />

                    <div className="bg-[#2a2a2a] p-6 rounded-lg">
                        <h2 className="text-2xl font-bold mb-4">Giới thiệu</h2>
                        <p className="text-gray-300 mb-6">
                            {showData.description}
                        </p>
                        <h3 className="text-xl font-semibold mb-3">
                            Nghệ sĩ tham gia
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {showData.artists.map((artist) => (
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
                            {showData.schedule.map((item) => (
                                <div
                                    key={item.date}
                                    className="border border-gray-700 rounded-lg overflow-hidden"
                                >
                                    {/* ACCESSIBILITY FIX: Replaced clickable div with a button */}
                                    <button
                                        type="button"
                                        className="w-full text-left bg-gray-800 p-4 flex justify-between items-center cursor-pointer"
                                        onClick={() => {
                                            toggleDate(item.date);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            {expandedDate === item.date ? (
                                                <IoChevronDown />
                                            ) : (
                                                <IoChevronForward />
                                            )}
                                            <span className="font-semibold">
                                                {item.time}, {item.date}
                                            </span>
                                        </div>
                                        <Link
                                            to="/payment"
                                            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-green-600 transition z-10 relative"
                                        >
                                            Mua vé ngay
                                        </Link>
                                    </button>
                                    {expandedDate === item.date && (
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
                                <div
                                    key={show.id}
                                    className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg group"
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: Sticky Ticket Sidebar --- */}
                <div className="lg:col-span-1">
                    <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-lg lg:sticky lg:top-8">
                        <h1 className="text-2xl font-bold mb-4">
                            {showData.title}
                        </h1>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-center gap-3">
                                <FaCalendarAlt className="text-green-400" />
                                <span>
                                    {showData.schedule[0].time},{" "}
                                    {showData.schedule[0].date}
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-green-400 mt-1" />
                                <span>
                                    {showData.location.name}
                                    <br />
                                    {showData.location.address}
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 my-6"></div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400">Giá từ</span>
                            <span className="text-2xl font-bold text-green-400">
                                {new Intl.NumberFormat("vi-VN").format(
                                    showData.startingPrice,
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
