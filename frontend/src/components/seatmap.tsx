import { useState, useRef } from 'react';
import './seatmap.css';

interface SeatMapProperties {
    rowCount: number;
    colCount: number;
}

/**
 * SeatMap create a grid of selectable seats.
 * 
 * User can click to select a single seat, or drag to select a rectangular group. By default, all seat start in the deselected state.
 *
 * @example
 * <SeatMap rowCount={5} colCount={5} />
 */
const SeatMap = ({ rowCount, colCount }: SeatMapProperties) => {
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
        // selecting, but I digress.
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
            className='seat-grid'
            onMouseEnter={handleMouseEnterGrid}
            onMouseLeave={handleMouseLeaveGrid}
            onMouseUp={handleMouseUp}
        >
            {Array.from({ length: rowCount }).map((_, row) => (
                <div className='seat-row' key={row}>
                    {Array.from({ length: colCount }).map((_, col) => (
                        <div
                            key={row * colCount + col}
                            ref={(el) => {
                                seatRefs.current[row * colCount + col] = el;
                            }}
                            className={`seat ${isSeatSelected(row, col) ? 'selected' : ''}`}
                            onMouseDown={() => handleMouseDown(row, col)}
                            onMouseEnter={() => handleMouseEnter(row, col)}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}

export default SeatMap;
