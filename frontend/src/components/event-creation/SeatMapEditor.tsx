import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { SeatCell, SeatClass, SeatAssignments, SeatMapConfig } from '@/types/event';

interface SeatMapProps {
    layout: SeatCell[][];
    seatAssignments: { [seatId: string]: string };
    onAssignClass: (seatIds: string[]) => void;
    seatClasses: { id: string; name: string; color: string; }[];
    selectedClassId: string;
}

const SeatMap = ({ layout, seatAssignments, onAssignClass, seatClasses, selectedClassId }: SeatMapProps) => {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectionStart, setSelectionStart] = useState<[number, number] | null>(null);

    const isSeatCell = (cell: SeatCell): cell is { type: 'seat'; seatId: string } => cell.type === 'seat' && !!cell.seatId;

    const handleMouseDown = (row: number, col: number) => {
        if (!isSeatCell(layout[row][col])) return;
        setIsMouseDown(true);
        setSelectionStart([row, col]);
        const cell = layout[row][col];
        if (isSeatCell(cell)) {
            onAssignClass([cell.seatId]);
        }
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!isMouseDown || !selectionStart) return;
        const [startRow, startCol] = selectionStart;
        const newSelectedIds: string[] = [];
        for (let r = Math.min(startRow, row); r <= Math.max(startRow, row); r++) {
            for (let c = Math.min(startCol, col); c <= Math.max(startCol, col); c++) {
                if (isSeatCell(layout[r][c])) {
                    newSelectedIds.push(layout[r][c].seatId);
                }
            }
        }
        onAssignClass(newSelectedIds);
    };

    const handleMouseUp = () => {
        setIsMouseDown(false);
        setSelectionStart(null);
    };

    const getSeatColor = (seatId?: string): string => {
        const classId = seatId ? seatAssignments[seatId] || 'standard' : 'standard';
        return seatClasses.find((cls) => cls.id === classId)?.color ?? "#4B5563";
    };

    const getSeatDisplayText = (seatId: string): string => {
        // Extract just the number part for display (e.g., "A1" -> "1", "B12" -> "12")
        return seatId.replace(/^[A-Z]+/, '');
    };

    return (
        <div className="inline-block border-2 border-gray-400 rounded-lg p-4 bg-white shadow-lg select-none" onMouseUp={handleMouseUp} onMouseLeave={() => setIsMouseDown(false)}>
            {layout.map((rowArr, rowIdx) => (
                <div className="flex justify-center" key={rowIdx}>
                    {rowArr.map((cell, colIdx) => {
                        if (cell.type === "seat") {
                            const seatColor = getSeatColor(cell.seatId);
                            const isAssigned = cell.seatId && seatAssignments[cell.seatId];
                            
                            return (
                                <button
                                    key={cell.seatId}
                                    className={`w-[40px] h-[40px] m-[1px] border-2 border-gray-400 cursor-pointer text-center text-white text-xs font-bold flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110 hover:shadow-md ${
                                        isAssigned ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                                    }`}
                                    style={{ 
                                        backgroundColor: seatColor,
                                        boxShadow: isAssigned ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none'
                                    }}
                                    onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                                    onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleMouseDown(rowIdx, colIdx);
                                        }
                                    }}
                                    title={`Seat ${cell.seatId} - ${seatClasses.find(cls => cls.id === (seatAssignments[cell.seatId || ''] || 'standard'))?.name || 'Standard'}`}
                                    type="button"
                                >
                                    {cell.seatId ? getSeatDisplayText(cell.seatId) : ''}
                                </button>
                            );
                        }
                        if (cell.type === "aisle") {
                            return (
                                <div key={colIdx} className="w-[40px] h-[40px] m-[1px] flex items-center justify-center">
                                    <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                                </div>
                            );
                        }
                        if (cell.type === "stage") {
                            return (
                                <div key={colIdx} className="w-[40px] h-[40px] m-[1px] bg-gradient-to-b from-blue-400 to-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                                    ST
                                </div>
                            );
                        }
                        if (cell.type === "lectern") {
                            return (
                                <div key={colIdx} className="w-[40px] h-[40px] m-[1px] bg-gradient-to-b from-purple-400 to-purple-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                                    LE
                                </div>
                            );
                        }
                        return <div key={colIdx} className="w-[40px] h-[40px] m-[1px]" />;
                    })}
                </div>
            ))}
        </div>
    );
};

