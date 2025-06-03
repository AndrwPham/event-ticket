import { VenueConfig } from "./components/venue-config";

function App() {
  return (
    <>
      <VenueConfig venueList={[{
        id: 0,
        name: "Venue A",
        size: [5, 10]
      }, {
        id: 1,
        name: "Venue B",
        size: [6, 12],
      }, {
        id: 2,
        name: "Venue C",
        size: [4, 5],
      }]} />
    </>
  );
}

export default App;
