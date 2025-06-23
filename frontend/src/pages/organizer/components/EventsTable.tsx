import { FC } from "react";
import { IEvent } from "../../../types";
import { FiUsers } from "react-icons/fi"; // Removed FiDollarSign

type EventWithStats = IEvent & {
    ticketsSold: number;
    revenue: number;
};

interface EventsTableProps {
    events: EventWithStats[];
    onEventSelect: (event: EventWithStats) => void;
    selectedEventId?: number;
}

const EventsTable: FC<EventsTableProps> = ({
    events,
    onEventSelect,
    selectedEventId,
}) => {
    return (
        <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 p-4 border-b">
                Events Hub
            </h2>
            <div className="divide-y divide-gray-200">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => onEventSelect(event)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                            event.id === selectedEventId ? "bg-indigo-50" : ""
                        }`}
                    >
                        <h3 className="font-semibold text-gray-900 truncate">
                            {event.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                            {new Date(
                                event.schedule[0].datetime,
                            ).toLocaleDateString()}
                        </p>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <div className="flex items-center text-green-600 font-medium">
                                <FiUsers className="w-4 h-4 mr-1" />
                                <span>
                                    {event.ticketsSold}
                                    {event.ticketsSold === 1
                                        ? " ticket"
                                        : " tickets"}{" "}
                                    sold
                                </span>
                            </div>
                            {/* CORRECTED: Removed the dollar icon */}
                            <div className="font-bold text-blue-600">
                                <span>
                                    {new Intl.NumberFormat("vi-VN").format(
                                        event.revenue,
                                    )}
                                    đ
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsTable;