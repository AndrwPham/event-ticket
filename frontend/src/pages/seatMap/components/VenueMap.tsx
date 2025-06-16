import { FC } from "react";
import { LayoutCell, ISeat } from "../../../types";
import Seat from "./Seat";

interface VenueMapProps {
    layout: LayoutCell[][];
    seats: { [seatId: string]: ISeat };
    selectedSeats: ISeat[];
    onSeatClick: (seat: ISeat) => void;
}

const VenueMap: FC<VenueMapProps> = ({
    layout,
    seats,
    selectedSeats,
    onSeatClick,
}) => {
    const SEAT_SIZE = 25;
    const SEAT_SPACING = 5;
    const AISLE_SIZE = 20;

    let x = 0;
    let y = 0;
    let maxWidth = 0;

    const elements = layout.flatMap((row, rowIndex) => {
        x = 0;
        const rowElements = row.map((cell, cellIndex) => {
            const key = `cell-${String(rowIndex)}-${String(cellIndex)}`;

            switch (cell.type) {
                case "seat":
                    // FIX 1: Use the 'in' operator for a more robust property check.
                    if (!(cell.seatId in seats)) {
                        return null;
                    }
                    const seatData = seats[cell.seatId];

                    const isSelected = selectedSeats.some(
                        (s) => s.id === seatData.id,
                    );
                    const currentX = x;
                    x += SEAT_SIZE + SEAT_SPACING;
                    return (
                        <Seat
                            key={key}
                            x={currentX}
                            y={y}
                            size={SEAT_SIZE}
                            data={seatData}
                            isSelected={isSelected}
                            onClick={() => {
                                onSeatClick(seatData);
                            }}
                        />
                    );
                case "aisle":
                    x += AISLE_SIZE;
                    return null;
                case "stage":
                case "lectern":
                    const stageX = x;
                    x += SEAT_SIZE + SEAT_SPACING;
                    return (
                        <rect
                            key={key}
                            x={stageX}
                            y={y}
                            width={SEAT_SIZE}
                            height={SEAT_SIZE / 2}
                            fill="#888"
                            rx="3"
                        />
                    );
                case "empty":
                default:
                    x += SEAT_SIZE + SEAT_SPACING;
                    return null;
            }
        });
        if (x > maxWidth) maxWidth = x;
        y += SEAT_SIZE + SEAT_SPACING;
        return rowElements;
    });

    return (
        <div className="w-full overflow-x-auto">
            <svg
                width={maxWidth}
                height={y}
                viewBox={`0 0 ${String(maxWidth)} ${String(y)}`}
                aria-label="Venue Seat Map"
            >
                {elements}
            </svg>
        </div>
    );
};

export default VenueMap;
