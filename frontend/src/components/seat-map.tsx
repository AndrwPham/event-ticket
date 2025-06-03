import { useState, useRef } from 'react';

interface SeatMapProperties {
    rowCount: number;
    colCount: number;

    /**
     * These function set the parent's seat coordinate state.
     * 
     * Why not share with the children? The user can select from any angle,
     * so the start/end position might be inverted. We want consistant
     * start/end coordinate, so it is set separately.
     */
    setSelectedSeatStartCoord: React.Dispatch<React.SetStateAction<[number, number] | null>>;
    setSelectedSeatEndCoord: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

/**
 * SeatMap create a grid of selectable seats.
 * 
 * User can click to select a single seat, or drag to select a rectangular group. By default, all seats start in the deselected state.
 *
 * @example
 * <SeatMap rowCount={5} colCount={5} />
 */
export const SeatMap = ({ rowCount, colCount, setSelectedSeatStartCoord, setSelectedSeatEndCoord }: SeatMapProperties) => {
    const [isPointerInGrid, setIsPointerInGrid] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectionStartCoordinate, setSelectionStartCoordinate] = useState<[number, number] | null>(null);
    const seatRefs = useRef<(HTMLElement | null)[]>([]);
    const [selectedSeat, setSelectedSeats] = useState<number[]>([])

    const handleMouseEnterGrid = () => {
        setIsPointerInGrid(true);
    }

    const handleMouseLeaveGrid = () => {
        setIsPointerInGrid(false);

        // this is debatable - one could argue that the UX would be better
        // if the user were to "accidentally" leave the grid could continue
        // selecting.
        setIsMouseDown(false);
    }

    const handleMouseDown = (row: number, col: number) => {
        if (!isPointerInGrid) { return; }

        setIsMouseDown(true);
        setSelectionStartCoordinate([row, col]);
    }

    const handleMouseEnter = (row: number, col: number) => {
        if (!isPointerInGrid) { return; }
        if (!isMouseDown) { return; }
        // just in case
        if (selectionStartCoordinate == null) { return; }

        const startRow = Math.min(selectionStartCoordinate[0], row);
        const endRow = Math.max(selectionStartCoordinate[0], row);
        const startCol = Math.min(selectionStartCoordinate[1], col);
        const endCol = Math.max(selectionStartCoordinate[1], col);

        const newSelected = [];

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                newSelected.push(r * colCount + c);
            }
        }

        setSelectedSeats(newSelected);
        setSelectedSeatStartCoord([startRow, startCol]);
        setSelectedSeatEndCoord([endRow, endCol]);
    }

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setSelectionStartCoordinate(null);
    }

    const isSeatSelected = (row: number, col: number) => {
        return selectedSeat.includes(row * colCount + col);
    }

    return (
        <div
            className='inline-block border border-gray-300 select-none'
            onMouseEnter={handleMouseEnterGrid}
            onMouseLeave={handleMouseLeaveGrid}
            onMouseUp={handleMouseUp}
        >
            {Array.from({ length: rowCount }).map((_, row) => (
                <div className='flex' key={row}>
                    {Array.from({ length: colCount }).map((_, col) => (
                        <div
                            key={row * colCount + col}
                            ref={(el) => {
                                seatRefs.current[row * colCount + col] = el;
                            }}
                            className={`w-[30px] h-[30px] m-[2px] border border-gray-300 ${isSeatSelected(row, col) ? 'bg-green-500' : ' bg-gray-200'}`}
                            onMouseDown={() => handleMouseDown(row, col)}
                            onMouseEnter={() => handleMouseEnter(row, col)}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
