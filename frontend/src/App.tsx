// import React from 'react';
import Navbar from "./components/navbar";
import SpecialEventsCarousel from "./components/special-events-carousel";
import UpcomingEvents from "./components/UpcomingEvents.tsx";
import Footer from "./components/Footer.tsx";

function App() {
    return (
        <>
            <Navbar />
            <SpecialEventsCarousel />
            <UpcomingEvents />
            <Footer />
        </>
    );
}

export default App;
