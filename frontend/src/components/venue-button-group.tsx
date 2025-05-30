import { useState } from "react";
import VenueButton from "./venue-button";
import './venue-button-group.css';

interface VenueButtonGroupConfiguration {
    venueNames: string[]
}

/**
 * Create a set of venue buttons.
 * 
 * The first venue will automatically be the selected one.
 * TODO: add action that allow selecting a default venue
 * 
 * @author LunaciaDev
 */
const VenueButtonGroup = ({ venueNames }: VenueButtonGroupConfiguration) => {
    const [activeVenue, setActiveVenue] = useState<string>(venueNames[0]);

    return <div className="venue-button-group">
        {Array.from(venueNames).map((venueName) => {
            return <VenueButton venueName={venueName} activeVenueName={activeVenue} setActiveVenue={setActiveVenue} />
        })}
    </div>
}

export default VenueButtonGroup;