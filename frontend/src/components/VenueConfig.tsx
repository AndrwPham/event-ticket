import { useState } from "react";

interface SeatCell {
    type: "seat" | "aisle" | "empty" | "stage";
    seatId?: string;
}

interface Venue {
    id: number;
    name: string;
    layout: SeatCell[][];
    seatClasses?: {
        id: string;
        name: string;
        price: number | null;
        color: string;
    }[];
    seatAssignments?: { [seatId: string]: string };
}

interface VenueList {
    venueList: Venue[];
}

interface VenueButtonGroupConfiguration {
    venues: Venue[];
    selectedVenueID: number;
    setSelectedVenue: (venueID: number) => void;
}

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
    setSelectedVenue: (venueID: number) => void;
}

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
    seatAssignments: { [seatId: string]: string };
    seatClasses: {
        id: string;
        name: string;
        price: number | null;
        color: string;
    }[];
    selectedVenueID: number;
}

export const SendSeatmapButton = ({
    seatAssignments,
    seatClasses,
    selectedVenueID,
}: SendSeatmapButtonConfig) => {
    const state = Object.freeze({
        READY: 1,
        IN_PROGRESS: 2,
        SAVE_FAILED: 3,
        SAVE_SUCCESS: 4,
    });
    const [currentState, setCurrentState] = useState<number>(state.READY);

    const handleMouseUp = () => {
        if (currentState === state.READY) {
            setCurrentState(state.IN_PROGRESS);
            // all state change handled inside, so we dont need to do anything to the Promise
            postSeatmapConfig().then(
                () => {},
                () => {},
            );
        }
    };

    const postSeatmapConfig = async () => {
        try {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            // FIXME: use the corresponding endpoint, this is a mock
            const response = await fetch("https://localhost:5000/api/data", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    SeatAssignments: seatAssignments,
                    SeatClasses: seatClasses,
                    VenueID: selectedVenueID,
                }),
            });
            if (!response.ok) {
                setCurrentState(state.SAVE_FAILED);
                setTimeout(() => {
                    setCurrentState(state.READY);
                }, 1500);
                return;
            }
            setCurrentState(state.SAVE_SUCCESS);
            setTimeout(() => {
                setCurrentState(state.READY);
            }, 1500);
        } catch {
            setCurrentState(state.SAVE_FAILED);
            setTimeout(() => {
                setCurrentState(state.READY);
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
        <button onMouseUp={handleMouseUp} className="bg-blue-600 text-white">
            {getButtonText()}
        </button>
    );
};

interface SeatMapConfig {
    layout: SeatCell[][];
    seatAssignments: { [seatId: string]: string };
    onAssignClass: (seatIds: string[]) => void;
    seatClasses: {
        id: string;
        name: string;
        price: number | null;
        color: string;
    }[];
    selectedClassId: string;
}

const SeatMap = ({
    layout,
    seatAssignments,
    onAssignClass,
    seatClasses,
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

        // Click functionality, selecting a single seat
        const cell = layout[row][col];
        if (isSeatCell(cell) && cell.seatId) {
            setSelectedSeatIds([cell.seatId]);
            onAssignClass([cell.seatId]);
        }
    };

    // Extend the end of selection, making sure that we have top-bottom order.
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
        onAssignClass(newSelectedIds);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setSelectionStart(null);
    };

    const getSeatClass = (seatId: string | undefined): string => {
        if (seatId && seatAssignments[seatId]) {
            return seatAssignments[seatId];
        }
        return "standard";
    };

    return (
        // no plan to add keyboard interaction
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
                            const seatClass = getSeatClass(cell.seatId);
                            const classColor =
                                seatClasses.find((cls) => cls.id === seatClass)
                                    ?.color ?? "#4B5563";
                            return (
                                // also no plan to add keyboard interaction
                                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                                <div
                                    key={cell.seatId}
                                    className={`w-[30px] h-[30px] m-[2px] border border-gray-300 cursor-pointer text-center`}
                                    style={{ backgroundColor: classColor }}
                                    onMouseDown={() => {
                                        handleMouseDown(rowIdx, colIdx);
                                    }}
                                    onMouseEnter={() => {
                                        handleMouseEnter(rowIdx, colIdx);
                                    }}
                                    aria-label={`Seat ${cell.seatId ?? "unknown"}`}
                                    aria-selected={
                                        selectedSeatIds.includes(
                                            cell.seatId ?? "",
                                        )
                                            ? "true"
                                            : "false"
                                    }
                                >
                                    {cell.seatId ?? "unknown"}
                                </div>
                            );
                        }
                        if (cell.type === "aisle") {
                            return (
                                <div
                                    key={colIdx}
                                    className="w-[30px] h-[30px] m-[2px]"
                                    style={{ backgroundColor: "#FFFFFF" }}
                                />
                            );
                        }
                        if (cell.type === "stage") {
                            return (
                                <div
                                    key={colIdx}
                                    className="w-[30px] h-[30px] m-[2px]"
                                    style={{ backgroundColor: "#93C5FD" }}
                                />
                            );
                        }
                        // empty
                        return (
                            <div
                                key={colIdx}
                                className="w-[30px] h-[30px] m-[2px]"
                                style={{ backgroundColor: "#FFFFFF" }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

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
    const defaultSeatClasses = [
        {
            id: "unavailable",
            name: "Unavailable",
            price: null,
            color: "#D1D5DB", // light gray
        },
        {
            id: "standard",
            name: "Standard",
            price: 0,
            color: "#4B5563", // dark gray
        },
    ];
    const [selectedVenue, setSelectedVenue] = useState(venueList[0].id);
    const [venueLayout, setVenueLayout] = useState(venueList[0].layout);
    const [seatClasses, setSeatClasses] = useState(
        venueList[0].seatClasses && venueList[0].seatClasses.length > 0
            ? venueList[0].seatClasses
            : defaultSeatClasses,
    );
    const [selectedClassId, setSelectedClassId] = useState("standard");
    const [seatAssignments, setSeatAssignments] = useState<{
        [seatId: string]: string;
    }>(venueList[0].seatAssignments || {});
    const [newClassName, setNewClassName] = useState("");
    const [newClassPrice, setNewClassPrice] = useState("");

    const handleSelectedVenueChange = (venueID: number) => {
        const venue = venueList.find((v) => v.id === venueID);
        if (venue) {
            setSelectedVenue(venue.id);
            setVenueLayout(venue.layout);
            setSeatClasses(
                venue.seatClasses && venue.seatClasses.length > 0
                    ? venue.seatClasses
                    : defaultSeatClasses,
            );
            setSeatAssignments(venue.seatAssignments || {});
        }
    };

    const handleAddClass = () => {
        if (!newClassName.trim() || isNaN(Number(newClassPrice))) return;
        const id = newClassName.trim().toLowerCase().replace(/\s+/g, "-");
        setSeatClasses([
            ...seatClasses,
            {
                id,
                name: newClassName.trim(),
                price: Number(newClassPrice),
                color: "#22c55e", // default to green color.
            },
        ]);
        setNewClassName("");
        setNewClassPrice("");
    };

    const handleRemoveClass = (id: string) => {
        setSeatClasses(seatClasses.filter((cls) => cls.id !== id));
        setSeatAssignments((prev) => {
            const updated: { [seatId: string]: string } = {};
            Object.keys(prev).forEach((seatId) => {
                if (prev[seatId] !== id) updated[seatId] = prev[seatId];
            });
            return updated;
        });
        if (selectedClassId === id) setSelectedClassId("standard");
    };

    const handleClassPriceChange = (id: string, price: number) => {
        setSeatClasses(
            seatClasses.map((cls) => (cls.id === id ? { ...cls, price } : cls)),
        );
    };

    const handleClassColorChange = (id: string, color: string) => {
        setSeatClasses(
            seatClasses.map((cls) => (cls.id === id ? { ...cls, color } : cls)),
        );
    };

    const handleAssignClassToSeat = (seatIds: string[]) => {
        setSeatAssignments((prev) => {
            const updated = { ...prev };
            seatIds.forEach((id) => {
                updated[id] = selectedClassId;
            });
            return updated;
        });
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
            <h2>Seat Classes:</h2>
            <div className="flex items-center gap-1 mb-4">
                <input
                    type="text"
                    placeholder="Class name"
                    value={newClassName}
                    onChange={(e) => {
                        setNewClassName(e.target.value);
                    }}
                    className="border px-1"
                />
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Price (₫)"
                    value={
                        newClassPrice
                            ? Number(newClassPrice).toLocaleString("vi-VN") +
                              " ₫"
                            : ""
                    }
                    onChange={(e) => {
                        // Remove all non-digit characters
                        const raw = e.target.value.replace(/\D/g, "");
                        setNewClassPrice(raw);
                    }}
                    className="w-28 border px-1 text-right"
                />
                <button
                    onClick={handleAddClass}
                    className="bg-green-200 px-2 rounded"
                >
                    Add
                </button>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
                {seatClasses.map((cls) => (
                    <div
                        key={cls.id}
                        className={`p-2 border rounded flex items-center gap-2 ${selectedClassId === cls.id ? "bg-blue-100" : ""}`}
                    >
                        <button
                            onClick={() => {
                                setSelectedClassId(cls.id);
                            }}
                            className="font-bold"
                        >
                            {cls.name}
                        </button>
                        {cls.id !== "unavailable" && (
                            <input
                                type="text"
                                inputMode="numeric"
                                value={
                                    cls.price !== null && cls.price !== 0
                                        ? Number(cls.price).toLocaleString(
                                              "vi-VN",
                                          ) + " ₫"
                                        : cls.price === 0
                                          ? "0 ₫"
                                          : ""
                                }
                                onChange={(e) => {
                                    const raw = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    handleClassPriceChange(
                                        cls.id,
                                        raw ? Number(raw) : 0,
                                    );
                                }}
                                className="w-28 border px-1 text-right"
                                placeholder="Price (₫)"
                                disabled={cls.id === "unavailable"}
                            />
                        )}
                        {cls.id !== "unavailable" && cls.id !== "standard" && (
                            <>
                                <input
                                    type="color"
                                    value={cls.color}
                                    onChange={(e) => {
                                        handleClassColorChange(
                                            cls.id,
                                            e.target.value,
                                        );
                                    }}
                                    title="Pick color"
                                />
                                <button
                                    onClick={() => {
                                        handleRemoveClass(cls.id);
                                    }}
                                    className="text-red-500 ml-1"
                                >
                                    ✕
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <h2>Configure Venue Seat Map:</h2>
            <div className="flex items-start gap-8">
                <SeatMap
                    key={selectedVenue}
                    layout={venueLayout}
                    seatAssignments={seatAssignments}
                    onAssignClass={handleAssignClassToSeat}
                    seatClasses={seatClasses}
                    selectedClassId={selectedClassId}
                />
                <div className="flex flex-col gap-3 min-w-[120px]">
                    <h2 className="mb-2 font-semibold">Legend:</h2>
                    {seatClasses.map((cls) => (
                        <div key={cls.id} className="flex items-center gap-2">
                            <span
                                className="inline-block w-6 h-6 border border-gray-300 rounded"
                                style={{ backgroundColor: cls.color }}
                            />
                            <span>{cls.name}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block w-6 h-6 border border-gray-300 rounded"
                            style={{ backgroundColor: "#93C5FD" }}
                        />
                        <span>Stage</span>
                    </div>
                </div>
            </div>
            <SendSeatmapButton
                seatAssignments={seatAssignments}
                seatClasses={seatClasses}
                selectedVenueID={selectedVenue}
            />
        </div>
    );
};
