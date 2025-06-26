import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueMap from "./components/VenueMap";
import SeatMapLegend from "./components/SeatMapLegend";
import SeatMapOrderSummary from "./components/SeatMapOrderSummary";
import BuyerInfoForm from "./components/BuyerInfoForm";
import { useAuth } from "../../context/AuthContext";

import {
    EventData,
    IssuedTicket,
    BuyerInfo,
    OrderDetails,
    LocationState,
    Event,
} from "../../types";

export default function SeatMap() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();


    const [event, setEvent] = useState<EventData | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<IssuedTicket[]>([]);
    const [attendeeInfo, setAttendeeInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // This useEffect hook fetches the event data and remains unchanged.
    useEffect(() => {
        const fetchAttendeeInfo = async () => {
            if (!isAuthenticated) return;
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
                    credentials: "include",
                });
                if (!res.ok) return;
                const data = await res.json();
                const info = data.attendeeInfo ?? {};
                setAttendeeInfo({
                    firstName: info.first_name ?? "",
                    lastName: info.last_name ?? "",
                    email: info.email ?? user?.email ?? "",
                });
            } catch (err) {
                console.error("Failed to fetch attendee info", err);
            }
        };
        void fetchAttendeeInfo();
    }, [isAuthenticated, user]);

    useEffect(() => {
        const fetchEventData = async () => {
            if (!eventId) {
                setError("Event ID is missing from URL.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/events/${eventId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = (await response.json()) as EventData;
                setEvent(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };
        void fetchEventData();
    }, [eventId]);

    const handleSeatSelect = (ticket: IssuedTicket) => {
        if (ticket.status !== "AVAILABLE") return;
        setSelectedSeats((prev) =>
            prev.some((s) => s.id === ticket.id)
                ? prev.filter((s) => s.id !== ticket.id)
                : [...prev, ticket]
        );
    };

    const handleAttendeeInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAttendeeInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleProceedToPayment = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        if (!attendeeInfo.email || !attendeeInfo.firstName || !attendeeInfo.lastName) {
            alert("Please fill in your first name, last name, and email.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        // CORRECTED: Reverting to the nested payload structure as it aligns
        // with the backend's DTO and the latest error messages.
        const payload = {
            ticketItems: selectedSeats.map((seat) => seat.id),
            method: "PAYOS",
            guestName: `${attendeeInfo.firstName} ${attendeeInfo.lastName}`.trim(),
            guestEmail: attendeeInfo.email,
        };

        try {
            const response = await fetch("http://localhost:5000/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = (await response.json()) as { message?: string | string[] };
                const errorMessage = Array.isArray(errorData.message) ? errorData.message.join(", ") : errorData.message;
                throw new Error(errorMessage || "Failed to create the order.");
            }

            const newOrder = await response.json();

            const buyerInfo: BuyerInfo = {
                fullName: `${attendeeInfo.firstName} ${attendeeInfo.lastName}`.trim(),
                email: attendeeInfo.email,
                phone: "",
            };

            const orderDetails: OrderDetails = {
                tickets: selectedSeats.map((ticket) => ({
                    name: `Seat ${ticket.seat} (${ticket.class})`,
                    quantity: 1,
                    price: ticket.price,
                })),
            };

            const eventDetails: Event = event as unknown as Event;

            const locationState: Partial<LocationState> = {
                eventDetails,
                orderDetails,
                buyerInfo,
            };

            navigate(`/event/${String(eventId)}/payment`, {
                state: {
                    ...locationState,
                    order: newOrder,
                },
            });

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="text-center py-20">Loading seat map...</div>;

    if (error && !isProcessing) return <div className="text-center py-20 text-red-500">{error}</div>;

    if (!event) return <div className="text-center py-20">Event not found.</div>;

    const uniqueTicketClasses = Array.from(
        new Map(event.tickets.map((t) => [t.class, { name: t.class, color: t.classColor || "#CCCCCC" }])).values()
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-lg text-gray-600 mb-8">{event.venue.name}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-100 p-4 rounded-lg">
                        {event.venue.layout && (
                            <VenueMap
                                layout={event.venue.layout}
                                tickets={event.tickets}
                                selectedSeats={selectedSeats}
                                onSeatSelect={handleSeatSelect}
                            />
                        )}
                    </div>
                    <SeatMapLegend seatClasses={uniqueTicketClasses} />
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-bold mb-4">Your Information</h3>
                        <BuyerInfoForm
                            buyerInfo={{
                                firstName: attendeeInfo.firstName,
                                lastName: attendeeInfo.lastName,
                                email: attendeeInfo.email,
                            }}
                            onInfoChange={handleAttendeeInfoChange}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <SeatMapOrderSummary
                        selectedSeats={selectedSeats}
                        isProcessing={isProcessing}
                        onProceed={handleProceedToPayment}
                    />
                    {error && (
                        <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
