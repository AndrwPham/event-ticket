import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LogIn from "../../components/log-in";
import SignUp from "../../components/sign-up";
import { OrganizerLayout } from "../../components/layout/OrganizerLayout";

interface OrganizerEvent {
    id: string;
    title: string;
    organizationId: string;
    images?: { url: string }[];
}

interface IssuedTicket {
    id: string;
    price: number;
    status: string;
}

interface EventStats {
    sold: number;
    revenue: number;
    total: number;
}

const MyEventPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [showSignUp, setShowSignUp] = useState(false);
    const [events, setEvents] = useState<OrganizerEvent[]>([]);
    const [stats, setStats] = useState<Record<string, EventStats>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/events`);
                if (!res.ok) throw new Error("Failed to fetch events");
                const data = (await res.json()) as OrganizerEvent[];
                const myEvents = data.filter((e) => e.organizationId === user.organizationId);
                setEvents(myEvents);
                for (const evt of myEvents) {
                    try {
                        const tRes = await fetch(
                            `${import.meta.env.VITE_API_URL}/tickets/event/${evt.id}`,
                        );
                        if (!tRes.ok) throw new Error("Failed to fetch tickets");
                        const tickets = (await tRes.json()) as IssuedTicket[];
                        let sold = 0;
                        let revenue = 0;
                        for (const t of tickets) {
                            if (t.status === "PAID" || t.status === "CLAIMED") {
                                sold += 1;
                                revenue += t.price;
                            }
                        }
                        setStats((prev) => ({
                            ...prev,
                            [evt.id]: { sold, revenue, total: tickets.length },
                        }));
                    } catch (err) {
                        console.error("Failed to fetch tickets for event", evt.id, err);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch events", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchEvents();
    }, [isAuthenticated, user]);

    if (!isAuthenticated) {
        return showSignUp ? (
            <SignUp
                onClose={() => {
                    navigate("/");
                }}
            />
        ) : (
            <LogIn
                onClose={() => {
                    navigate("/");
                }}
                onSwitchToSignUp={() => {
                    setShowSignUp(true);
                }}
            />
        );
    }

    return (
        <OrganizerLayout>
            <header className="bg-white border-b py-4 px-6">
                <h1 className="text-2xl font-bold">My Events</h1>
            </header>
            <main className="p-6 space-y-6">
                {loading ? (
                    <p>Loading events...</p>
                ) : events.length === 0 ? (
                    <div className="text-center text-gray-500">No hosted events.</div>
                ) : (
                    events.map((evt) => (
                        <div key={evt.id} className="bg-white p-4 rounded shadow">
                            {evt.images && evt.images[0] && (
                                <img
                                    src={evt.images[0].url}
                                    alt={evt.title}
                                    className="w-full h-40 object-cover rounded mb-2"
                                />
                            )}
                            <h2 className="text-xl font-semibold">{evt.title}</h2>
                            {stats[evt.id] ? (
                                <div className="mt-2 text-sm text-gray-700">
                                    <p>
                                        Tickets Sold: {stats[evt.id].sold} / {stats[evt.id].total}
                                    </p>
                                    <p>Revenue: {stats[evt.id].revenue.toLocaleString()}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Loading stats...</p>
                            )}
                            <Link
                                to={`/events/${evt.id}/seats`}
                                className="text-indigo-600 hover:underline mt-3 inline-block"
                            >
                                View Event
                            </Link>
                        </div>
                    ))
                )}
            </main>
        </OrganizerLayout>
    );
};

export default MyEventPage;