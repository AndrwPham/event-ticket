import { FC } from "react";

interface SeatProps {
    seatId?: string;
    status: "UNAVAILABLE" | "AVAILABLE" | "HELD" | "PAID" | "SOLD";
    color?: string;
    isSelected: boolean;
    onClick: () => void;
}

const Seat: FC<SeatProps> = ({
    status,
    color,
    isSelected,
    onClick,
    seatId,
}) => {
    const getSeatClasses = () => {
        const baseClasses =
            "w-8 h-8 flex items-center justify-center rounded font-bold text-white text-xs transition-all duration-200";

        if (
            status === "UNAVAILABLE" ||
            status === "SOLD" ||
            status === "PAID" ||
            status === "HELD"
        ) {
            return `${baseClasses} bg-gray-400 cursor-not-allowed`;
        }

        if (isSelected) {
            return `${baseClasses} bg-blue-500 ring-2 ring-blue-300 cursor-pointer`;
        }

        return `${baseClasses} cursor-pointer hover:opacity-80`;
    };

    const getSeatStyle = () => {
        if (status === "AVAILABLE" && !isSelected) {
            return { backgroundColor: color || "#A0AEC0" };
        }
        return {};
    };

    return (
        <button
            type="button"
            disabled={status !== "AVAILABLE"}
            onClick={onClick}
            className={getSeatClasses()}
            style={getSeatStyle()}
            title={`Seat ${String(seatId)} - Status: ${status}`}
        >
            {seatId}
        </button>
    );
};

export default Seat;
