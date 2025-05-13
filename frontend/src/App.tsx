// import React from 'react';
import Navbar from "./components/navbar";
import SpecialEventsCarousel from "./components/special-events-carousel";
import UpcomingEvents from "./components/UpcomingEvents.tsx";
import Footer from "./components/Footer.tsx";
import TrustedBrands from "./components/TrustedBrands.tsx";

function App() {
    return (
        <>
            <Navbar />
            <SpecialEventsCarousel />
            <UpcomingEvents />
            <TrustedBrands />
            <Footer />
        </>
    );
}

export default App;
