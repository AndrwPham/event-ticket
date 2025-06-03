import './venue-button.css';

interface VenueButtonConfiguration {
    venueName: string,
    venueID: number,
    selectedVenueID: number | null,

    /**
     * Event handler from parent component.
     * 
     * @param venueID The name of the venue represented by the button
     */
    setSelectedVenue: (venueID: number) => void,
}

/**
 * Button to select a venue.
 * 
 * This is not meant to be used by itself - please use VenueButtonGroup.
 * 
 * @author LunaciaDev
 */
export const VenueButton = ({ venueName, venueID, selectedVenueID, setSelectedVenue }: VenueButtonConfiguration) => {
    const handleMouseUp = () => {
        setSelectedVenue(venueID);
    }

    return <button className={`p-[5px] rounded ${selectedVenueID === venueID ? 'bg-blue-200' : 'bg-white '}`} onMouseUp={handleMouseUp}>
        <img className='rounded' src='https://placehold.co/250x150' />
        <div className='mt-[5px] text-black'> {venueName} </div>
    </button>
}