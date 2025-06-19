import { FC, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { allEvents } from "../../data/_mock_db";
import { allVenues } from "../../data/_mock_venues";
import { ISeat } from "../../types";

import VenueMap from "./components/VenueMap";
import SeatMapOrderSummary from "./components/SeatMapOrderSummary";
import SeatMapLegend from "./components/SeatMapLegend";

const SeatMapPage: FC = () => {
    const navigate = useNavigate();
    const { id: eventId } = useParams<{ id: string }>();

    const event = useMemo(
        () => allEvents.find((e) => String(e.id) === eventId),
        [eventId],
    );
    const venue = useMemo(
        () => allVenues.find((v) => v.id === event?.venueId),
        [event],
    );
    const initialSeatData = useMemo(() => event?.seats || {}, [event]);

    const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);

    if (!event || !venue) {
        return (
            <div className="text-center p-12">
                Event or venue layout not found.
            </div>
        );
    }

    const handleSeatClick = (seat: ISeat) => {
        if (seat.status === "sold") return; // Cannot select sold seats

        const isSelected = selectedSeats.some((s) => s.id === seat.id);

        if (isSelected) {
            // Deselect the seat
            setSelectedSeats((currentSeats) =>
                currentSeats.filter((s) => s.id !== seat.id),
            );
        } else {
            // Select the seat
            setSelectedSeats((currentSeats) => [...currentSeats, seat]);
        }
    };

    const handleProceedToPayment = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        // Navigate to the payment page with the selected seats
        navigate(`/event/${String(eventId)}/payment`, {
            state: {
                eventDetails: event,
                orderDetails: {
                    tickets: selectedSeats.map((seat) => ({
                        name: `Seat ${seat.id} (${seat.tier})`,
                        quantity: 1,
                        price: seat.price,
                    })),
                },
            },
        });
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {event.title}
                </h1>
                <h2 className="text-md sm:text-lg text-gray-600 mb-6">
                    {venue.name}
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left side: The Seat Map and Legend */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <VenueMap
                                layout={venue.layout}
                                seats={initialSeatData}
                                selectedSeats={selectedSeats}
                                onSeatClick={handleSeatClick}
                            />
                        </div>
                        <SeatMapLegend />
                    </div>

                    {/* Right side: The Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <SeatMapOrderSummary
                            selectedSeats={selectedSeats}
                            onProceed={handleProceedToPayment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatMapPage;
