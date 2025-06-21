import { useState } from "react";
import { SeatCell } from "./venue-config";

interface SeatMapConfig {
    layout: SeatCell[][];
    setSelectedSeatStartId: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedSeatEndId: React.Dispatch<React.SetStateAction<string | null>>;
    setHasSelectionChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SeatMap = ({
    layout,
    setSelectedSeatStartId,
    setSelectedSeatEndId,
    setHasSelectionChanged,
}: SeatMapConfig) => {
    const [isPointerInGrid, setIsPointerInGrid] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectionStart, setSelectionStart] = useState<
        [number, number] | null
    >(null);
    const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

    // Helper to check if a cell at [r][c] is a seat
    const isSeatCell = (cell: SeatCell) =>
        cell.type === "seat" && !!cell.seatId;

    // Mark the start of selection
    const handleMouseDown = (row: number, col: number) => {
        if (!isPointerInGrid) return;
        if (!isSeatCell(layout[row][col])) return;
        setIsMouseDown(true);
        setSelectionStart([row, col]);
    };

    // Extand the end of selection, making sure that we have top-bottom order.
    const handleMouseEnter = (row: number, col: number) => {
        if (!isPointerInGrid || !isMouseDown || !selectionStart) return;

        const [startRow, startCol] = selectionStart;
        const rowMin = Math.min(startRow, row);
        const rowMax = Math.max(startRow, row);
        const colMin = Math.min(startCol, col);
        const colMax = Math.max(startCol, col);

        const newSelectedIds: string[] = [];

        for (let r = rowMin; r <= rowMax; r++) {
            for (let c = colMin; c <= colMax; c++) {
                const cell = layout[r][c];
                if (isSeatCell(cell) && cell.seatId) {
                    newSelectedIds.push(cell.seatId);
                }
            }
        }

        setSelectedSeatIds(newSelectedIds);

        // Optionally, pass the seat IDs of the corners
        setSelectedSeatStartId(layout[rowMin][colMin]?.seatId ?? null);
        setSelectedSeatEndId(layout[rowMax][colMax]?.seatId ?? null);
        setHasSelectionChanged(true);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setSelectionStart(null);
    };

    const isSeatSelected = (seatId: string | undefined): boolean => {
        if (seatId) {
            return selectedSeatIds.includes(seatId);
        }
        return false;
    };

    return (
        // no keyboard interaction planned for this element.
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div
            className="inline-block border border-gray-300 select-none"
            onMouseEnter={() => {
                setIsPointerInGrid(true);
            }}
            onMouseLeave={() => {
                setIsPointerInGrid(false);
                setIsMouseDown(false);
            }}
            onMouseUp={handleMouseUp}
            role="group"
            aria-label="seat-map"
        >
            {layout.map((rowArr, rowIdx) => (
                <div className="flex" key={rowIdx}>
                    {rowArr.map((cell, colIdx) => {
                        if (cell.type === "seat") {
                            return (
                                // no keyboard interaction planned for this element.
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <div
                                    key={cell.seatId}
                                    className={`w-[30px] h-[30px] m-[2px] border border-gray-300 cursor-pointer ${isSeatSelected(cell.seatId) ? "bg-green-500" : "bg-gray-200"}`}
                                    onMouseDown={() => {
                                        handleMouseDown(rowIdx, colIdx);
                                    }}
                                    onMouseEnter={() => {
                                        handleMouseEnter(rowIdx, colIdx);
                                    }}
                                    aria-label={`Seat ${cell.seatId ?? "unknown"}`}
                                    aria-selected={
                                        isSeatSelected(cell.seatId)
                                            ? "true"
                                            : "false"
                                    }
                                />
                            );
                        }
                        // Render non-seat types differently
                        if (cell.type === "aisle") {
                            return (
                                <div
                                    key={colIdx}
                                    className="w-[30px] h-[30px] m-[2px] bg-yellow-100"
                                />
                            );
                        }
                        if (cell.type === "stage") {
                            return (
                                <div
                                    key={colIdx}
                                    className="w-[30px] h-[30px] m-[2px] bg-purple-300"
                                />
                            );
                        }
                        // Empty or unknown
                        return (
                            <div
                                key={colIdx}
                                className="w-[30px] h-[30px] m-[2px] bg-white"
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
