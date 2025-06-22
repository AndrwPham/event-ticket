import { useState } from "react";

interface SeatCell {
    type: "seat" | "aisle" | "empty" | "stage";
    seatId?: string;
}

interface Venue {
    id: number;
    name: string;
    layout: SeatCell[][];
}

interface VenueList {
    venueList: Venue[];
}

/**
 * Venue Configuration Component
 *
 * This component expects a list of possible venues and their standard configurations.
 * It allows the event organizer to modify the standard venue configuration with seat types:
 *
 * - Unavailable: The seat cannot be booked.
 * - Available:
 *   - Standard seat: All available seats start at this tier.
 *   - Tiered seat: Special seat class defined by the event organizer.
 *
 * TODO: Implement the ability to switch seat tiers.
 *
 * @example
 * <VenueConfig
 *   venueList={[
 *     {
 *       id: 1,
 *       name: "Standard Auditorium",
 *       layout: [
 *         [{ type: 'stage' }, { type: 'stage' }, { type: 'stage' }],
 *         [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
 *         [{ type: 'seat', seatId: 'A1' }, { type: 'aisle' }, { type: 'seat', seatId: 'A2' }],
 *         [{ type: 'seat', seatId: 'B1' }, { type: 'aisle' }, { type: 'seat', seatId: 'B2' }],
 *         [{ type: 'seat', seatId: 'C1' }, { type: 'aisle' }, { type: 'seat', seatId: 'C2' }],
 *         [{ type: 'seat', seatId: 'D1' }, { type: 'aisle' }, { type: 'seat', seatId: 'D2' }]
 *       ]
 *     }
 *   ]}
 * />
 *
 * @author LunaciaDev
 */
export const VenueConfig = ({ venueList }: VenueList) => {
    const [selectedVenue, setSelectedVenue] = useState(venueList[0].id);
    const [venueLayout, setVenueLayout] = useState(venueList[0].layout);
    const [selectedSeatStartId, setSelectedSeatStartId] = useState<
        string | null
    >(null);
    const [selectedSeatEndId, setSelectedSeatEndId] = useState<string | null>(
        null,
    );
    const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

    const handleSelectedVenueChange = (venueID: number) => {
        const venue = venueList.find((v) => v.id === venueID);
        if (venue) {
            setSelectedVenue(venue.id);
            setVenueLayout(venue.layout);
            setHasSelectionChanged(true);

            // reset the selected seats.
            setSelectedSeatStartId(null);
            setSelectedSeatEndId(null);
        }
    };

    return (
        <div className="seat-config">
            <h1>Venue Configuration</h1>
            <h2>Select Venue:</h2>
            <VenueButtonGroup
                venues={venueList}
                selectedVenueID={selectedVenue}
                setSelectedVenue={handleSelectedVenueChange}
            />
            <h2>Configure Venue Seat Map:</h2>
            <SeatMap
                key={selectedVenue}
                layout={venueLayout}
                setSelectedSeatStartId={setSelectedSeatStartId}
                setSelectedSeatEndId={setSelectedSeatEndId}
                setHasSelectionChanged={setHasSelectionChanged}
            />
            <SendSeatmapButton
                selectedSeatStartId={selectedSeatStartId}
                selectedSeatEndId={selectedSeatEndId}
                selectedVenueID={selectedVenue}
                hasSelectionChanged={hasSelectionChanged}
                setHasSelectionChanged={setHasSelectionChanged}
            />
        </div>
    );
};

