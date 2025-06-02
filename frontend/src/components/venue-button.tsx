import './venue-button.css';

interface VenueButtonConfiguration {
    venueName: string,
    selectedVenueName: string | null,

    /**
     * Event handler from parent component.
     * 
     * @param venueName The name of the venue represented by the button
     */
    setSelectedVenue: (venueName: string) => void,
}

/**
 * Button to select a venue.
 * 
 * This is not meant to be used by itself - please use VenueButtonGroup.
 * 
 * @author LunaciaDev
 */
const VenueButton = ({ venueName, selectedVenueName: activeVenueName, setSelectedVenue: setSelectedVenue }: VenueButtonConfiguration) => {
    const handleMouseUp = () => {
        setSelectedVenue(venueName);
    }

    return <button className={`p-[5px] rounded ${activeVenueName === venueName ? 'bg-blue-200' : 'bg-white '}`} onMouseUp={handleMouseUp}>
        <img className='rounded' src='https://placehold.co/250x150' />
        <div className='mt-[5px] text-black'> {venueName} </div>
    </button>
}

export default VenueButton;