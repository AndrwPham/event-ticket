import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueMap from "./components/VenueMap";
import SeatMapLegend from "./components/SeatMapLegend";
import SeatMapOrderSummary from "./components/SeatMapOrderSummary";
import BuyerInfoForm from "../payment/components/BuyerInfoForm";
import { EventData, IssuedTicket } from "../../types"; // Ensure all needed types are imported

export default function SeatMap() {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();

    const [event, setEvent] = useState<EventData | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<IssuedTicket[]>([]);
    const [attendeeInfo, setAttendeeInfo] = useState({
        first_name: "",
        last_name: "",
        email: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        void (async () => {
            if (!eventId) {
                setError("Event ID is missing from URL.");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(
                    `http://localhost:5000/events/${eventId}`,
                );
                if (!response.ok)
                    throw new Error(
                        `HTTP error! status: ${String(response.status)}`,
                    );
                const data = (await response.json()) as EventData;
                setEvent(data);
            } catch (err: unknown) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "An unknown error occurred",
                );
            } finally {
                setLoading(false);
            }
        })();
    }, [eventId]);

    const handleSeatSelect = (ticket: IssuedTicket) => {
        if (ticket.status !== "AVAILABLE") return;
        setSelectedSeats((prev) =>
            prev.some((s) => s.id === ticket.id)
                ? prev.filter((s) => s.id !== ticket.id)
                : [...prev, ticket],
        );
    };

    const handleAttendeeInfoChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const { name, value } = e.target;
        if (name === "fullName") {
            const parts = value.split(" ");
            setAttendeeInfo((prev) => ({
                ...prev,
                first_name: parts[0] || "",
                last_name: parts.slice(1).join(" "),
            }));
        } else {
            setAttendeeInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleProceedToPayment = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        if (!attendeeInfo.email || !attendeeInfo.first_name) {
            alert("Please fill in your name and email.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        const payload = {
            ticketIds: selectedSeats.map((seat) => seat.id),
            attendee: attendeeInfo,
        };

        try {
            const response = await fetch("http://localhost:5000/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = (await response.json()) as {
                    message?: string;
                };
                throw new Error(errorData.message || "Failed to create order.");
            }

            const newOrder = await response.json();

            navigate(`/payment`, {
                state: {
                    order: newOrder,
                    eventDetails: event,
                    orderDetails: { tickets: selectedSeats },
                },
            });
        } catch (err: unknown) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An unknown error occurred.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading)
        return <div className="text-center py-20">Loading seat map...</div>;
    if (error && !isProcessing)
        return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!event)
        return <div className="text-center py-20">Event not found.</div>;

    const uniqueTicketClasses = Array.from(
        new Map(
            event.tickets.map((t) => [
                t.class,
                { name: t.class, color: t.classColor || "#CCCCCC" },
            ]),
        ).values(),
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
                        <h3 className="text-xl font-bold mb-4">
                            Your Information
                        </h3>
                        <BuyerInfoForm
                            buyerInfo={{
                                fullName:
                                    `${attendeeInfo.first_name} ${attendeeInfo.last_name}`.trim(),
                                email: attendeeInfo.email,
                                phone: "",
                            }}
                            onInfoChange={handleAttendeeInfoChange}
                        />
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <SeatMapOrderSummary
                        selectedSeats={selectedSeats}
                        isProcessing={isProcessing}
                        onProceed={() => {
                            void handleProceedToPayment();
                        }}
                    />
                    {error && isProcessing && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                            {error}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
