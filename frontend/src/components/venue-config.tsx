import { useState } from "react";
import { SeatMap } from "./seat-map";
import { VenueButtonGroup } from "./venue-button-group";

interface Venue {
    name: string,
    size: [number, number]
}

interface VenueList {
    venueList: Venue[]
}

/**
 * Venue seat configuration page.
 *
 * @example
 *  <VenueConfig venueList={[
 *      {
 *          name: "Venue A",
 *          size: [5, 10]
 *      }, {
 *          name: "Venue B",
 *          size: [6, 12],
 *      }, {
 *          name: "Venue C",
 *          size: [4, 5],
 *      }
 *  ]}
 *  />
 * 
 * @author LunaciaDev
 */
const VenueConfig = ({ venueList }: VenueList) => {
    const [selectedVenue, setSelectedVenue] = useState(venueList[0].name);
    const [venueSize, setVenueSize] = useState(venueList[0].size);
    const [selectedSeatStartCoord, setSelectedSeatStartCoord] = useState<[number, number] | null>(null);
    const [selectedSeatEndCoord, setSelectedSeatEndCoord] = useState<[number, number] | null>(null);

    const handleSelectedVenueChange = (venueName: string) => {
        venueList.forEach(venue => {
            if (venue.name === venueName) {
                setSelectedVenue(venue.name);
                setVenueSize(venue.size);

                // reset the selected coordinates.
                setSelectedSeatStartCoord(null);
                setSelectedSeatEndCoord(null);
            }
        });
    }

    return <div className="seat-config">
        <h1>Venue Configuration</h1>
        <h2>Select Venue:</h2>
        <VenueButtonGroup venueNames={Array.from(venueList).map((venue) => { return venue.name; })} selectedVenue={selectedVenue} setSelectedVenue={handleSelectedVenueChange} />
        <h2>Configure Venue Seat Map:</h2>
        <SeatMap key={selectedVenue} rowCount={venueSize[0]} colCount={venueSize[1]} setSelectedSeatStartCoord={setSelectedSeatStartCoord} setSelectedSeatEndCoord={setSelectedSeatEndCoord} />
    </div>
}

export default VenueConfig;