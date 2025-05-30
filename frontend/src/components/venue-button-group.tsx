import { useState } from "react";
import VenueButton from "./venue-button";
import './venue-button-group.css';

interface VenueButtonGroupConfiguration {
    venueNames: string[],
    selectedVenue: string,

    /**
     * Event handler from parent component.
     * 
     * This is meant to be passed into the child buttons.
     */
    setSelectedVenue: (venueName: string) => void,
}

/**
 * Create a set of venue buttons.
 * 
 * The first venue will automatically be the selected one.
 * TODO: add action that allow selecting a default venue
 * 
 * @author LunaciaDev
 */
const VenueButtonGroup = ({ venueNames, selectedVenue, setSelectedVenue }: VenueButtonGroupConfiguration) => {
    return <div className="venue-button-group">
        {Array.from(venueNames).map((venueName) => {
            return <VenueButton venueName={venueName} selectedVenueName={selectedVenue} setSelectedVenue={setSelectedVenue} />
        })}
    </div>
}

export default VenueButtonGroup;