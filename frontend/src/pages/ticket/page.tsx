import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import robotImage from "../../assets/images/robot.jpg";
import TicketCard from "../../components/TicketCard";

const attendeeId = "685c39c9366ef3111dfeb1d9"; // Your real attendeeId

const Ticket = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [activeSubTab, setActiveSubTab] = useState("Upcoming");
    interface Ticket {
        id: string;
        title?: string;
        location?: string;
        image?: string;
        date?: string;
        status?: string;
        issuedTicket?: {
            title?: string;
            location?: string;
            image?: string;
            date?: string;
            status?: string;
        };
        [key: string]: any; // Add this if there are more fields
    }
    
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/claimed-tickets/attendee/${attendeeId}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch tickets");
                return res.json();
            })
            .then((data) => {
                setTickets(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Enhanced filtering logic for both sets of tabs
    const displayedTickets = useMemo(() => {
        const now = new Date();
        // 1. Filter by "Upcoming" or "Past" first
        const temporalFilteredTickets = tickets.filter((ticket) => {
            // Use issuedTicket.date or similar field; fallback to ticket.date
            const ticketDate = new Date(
                ticket.issuedTicket?.date || ticket.date || 0,
            );
            if (activeSubTab === "Upcoming") {
                return ticketDate >= now;
            } else {
                // "Past"
                return ticketDate < now;
            }
        });
        // 2. Then, filter by status if "All" is not selected
        if (activeTab === "All") {
            return temporalFilteredTickets;
        }
        return temporalFilteredTickets.filter(
            (ticket) => (ticket.status || ticket.issuedTicket?.status) === activeTab,
        );
    }, [tickets, activeTab, activeSubTab]);

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-10">Loading tickets...</div>;
        }
        if (error) {
            return <div className="text-center py-10 text-red-500">{error}</div>;
        }
        if (displayedTickets.length === 0) {
            return (
                <div className="text-center py-10">
                    <img
                        src={robotImage}
                        alt="No tickets found"
                        className="mx-auto mb-6 h-48 w-48 rounded-full object-cover"
                    />
                    <p className="text-gray-500 mb-6">
                        No tickets match the selected filters.
                    </p>
                </div>
            );
        }
        return (
            <div className="space-y-6 pt-6">
                {displayedTickets.map((ticket) => {
                    // Map status string to MyTicket status type
                    const statusMap: Record<string, "Ready" | "Used" | "Cancelled" | "Expired"> = {
                        READY: "Ready",
                        USED: "Used",
                        CANCELLED: "Cancelled",
                        EXPIRED: "Expired",
                    };
                    const rawStatus = (ticket.status || ticket.issuedTicket?.status || "READY").toUpperCase();
                    const mappedStatus =
                        statusMap[rawStatus] || "Ready"; // Default to "Ready" if not matched

                    // Map Ticket to MyTicket shape
                    const mappedTicket = {
                        ...ticket,
                        id: ticket.id, // Use string id for React key and TicketCard
                        title: ticket.title || ticket.issuedTicket?.title || "Untitled Ticket",
                        location: ticket.location || ticket.issuedTicket?.location || "Unknown Location",
                        image: ticket.image || ticket.issuedTicket?.image || robotImage,
                        status: mappedStatus,
                        date: ((ticket.date || ticket.issuedTicket?.date) && !isNaN(new Date((ticket.date || ticket.issuedTicket?.date) ?? "").getTime()))
                            ? (ticket.date || ticket.issuedTicket?.date)
                            : null,
                    };
                    return <TicketCard key={mappedTicket.id} ticket={mappedTicket} />;
                })}
            </div>
        );
    };

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-12 gap-12">
                    {/* Sidebar */}
                    <aside className="col-span-12 lg:col-span-3">
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-500">
                                    Account of
                                </h3>
                                <p className="font-bold text-lg">
                                    Nguyen Van A
                                </p>
                            </div>
                            <nav className="space-y-2 text-gray-600">
                                <h4 className="font-bold text-black px-4 pt-2">
                                    Account Settings
                                </h4>
                                <div className="pl-4">
                                    <Link
                                        to="/profile"
                                        className="block py-2 px-4 rounded-md hover:bg-gray-100"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/ticket"
                                        className="block py-2 px-4 rounded-md bg-gray-100 font-bold text-black"
                                    >
                                        My Tickets
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="col-span-12 lg:col-span-9">
                        <h1 className="text-3xl font-bold mb-6">My Tickets</h1>

                        {/* Centered Main filter tabs */}
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center space-x-4">
                                {[
                                    "All",
                                    "READY",
                                    "USED",
                                    "CANCELLED",
                                    "EXPIRED",
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveTab(tab);
                                        }}
                                        className={`w-32 py-2 rounded-full text-sm font-semibold transition-colors flex items-center justify-center ${
                                            activeTab === tab
                                                ? "bg-[#1A0B49] text-white"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                    >
                                        {tab.charAt(0) + tab.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Centered Upcoming/Past sub-tabs */}
                        <div className="flex justify-center border-b">
                            <div className="flex">
                                {["Upcoming", "Past"].map((subTab) => (
                                    <button
                                        key={subTab}
                                        onClick={() => {
                                            setActiveSubTab(subTab);
                                        }}
                                        className={`px-12 py-3 text-sm font-medium transition-colors ${
                                            activeSubTab === subTab
                                                ? "border-b-2 border-[#1A0B49] text-[#1A0B49]"
                                                : "text-gray-500 hover:text-black"
                                        }`}
                                    >
                                        {subTab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div>{renderContent()}</div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Ticket;
