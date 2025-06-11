import { useState, useRef } from "react";

interface ClickSeatMapConfig {
    venueSize: {
        rowCount: number;
        colCount: number;
    };
    seatTypes: {
        colorCode: string;
        tierID: number;
        startPos: [number, number];
        endPos: [number, number];
    }[];
    bookedSeats: [number, number][];
    configuredSeats: {
        startPos: [number, number];
        endPos: [number, number];
    };
}

/**
 * SeatMap create a grid of selectable seats.
 *
 * User can click to select a single seat, or drag to select a rectangular group. By default, all seats start in the deselected state.
 *
 * @example
 * <SeatMap rowCount={5} colCount={5} />
 */
export const ClickSeatMap = ({
    venueSize,
    seatTypes,
    bookedSeats,
    configuredSeats,
}: ClickSeatMapConfig) => {
    const seatRefs = useRef<(HTMLElement | null)[]>([]);
    const [selectedSeat, setSelectedSeats] = useState<number[]>([]);

    const isSeatSelected = (row: number, col: number) => {
        return selectedSeat.includes(row * venueSize.colCount + col);
    };

    const handleSeatMouseUp = (row: number, col: number) => {
        if (!isSeatEnabled(row, col)) return;

        for (const bookedSeat of bookedSeats) {
            if (row == bookedSeat[0] && col == bookedSeat[1]) {
                return;
            }
        }

        const newSelectedSeat = [...selectedSeat];

        for (const selectedSeat of newSelectedSeat) {
            if (selectedSeat == row * venueSize.colCount + col) {
                newSelectedSeat.splice(
                    newSelectedSeat.indexOf(selectedSeat),
                    1,
                );
                setSelectedSeats(newSelectedSeat);
                return;
            }
        }

        newSelectedSeat.push(row * venueSize.colCount + col);
        setSelectedSeats(newSelectedSeat);
    };

    const getSeatColor = (row: number, col: number): string => {
        if (!isSeatEnabled(row, col)) {
            return "bg-gray-200";
        }

        for (const bookedSeat of bookedSeats) {
            if (row == bookedSeat[0] && col == bookedSeat[1]) {
                return "bg-red-200";
            }
        }

        if (isSeatSelected(row, col)) {
            return "bg-green-200";
        }

        for (const seatType of seatTypes) {
            if (
                row >= seatType.startPos[0] &&
                row <= seatType.endPos[0] &&
                col >= seatType.startPos[1] &&
                col <= seatType.endPos[1]
            ) {
                return seatType.colorCode;
            }
        }

        return "bg-white-200";
    };

    const isSeatEnabled = (row: number, col: number): boolean => {
        if (
            row >= configuredSeats.startPos[0] &&
            row <= configuredSeats.endPos[0] &&
            col >= configuredSeats.startPos[1] &&
            col <= configuredSeats.endPos[1]
        ) {
            return true;
        }

        return false;
    };

    return (
        <div
            className="inline-block border border-gray-300 select-none"
            role="group"
            aria-label="seat-map"
        >
            {Array.from({ length: venueSize.rowCount }).map((_, row) => (
                <div className="flex" key={row}>
                    {Array.from({ length: venueSize.colCount }).map(
                        (_, col) => (
                            // no keyboard interaction planned also for this element.
                            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                            <div
                                key={row * venueSize.colCount + col}
                                ref={(el) => {
                                    seatRefs.current[
                                        row * venueSize.colCount + col
                                    ] = el;
                                }}
                                className={`w-[30px] h-[30px] m-[2px] border border-gray-300 ${getSeatColor(row, col)}`}
                                onMouseUp={() => {
                                    handleSeatMouseUp(row, col);
                                }}
                                aria-label={`Seat ${row.toString()}-${col.toString()}`}
                                aria-selected={
                                    isSeatSelected(row, col) ? "true" : "false"
                                }
                            />
                        ),
                    )}
                </div>
            ))}
        </div>
    );
};
