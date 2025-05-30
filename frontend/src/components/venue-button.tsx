import './venue-button.css';

interface VenueButtonConfiguration {
    venueName: string,
    activeVenueName: string | null,
    setActiveVenue: React.Dispatch<React.SetStateAction<string>>,
}

/**
 * Button to select a venue.
 * 
 * This is not meant to be used by itself - please use VenueButtonGroup.
 * 
 * @author LunaciaDev
 */
const VenueButton = ({ venueName, activeVenueName, setActiveVenue: setSelectedVenue }: VenueButtonConfiguration) => {
    const handleMouseUp = () => {
        setSelectedVenue(venueName);
    }

    return <button className={`venue-button ${activeVenueName === venueName ? 'selected' : ''}`} onMouseUp={handleMouseUp}>
        <img className='venue-image' src='https://placehold.co/250x150' />
        <div className='venue-name'> {venueName} </div>
    </button>
}

export default VenueButton;