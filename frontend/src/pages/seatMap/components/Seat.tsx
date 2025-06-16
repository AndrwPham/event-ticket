import { FC } from "react";
import { ISeat } from "../../../types";

interface SeatProps {
    x: number;
    y: number;
    size: number;
    data: ISeat;
    isSelected: boolean;
    onClick: () => void;
}

const Seat: FC<SeatProps> = ({ x, y, size, data, isSelected, onClick }) => {
    const getFillColor = () => {
        if (data.status === "sold") return "#A0AEC0"; // Gray for sold
        if (isSelected) return "#4299E1"; // Blue for selected
        if (data.tier === "Seated VIP") return "#C53030"; // Red for VIP
        if (data.tier === "Seated A") return "#2F855A"; // Green for Standard
        return "#CBD5E0";
    };

    return (
        <g
            onClick={data.status === "available" ? onClick : undefined}
            className={
                data.status === "available"
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
            }
        >
            <rect
                x={x}
                y={y}
                width={size}
                height={size}
                fill={getFillColor()}
                rx="4"
                className="transition-all duration-200 hover:opacity-80"
            />
            <text
                x={x + size / 2}
                y={y + size / 2}
                textAnchor="middle"
                dy=".3em"
                fill="white"
                fontSize="10"
                className="pointer-events-none font-semibold"
            >
                {data.id}
            </text>
            <title>{`${data.tier} - Seat ${data.id} - ${data.price.toLocaleString()}đ - ${data.status}`}</title>
        </g>
    );
};

export default Seat;
