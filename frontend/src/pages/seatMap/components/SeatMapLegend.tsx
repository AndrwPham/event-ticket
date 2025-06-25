import { FC } from "react";

interface LegendItemProps {
    color: string;
    label: string;
}

const LegendItem: FC<LegendItemProps> = ({ color, label }) => (
    <div className="flex items-center space-x-2">
        <div
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: color }}
        ></div>
        <span>{label}</span>
    </div>
);

interface SeatMapLegendProps {
    // It now expects an array of seat class configurations
    seatClasses: { name: string; color: string }[];
}

const SeatMapLegend: FC<SeatMapLegendProps> = ({ seatClasses }) => {
    return (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {seatClasses.map((seatClass) => (
                <LegendItem
                    key={seatClass.name}
                    color={seatClass.color}
                    label={seatClass.name}
                />
            ))}
            <LegendItem color="#3B82F6" label="Selected" />{" "}

        </div>
    );
};

export default SeatMapLegend;
