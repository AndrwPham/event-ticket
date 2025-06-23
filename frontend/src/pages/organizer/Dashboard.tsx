import { FC, useState, useMemo } from "react";
import { IEvent } from "../../types";
import { allEvents } from "../../data/_mock_db";
import KpiCard from "./components/KpiCard";
import EventsTable from "./components/EventsTable";
import EventAnalysis from "./components/EventAnalysis";
import { FiDollarSign, FiUsers, FiCalendar } from "react-icons/fi";

// --- CORRECTED: Define the augmented type for clarity ---
type EventWithStats = IEvent & {
    ticketsSold: number;
    revenue: number;
};

const OrganizerDashboard: FC = () => {
    const events = allEvents;

    const eventsWithStats: EventWithStats[] = useMemo(() => {
        return events.map((event) => {
            let ticketsSold = 0;
            let revenue = 0;
            if (event.seats) {
                for (const seatId in event.seats) {
                    if (event.seats[seatId].status === "sold") {
                        ticketsSold++;
                        revenue += event.seats[seatId].price;
                    }
                }
            }
            return {
                ...event,
                ticketsSold,
                revenue,
            };
        });
    }, [events]);

    // --- CORRECTED: The state now correctly uses the EventWithStats type ---
    const [selectedEvent, setSelectedEvent] = useState<EventWithStats | null>(
        eventsWithStats[1] || null,
    );

    const totalRevenue = useMemo(
        () => eventsWithStats.reduce((acc, event) => acc + event.revenue, 0),
        [eventsWithStats],
    );

    const totalTicketsSold = useMemo(
        () =>
            eventsWithStats.reduce(
                (acc, event) => acc + event.ticketsSold,
                0,
            ),
        [eventsWithStats],
    );

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Organizer Dashboard
                </h1>

                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <KpiCard
                        title="Total Revenue"
                        value={`${new Intl.NumberFormat("vi-VN").format(
                            totalRevenue,
                        )}đ`}
                        icon={<FiDollarSign className="w-6 h-6 text-white" />}
                        color="bg-blue-500"
                    />
                    <KpiCard
                        title="Total Tickets Sold"
                        value={totalTicketsSold.toLocaleString()}
                        icon={<FiUsers className="w-6 h-6 text-white" />}
                        color="bg-green-500"
                    />
                    <KpiCard
                        title="Total Events"
                        value={events.length}
                        icon={<FiCalendar className="w-6 h-6 text-white" />}
                        color="bg-indigo-500"
                    />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <EventsTable
                            events={eventsWithStats}
                            // --- CORRECTED: No longer needs casting ---
                            onEventSelect={(event) => setSelectedEvent(event)}
                            selectedEventId={selectedEvent?.id}
                        />
                    </div>

                    <div className="lg:col-span-2">
                        {selectedEvent ? (
                            // This now passes the correctly typed event
                            <EventAnalysis event={selectedEvent} />
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                                <p>Select an event to see detailed analytics.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;