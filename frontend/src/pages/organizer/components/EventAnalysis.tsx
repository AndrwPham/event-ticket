import { FC, useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { IEvent } from "../../../types";

const COLORS = {
    AVAILABLE: "#00C49F",
    HELD: "#FFBB28",
    PAID: "#0088FE",
};

type EventWithStats = IEvent & {
    ticketsSold: number;
    revenue: number;
};

// --- NEW: Helper function to format large numbers for the Y-axis ---
const formatYAxisTick = (tick: number): string => {
    if (tick >= 1000000) {
        return `${(tick / 1000000).toFixed(1)}M`;
    }
    if (tick >= 1000) {
        return `${Math.round(tick / 1000)}K`;
    }
    return tick.toString();
};

const EventAnalysis: FC<{ event: EventWithStats }> = ({ event }) => {
    const hasSeatMap = useMemo(() => !!event.seats, [event]);

    const ticketStatusData = useMemo(() => {
        if (!hasSeatMap) return [];

        const statusCounts = Object.values(event.seats!).reduce(
            (acc, seat) => {
                if (seat.status === "available") acc.AVAILABLE += 1;
                else if (seat.status === "sold") acc.PAID += 1;
                else if (seat.status === "held") acc.HELD += 1;
                return acc;
            },
            { AVAILABLE: 0, HELD: 0, PAID: 0 },
        );

        return [
            { name: "Available", value: statusCounts.AVAILABLE },
            { name: "Paid", value: statusCounts.PAID },
            { name: "Held", value: statusCounts.HELD },
        ].filter((item) => item.value > 0);
    }, [event, hasSeatMap]);

    const salesByClassData = useMemo(() => {
        if (!hasSeatMap) return [];
        const soldSeats = Object.values(event.seats!).filter(
            (seat) => seat.status === "sold",
        );
        const salesByTier = soldSeats.reduce(
            (acc, seat) => {
                acc[seat.tier] = (acc[seat.tier] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        return Object.entries(salesByTier).map(([name, sold]) => ({
            name,
            sold,
        }));
    }, [event, hasSeatMap]);

    const revenueData = useMemo(() => {
        const mockProgression = [0.1, 0.3, 0.45, 1.0];
        return mockProgression.map((progress, index) => ({
            name: `Week ${index + 1}`,
            revenue: Math.round(event.revenue * progress),
        }));
    }, [event.revenue]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    {event.title}
                </h2>
                <p className="text-gray-500">Detailed Event Analysis</p>
            </div>

            <div className="h-72">
                <h3 className="font-semibold text-lg mb-2">Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                        <XAxis dataKey="name" />
                        {/* --- CORRECTED: Using the new tickFormatter --- */}
                        <YAxis tickFormatter={formatYAxisTick} />
                        <Tooltip
                            formatter={(value: number) => [
                                `${new Intl.NumberFormat("vi-VN").format(
                                    value,
                                )}đ`,
                                "Revenue",
                            ]}
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-72 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 text-center">
                        Ticket Inventory
                    </h3>
                    {hasSeatMap ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ticketStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={(entry) =>
                                        `${entry.name}: ${entry.value}`
                                    }
                                >
                                    {ticketStatusData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={
                                                COLORS[
                                                    entry.name.toUpperCase() as keyof typeof COLORS
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => [
                                        value.toLocaleString(),
                                        "Tickets",
                                    ]}
                                />
                                <Legend wrapperStyle={{ bottom: -5 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500 text-center px-4">
                                A detailed inventory breakdown is not available
                                for this event type.
                            </p>
                        </div>
                    )}
                </div>

                <div className="h-72 flex flex-col">
                    <h3 className="font-semibold text-lg mb-2 text-center">
                        Sales by Class
                    </h3>
                    {hasSeatMap && salesByClassData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salesByClassData}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="sold" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-500 text-center px-4">
                                No ticket classes sold yet or not applicable.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventAnalysis;