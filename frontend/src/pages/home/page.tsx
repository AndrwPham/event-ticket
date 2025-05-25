import { FC } from "react";
import SpecialEventsCarousel from "./components/SpecialEventsCarousel";
import UpcomingEvents from "./components/UpcomingEvents";
import TrustedBrands from "./components/TrustedBrands";

const Home: FC = () => {
  return (
    <div>
      <SpecialEventsCarousel />
      <UpcomingEvents />
      <TrustedBrands />
    </div>
  );
};

export default Home;