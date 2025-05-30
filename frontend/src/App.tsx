// import React from 'react';
import SeatMap from "./components/seat-map";
import VenueButtonGroup from "./components/venue-button-group";

function App() {
  return (
    <>
      <VenueButtonGroup venueNames={["Venue A", "Venue B", "Venue C"]} />
      <SeatMap rowCount={10} colCount={10} />
    </>
  );
}

export default App;
