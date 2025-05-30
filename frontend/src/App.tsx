import VenueConfig from "./components/venue-config";

function App() {
  return (
    <>
      <VenueConfig venues={[{
        name: "Venue A",
        size: [5, 10]
      }, {
        name: "Venue B",
        size: [6, 12],
      }, {
        name: "Venue C",
        size: [4, 5],
      }]} />
    </>
  );
}

export default App;
