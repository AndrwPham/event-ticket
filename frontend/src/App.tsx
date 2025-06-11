import { ClickSeatMap } from "./components/click-seat-map";

function App() {
    return (
        <>
            <ClickSeatMap
                venueSize={{
                    rowCount: 9,
                    colCount: 9,
                }}
                seatTypes={[
                    {
                        colorCode: "bg-blue-200",
                        tierID: 1,
                        startPos: [0, 0],
                        endPos: [0, 8],
                    },
                    {
                        colorCode: "bg-yellow-200",
                        tierID: 2,
                        startPos: [1, 2],
                        endPos: [1, 6],
                    },
                ]}
                bookedSeats={[
                    [0, 3],
                    [0, 4],
                    [0, 5],
                    [1, 3],
                    [2, 5],
                ]}
                configuredSeats={{
                    startPos: [0, 0],
                    endPos: [8, 8],
                }}
            />
        </>
    );
}

export default App;