interface SeatMapConfig {
    layout: SeatCell[][];
    setSelectedSeatStartId: React.Dispatch<React.SetStateAction<string | null>>;
    setSelectedSeatEndId: React.Dispatch<React.SetStateAction<string | null>>;
    setHasSelectionChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const SeatMap = ({
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

interface VenueButtonGroupConfiguration {
    venues: Venue[];
    selectedVenueID: number;

    /**
     * Event handler from parent component.
     *
     * This is meant to be passed into the child buttons.
     */
    setSelectedVenue: (venueID: number) => void;
}

/**
 * Create a set of venue buttons.
 *
 * The first venue will automatically be the selected one.
 * TODO: add action that allow selecting a default venue
 *
 * @author LunaciaDev
 */
const VenueButtonGroup = ({
    venues,
    selectedVenueID,
    setSelectedVenue,
}: VenueButtonGroupConfiguration) => {
    return (
        <div className="flex gap-[10px] m-[10px]">
            {Array.from(venues).map((venue) => {
                return (
                    <VenueButton
                        key={venue.id}
                        venueName={venue.name}
                        venueID={venue.id}
                        selectedVenueID={selectedVenueID}
                        setSelectedVenue={setSelectedVenue}
                    />
                );
            })}
        </div>
    );
};

interface VenueButtonConfiguration {
    venueName: string;
    venueID: number;
    selectedVenueID: number | null;

    /**
     * Event handler from parent component.
     *
     * @param venueID The name of the venue represented by the button
     */
    setSelectedVenue: (venueID: number) => void;
}

/**
 * Button to select a venue.
 *
 * This is not meant to be used by itself - please use VenueButtonGroup.
 *
 * @author LunaciaDev
 */
const VenueButton = ({
    venueName,
    venueID,
    selectedVenueID,
    setSelectedVenue,
}: VenueButtonConfiguration) => {
    const handleMouseUp = () => {
        setSelectedVenue(venueID);
    };

    return (
        <button
            className={`p-[5px] rounded ${selectedVenueID === venueID ? "bg-blue-200" : "bg-white "}`}
            onMouseUp={handleMouseUp}
        >
            <img
                className="rounded"
                src="https://placehold.co/250x150"
                alt={venueName}
            />
            <div className="mt-[5px] text-black"> {venueName} </div>
        </button>
    );
};

interface SendSeatmapButtonConfig {
    selectedSeatStartId: string | null;
    selectedSeatEndId: string | null;
    selectedVenueID: number;
    hasSelectionChanged: boolean;
    setHasSelectionChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Send Seatmap button.
 *
 * @author LunaciaDev
 */
export const SendSeatmapButton = ({
    selectedSeatStartId,
    selectedSeatEndId,
    selectedVenueID,
    hasSelectionChanged,
    setHasSelectionChanged,
}: SendSeatmapButtonConfig) => {
    const state = Object.freeze({
        READY: 1,
        IN_PROGRESS: 2,
        SAVE_FAILED: 3,
        SAVE_SUCCESS: 4,
    });

    const [currentState, setCurrentState] = useState<number>(state.READY);

    const handleMouseUp = () => {
        switch (currentState) {
            case state.READY: {
                setCurrentState(state.IN_PROGRESS);
                setHasSelectionChanged(false);
                postSeatmapConfig().then(
                    () => {},
                    () => {},
                );
                break;
            }
        }
    };

    const postSeatmapConfig = async () => {
        try {
            if (selectedSeatStartId === null || selectedSeatEndId === null) {
                return;
            }

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const response = await fetch("https://localhost:5000/api/data", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    SeatmapStartId: selectedSeatStartId,
                    SeatmapEndId: selectedSeatEndId,
                    VenueID: selectedVenueID,
                }),
            });

            if (!response.ok) {
                setCurrentState(state.SAVE_FAILED);
                setTimeout(() => {
                    setCurrentState(state.READY);
                    setHasSelectionChanged(true);
                }, 1500);
                return;
            }

            setCurrentState(state.SAVE_SUCCESS);
            setTimeout(() => {
                setCurrentState(state.READY);
                setHasSelectionChanged(false);
            }, 1500);
        } catch {
            setCurrentState(state.SAVE_FAILED);
            setTimeout(() => {
                setCurrentState(state.READY);
                setHasSelectionChanged(true);
            }, 1500);
        }
    };

    const getButtonText = (): string => {
        switch (currentState) {
            case state.IN_PROGRESS:
                return "Saving...";
            case state.SAVE_FAILED:
                return "Save Failed";
            case state.SAVE_SUCCESS:
                return "Save Success";
            default:
                return "Save";
        }
    };

    return (
        <button
            onMouseUp={handleMouseUp}
            disabled={!hasSelectionChanged}
            className="bg-blue-600"
        >
            {getButtonText()}
        </button>
    );
};
