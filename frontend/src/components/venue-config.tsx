import { useState } from "react";
import { SeatMap } from "./seatmap";
import { VenueButtonGroup } from "./venue-button-group";
import { SendSeatmapButton } from "./send-seatmap-button";

export interface SeatCell {
    type: "seat" | "aisle" | "empty" | "stage";
    seatId?: string;
}

export interface Venue {
    id: number;
    name: string;
    layout: SeatCell[][];
}

interface VenueList {
    venueList: Venue[];
}

/**
 * Venue Configuration Component
 *
 * This component expects a list of possible venues and their standard configurations.
 * It allows the event organizer to modify the standard venue configuration with seat types:
 *
 * - Unavailable: The seat cannot be booked.
 * - Available:
 *   - Standard seat: All available seats start at this tier.
 *   - Tiered seat: Special seat class defined by the event organizer.
 *
 * TODO: Implement the ability to switch seat tiers.
 *
 * @example
 * <VenueConfig
 *   venueList={[
 *     {
 *       id: 1,
 *       name: "Standard Auditorium",
 *       layout: [
 *         [{ type: 'stage' }, { type: 'stage' }, { type: 'stage' }],
 *         [{ type: 'empty' }, { type: 'empty' }, { type: 'empty' }],
 *         [{ type: 'seat', seatId: 'A1' }, { type: 'aisle' }, { type: 'seat', seatId: 'A2' }],
 *         [{ type: 'seat', seatId: 'B1' }, { type: 'aisle' }, { type: 'seat', seatId: 'B2' }],
 *         [{ type: 'seat', seatId: 'C1' }, { type: 'aisle' }, { type: 'seat', seatId: 'C2' }],
 *         [{ type: 'seat', seatId: 'D1' }, { type: 'aisle' }, { type: 'seat', seatId: 'D2' }]
 *       ]
 *     }
 *   ]}
 * />
 *
 * @author LunaciaDev
 */
export const VenueConfig = ({ venueList }: VenueList) => {
    const [selectedVenue, setSelectedVenue] = useState(venueList[0].id);
    const [venueLayout, setVenueLayout] = useState(venueList[0].layout);
    const [selectedSeatStartId, setSelectedSeatStartId] = useState<
        string | null
    >(null);
    const [selectedSeatEndId, setSelectedSeatEndId] = useState<string | null>(
        null,
    );
    const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

    const handleSelectedVenueChange = (venueID: number) => {
        const venue = venueList.find((v) => v.id === venueID);
        if (venue) {
            setSelectedVenue(venue.id);
            setVenueLayout(venue.layout);
            setHasSelectionChanged(true);

            // reset the selected seats.
            setSelectedSeatStartId(null);
            setSelectedSeatEndId(null);
        }
    };

    return (
        <div className="seat-config">
            <h1>Venue Configuration</h1>
            <h2>Select Venue:</h2>
            <VenueButtonGroup
                venues={venueList}
                selectedVenueID={selectedVenue}
                setSelectedVenue={handleSelectedVenueChange}
            />
            <h2>Configure Venue Seat Map:</h2>
            <SeatMap
                key={selectedVenue}
                layout={venueLayout}
                setSelectedSeatStartId={setSelectedSeatStartId}
                setSelectedSeatEndId={setSelectedSeatEndId}
                setHasSelectionChanged={setHasSelectionChanged}
            />
            <SendSeatmapButton
                selectedSeatStartId={selectedSeatStartId}
                selectedSeatEndId={selectedSeatEndId}
                selectedVenueID={selectedVenue}
                hasSelectionChanged={hasSelectionChanged}
                setHasSelectionChanged={setHasSelectionChanged}
            />
        </div>
    );
};