const Legend = ({ seatClasses, seatMapHeight }: { seatClasses: SeatClass[], seatMapHeight: number | null }) => (
    <div className="flex flex-col min-w-[140px]" style={{ maxHeight: seatMapHeight || undefined }}>
        <h2 className="mb-3 font-semibold sticky top-0 bg-gray-50 z-10 text-gray-800">Legend:</h2>
        <div className="flex flex-col gap-3 pr-4 overflow-y-auto">
            {seatClasses.map((cls) => (
                <div key={cls.id} className="flex items-center gap-3 p-2 bg-white rounded-md border">
                    <span className="inline-block w-6 h-6 border-2 border-gray-300 rounded-md" style={{ backgroundColor: cls.color }} />
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-800">{cls.name}</span>
                        {cls.price !== null && (
                            <span className="text-xs text-gray-500">{cls.price.toLocaleString()}đ</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
);


// --- Main Editor Component ---

interface SeatMapEditorProps {
    venueLayout: SeatCell[][];
    initialConfig?: SeatMapConfig;
    onChange: (config: SeatMapConfig) => void;
}

const defaultSeatClasses: SeatClass[] = [
    { id: "unavailable", name: "Unavailable", price: null, color: "#D1D5DB" },
    { id: "standard", name: "Standard", price: 0, color: "#4B5563" },
];

export const SeatMapEditor = ({ venueLayout, initialConfig, onChange }: SeatMapEditorProps) => {
    const [seatClasses, setSeatClasses] = useState<SeatClass[]>(initialConfig?.seatClasses || defaultSeatClasses);
    const [selectedClassId, setSelectedClassId] = useState("standard");
    const [seatAssignments, setSeatAssignments] = useState<SeatAssignments>(initialConfig?.seatAssignments || {});

    const [newClassName, setNewClassName] = useState("");
    const [newClassPrice, setNewClassPrice] = useState("");

    const seatMapRef = useRef<HTMLDivElement>(null);
    const [seatMapHeight, setSeatMapHeight] = useState<number | null>(null);

    useEffect(() => {
        onChange({ seatClasses, seatAssignments });
    }, [seatClasses, seatAssignments, onChange]);

    useLayoutEffect(() => {
        if (seatMapRef.current) {
            setSeatMapHeight(seatMapRef.current.offsetHeight);
        }
    }, [venueLayout]);

    const handleAddClass = () => {
        if (!newClassName.trim() || isNaN(Number(newClassPrice))) return;
        const id = newClassName.trim().toLowerCase().replace(/\s+/g, "-");
        if (seatClasses.some(c => c.id === id)) {
            alert(`A class with the id '${id}' already exists.`);
            return;
        }
        setSeatClasses([ ...seatClasses, { id, name: newClassName.trim(), price: Number(newClassPrice), color: "#22c55e" } ]);
        setNewClassName("");
        setNewClassPrice("");
    };

    const handleRemoveClass = (id: string) => {
        if (id === 'standard' || id === 'unavailable') return;
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
        <div className="bg-gray-50 p-6 rounded-lg border space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Define Seat Classes</h3>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {seatClasses.map((cls) => (
                        <div key={cls.id} onClick={() => setSelectedClassId(cls.id)} className={`p-2 border rounded-md flex items-center gap-2 text-sm transition-all cursor-pointer ${selectedClassId === cls.id ? 'bg-primary text-white shadow-lg scale-105' : 'bg-white hover:bg-gray-100'}`}>
                            <input 
                                type="color" 
                                value={cls.color} 
                                onChange={(e) => handleClassColorChange(cls.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="w-6 h-6 border-none rounded-md cursor-pointer p-0"
                                disabled={cls.id === 'standard' || cls.id === 'unavailable'}
                                title="Change class color"
                            />
                            <span>{cls.name}</span>
                            <span className="text-xs opacity-70">{cls.price !== null ? `${cls.price.toLocaleString()}đ` : ''}</span>
                            {cls.id !== 'standard' && cls.id !== 'unavailable' && (
                                <span onClick={(e) => { e.stopPropagation(); handleRemoveClass(cls.id); }} className="ml-1 text-red-400 hover:text-red-600 font-bold">✕</span>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 p-2 border-t">
                    <input type="text" placeholder="New class name (e.g., VIP)" value={newClassName} onChange={(e) => setNewClassName(e.target.value)} className="border-gray-300 rounded-md text-sm shadow-sm" />
                    <input type="number" placeholder="Price" value={newClassPrice} onChange={(e) => setNewClassPrice(e.target.value)} className="border-gray-300 rounded-md text-sm w-32 shadow-sm" />
                    <button onClick={handleAddClass} className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-green-600">Add</button>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Assign Classes to Seats</h3>
                <p className="text-sm text-gray-500 mb-4">Select a class above, then click and drag on the map below to assign it.</p>
                <div className="flex items-start gap-8">
                    <div ref={seatMapRef} style={{ flexShrink: 0 }}>
                        <SeatMap
                            layout={venueLayout}
                            seatAssignments={seatAssignments}
                            onAssignClass={handleAssignClassToSeat}
                            seatClasses={seatClasses}
                            selectedClassId={selectedClassId}
                        />
                    </div>
                    <Legend seatClasses={seatClasses} seatMapHeight={seatMapHeight} />
                </div>
            </div>
        </div>
    );
};
