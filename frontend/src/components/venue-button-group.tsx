import { VenueButton } from "./venue-button";
import { Venue } from "./venue-config";
import './venue-button-group.css';

interface VenueButtonGroupConfiguration {
    venues: Venue[],
    selectedVenueID: number,

    /**
     * Event handler from parent component.
     * 
     * This is meant to be passed into the child buttons.
     */
    setSelectedVenue: (venueID: number) => void,
}

/**
 * Create a set of venue buttons.
 * 
 * The first venue will automatically be the selected one.
 * TODO: add action that allow selecting a default venue
 * 
 * @author LunaciaDev
 */
export const VenueButtonGroup = ({ venues, selectedVenueID, setSelectedVenue }: VenueButtonGroupConfiguration) => {
    return <div className="flex gap-[10px] m-[10px]">
        {Array.from(venues).map((venue) => {
            return <VenueButton venueName={venue.name} venueID={venue.id} selectedVenueID={selectedVenueID} setSelectedVenue={setSelectedVenue} />
        })}
    </div>
}