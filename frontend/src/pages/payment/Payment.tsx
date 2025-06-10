import { FC, useState, useEffect } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCreditCard,
    FaRegCheckCircle,
} from "react-icons/fa";
import { IoWallet } from "react-icons/io5";

// Mock Data
const eventDetails = {
    name: "Hài Kịch: Náo Loạn Tiếu Lâm Đường",
    date: "Thứ Sáu, 27 Tháng 9, 2024",
    time: "8:00 PM",
    location: "Nhà hát Thanh Niên",
};

const orderDetails = {
    tickets: [
        { type: "VÉ TIÊU CHUẨN", quantity: 2, price: 300000 },
        { type: "VÉ VIP", quantity: 1, price: 500000 },
    ],
    processingFee: 35000,
};

const PaymentPage: FC = () => {
    const [timeLeft, setTimeLeft] = useState(600);

    const [buyerInfo, setBuyerInfo] = useState({
        fullName: "",
        email: "",
        phone: "",
    });

    const [paymentMethod, setPaymentMethod] = useState("momo");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (timeLeft === 0) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // Clear interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBuyerInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Calculate totals
    const subtotal = orderDetails.tickets.reduce(
        (acc, ticket) => acc + ticket.price * ticket.quantity,
        0,
    );
    const totalAmount = subtotal + orderDetails.processingFee;

    const isFormValid =
        buyerInfo.fullName &&
        buyerInfo.email &&
        buyerInfo.phone &&
        agreedToTerms;

    return (
        <div className="bg-gray-100 py-8">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Countdown Timer */}
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-semibold text-gray-700">
                            Thời gian giữ vé
                        </h2>
                        <p className="text-4xl font-bold text-indigo-600 mt-2">
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                        </p>
                    </div>

                    {/* Buyer Information */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-darkBlue mb-4">
                            Thông tin người mua
                        </h2>
                        <form className="space-y-4">
                            <div className="relative">
                                <FaUser className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và Tên"
                                    value={buyerInfo.fullName}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }} // ESLINT FIX 1
                                    className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={buyerInfo.email}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }} // ESLINT FIX 1
                                    className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaPhone className="absolute top-3 left-3 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    value={buyerInfo.phone}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                    }} // ESLINT FIX 1
                                    className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </form>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-darkBlue mb-4">
                            Chọn phương thức thanh toán
                        </h2>
                        <div className="space-y-3">
                            <label
                                className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "momo" ? "border-indigo-600 ring-2 ring-indigo-600" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="momo"
                                    checked={paymentMethod === "momo"}
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                    }}
                                    className="hidden"
                                />{" "}
                                {/* ESLINT FIX 1 */}
                                <IoWallet className="text-2xl text-pink-600 mr-4" />
                                <span className="font-semibold">
                                    Ví điện tử
                                </span>
                                <FaRegCheckCircle
                                    className={`ml-auto text-xl ${paymentMethod === "momo" ? "text-indigo-600" : "text-gray-300"}`}
                                />
                            </label>
                            <label
                                className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === "card" ? "border-indigo-600 ring-2 ring-indigo-600" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="card"
                                    checked={paymentMethod === "card"}
                                    onChange={(e) => {
                                        setPaymentMethod(e.target.value);
                                    }}
                                    className="hidden"
                                />{" "}
                                {/* ESLINT FIX 1 */}
                                <FaCreditCard className="text-2xl text-gray-500 mr-4" />
                                <span className="font-semibold">
                                    Thẻ tín dụng / Ghi nợ
                                </span>
                                <FaRegCheckCircle
                                    className={`ml-auto text-xl ${paymentMethod === "card" ? "text-indigo-600" : "text-gray-300"}`}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-8">
                        <h2 className="text-xl font-bold text-darkBlue border-b pb-4 mb-4">
                            Tóm tắt đơn hàng
                        </h2>

                        <div className="space-y-2 mb-4">
                            <h3 className="font-semibold">
                                {eventDetails.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {eventDetails.date} - {eventDetails.time}
                            </p>
                            <p className="text-sm text-gray-600">
                                {eventDetails.location}
                            </p>
                        </div>

                        <div className="border-t border-b py-4 space-y-2">
                            {orderDetails.tickets.map((ticket) => (
                                <div
                                    key={ticket.type}
                                    className="flex justify-between text-sm"
                                >
                                    <span>
                                        {ticket.quantity}x {ticket.type}
                                    </span>
                                    <span className="font-semibold">
                                        {new Intl.NumberFormat("vi-VN").format(
                                            ticket.price * ticket.quantity,
                                        )}
                                        đ
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="py-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tổng cộng</span>
                                <span>
                                    {new Intl.NumberFormat("vi-VN").format(
                                        subtotal,
                                    )}
                                    đ
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Phí xử lý</span>
                                <span>
                                    {new Intl.NumberFormat("vi-VN").format(
                                        orderDetails.processingFee,
                                    )}
                                    đ
                                </span>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center font-bold text-lg">
                                <span>Thành tiền</span>
                                <span>
                                    {new Intl.NumberFormat("vi-VN").format(
                                        totalAmount,
                                    )}
                                    đ
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="flex items-start text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={() => {
                                        setAgreedToTerms(!agreedToTerms);
                                    }}
                                    className="mt-1 mr-2 h-4 w-4 accent-indigo-600"
                                />{" "}
                                {/* ESLINT FIX 1 */}
                                <span>
                                    Tôi đồng ý với các{" "}
                                    <a
                                        href="/terms-and-conditions"
                                        className="text-indigo-600 hover:underline"
                                    >
                                        điều khoản và điều kiện
                                    </a>{" "}
                                    của nhà tổ chức.
                                </span>{" "}
                                {/* ESLINT FIX 2 */}
                            </label>
                        </div>

                        <button
                            disabled={!isFormValid}
                            className={`w-full mt-4 py-3 rounded-lg text-white font-bold text-lg transition ${isFormValid ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            Thanh Toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
