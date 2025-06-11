import { useState } from "react";
import { DragSeatMap } from "./drag-seat-map";
import { VenueButtonGroup } from "./venue-button-group";
import { SendSeatmapButton } from "./send-seatmap-button";

export interface Venue {
    id: number;
    name: string;
    size: [number, number];
}

interface VenueList {
    venueList: Venue[];
}

/**
 * Venue seat configuration page.
 *
 * @example
 *  <VenueConfig venueList={[
 *      {
 *          id: 0,
 *          name: "Venue A",
 *          size: [5, 10]
 *      }, {
 *          id: 1,
 *          name: "Venue B",
 *          size: [6, 12],
 *      }, {
 *          id: 2,
 *          name: "Venue C",
 *          size: [4, 5],
 *      }
 *  ]}
 *  />
 *
 * @author LunaciaDev
 */
export const VenueConfig = ({ venueList }: VenueList) => {
    const [selectedVenue, setSelectedVenue] = useState(venueList[0].id);
    const [venueSize, setVenueSize] = useState(venueList[0].size);
    const [selectedSeatStartCoord, setSelectedSeatStartCoord] = useState<
        [number, number] | null
    >(null);
    const [selectedSeatEndCoord, setSelectedSeatEndCoord] = useState<
        [number, number] | null
    >(null);
    const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

    const handleSelectedVenueChange = (venueID: number) => {
        venueList.forEach((venue) => {
            if (venue.id === venueID) {
                setSelectedVenue(venue.id);
                setVenueSize(venue.size);
                setHasSelectionChanged(true);

                // reset the selected coordinates.
                setSelectedSeatStartCoord(null);
                setSelectedSeatEndCoord(null);
            }
        });
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
            <DragSeatMap
                key={selectedVenue}
                rowCount={venueSize[0]}
                colCount={venueSize[1]}
                setSelectedSeatStartCoord={setSelectedSeatStartCoord}
                setSelectedSeatEndCoord={setSelectedSeatEndCoord}
                setHasSelectionChanged={setHasSelectionChanged}
            />
            <SendSeatmapButton
                selectedSeatStartCoord={selectedSeatStartCoord}
                selectedSeatEndCoord={selectedSeatEndCoord}
                selectedVenueID={selectedVenue}
                hasSelectionChanged={hasSelectionChanged}
                setHasSelectionChanged={setHasSelectionChanged}
            />
        </div>
    );
};
