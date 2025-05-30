import { useState } from 'react';
import './venue-button.css';

interface VenueButtonConfiguration {
    venueName: string
}

const VenueButton = ({ venueName }: VenueButtonConfiguration) => {
    const [isActive, setIsActive] = useState(false);
    
    const handleClick = () => {
        console.log("Active Venue: " + venueName);
        setIsActive(true);
    }

    return <button className={`venue-button ${isActive ? 'selected' : ''}`} onMouseUp={handleClick}>
        <img className='venue-image' src='https://placehold.co/250x150' />
        <div className='venue-name'> {venueName} </div>
    </button>
}

export default VenueButton;