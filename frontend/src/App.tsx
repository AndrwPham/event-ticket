// import React from 'react';
import Navbar from "./components/navbar";
import SpecialEventsCarousel from "./components/special-events-carousel";
import UpcomingEvents from "./components/UpcomingEvents.tsx";

function App() {
  return (
    <>
      <Navbar />
      <SpecialEventsCarousel />
      <UpcomingEvents />
    </>
  );
}

export default App;
