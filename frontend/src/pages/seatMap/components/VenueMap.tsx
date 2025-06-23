import { useMemo } from "react";
import Seat from "./Seat";
import { IssuedTicket, Venue } from "../../../types";

interface VenueMapProps {
    layout: Venue["layout"];
    tickets: IssuedTicket[];
    selectedSeats: IssuedTicket[];
    onSeatSelect: (ticket: IssuedTicket) => void;
}

export default function VenueMap({
    layout,
    tickets,
    selectedSeats,
    onSeatSelect,
}: VenueMapProps) {
    const ticketMap = useMemo(
        () => new Map(tickets.map((ticket) => [ticket.seat, ticket])),
        [tickets],
    );

    const selectedSeatIds = useMemo(
        () => new Set(selectedSeats.map((seat) => seat.id)),
        [selectedSeats],
    );

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="w-full bg-gray-300 text-center py-2 mb-8 font-bold rounded">
                STAGE
            </div>
            {layout.rows.map((row, rowIndex) => (
                <div
                    key={`row-${rowIndex.toString()}`}
                    className="flex items-center justify-center space-x-1"
                >
                    {row.map((item, itemIndex) => {
                        const key = `${rowIndex.toString()}-${itemIndex.toString()}`;

                        if (item.type === "seat" && item.seatId) {
                            const ticket = ticketMap.get(item.seatId);
                            if (!ticket) {
                                return (
                                    <Seat
                                        key={key}
                                        status="UNAVAILABLE"
                                        isSelected={false}
                                        onClick={() => {}}
                                    />
                                );
                            }

                            return (
                                <Seat
                                    key={ticket.id}
                                    seatId={ticket.seat}
                                    status={ticket.status}
                                    color={ticket.classColor}
                                    isSelected={selectedSeatIds.has(ticket.id)}
                                    onClick={() => {
                                        onSeatSelect(ticket);
                                    }}
                                />
                            );
                        }
                        if (item.type === "aisle") {
                            return <div key={key} className="w-8 h-8"></div>;
                        }
                        if (item.type === "empty") {
                            return <div key={key} className="w-8 h-8"></div>;
                        }
                        return null;
                    })}
                </div>
            ))}
        </div>
    );
}
