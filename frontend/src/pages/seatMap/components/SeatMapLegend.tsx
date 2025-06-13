import { FC } from "react";

const LegendItem: FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center space-x-2">
        <div
            className="w-5 h-5 rounded"
            style={{ backgroundColor: color }}
        ></div>
        <span>{label}</span>
    </div>
);

const SeatMapLegend: FC = () => {
    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md flex flex-wrap gap-4 justify-center">
            <LegendItem color="#C53030" label="VIP" />
            <LegendItem color="#2F855A" label="Standard" />
            <LegendItem color="#4299E1" label="Selected" />
            <LegendItem color="#A0AEC0" label="Sold" />
        </div>
    );
};

export default SeatMapLegend;
