import { FC } from "react";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

interface BuyerInfoFormProps {
    buyerInfo: {
        fullName: string;
        email: string;
        phone: string;
    };
    onInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BuyerInfoForm: FC<BuyerInfoFormProps> = ({ buyerInfo, onInfoChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
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
                        onChange={onInfoChange}
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
                        onChange={onInfoChange}
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
                        onChange={onInfoChange}
                        className="w-full pl-10 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </form>
        </div>
    );
};

export default BuyerInfoForm;
