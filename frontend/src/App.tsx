import { VenueConfig } from "./components/VenueConfig";

function App() {
    return (
        <>
            <VenueConfig
                venueList={[
                    {
                        id: 1,
                        name: "Standard Auditorium",
                        layout: [
                            [
                                { type: "stage" },
                                { type: "stage" },
                                { type: "stage" },
                                { type: "stage" },
                                { type: "stage" },
                                { type: "stage" },
                                { type: "stage" },
                            ],
                            [
                                { type: "empty" },
                                { type: "empty" },
                                { type: "empty" },
                                { type: "empty" },
                                { type: "empty" },
                                { type: "empty" },
                                { type: "empty" },
                            ],
                            [
                                { type: "seat", seatId: "A1" },
                                { type: "seat", seatId: "A2" },
                                { type: "seat", seatId: "A3" },
                                { type: "aisle" },
                                { type: "seat", seatId: "A4" },
                                { type: "seat", seatId: "A5" },
                                { type: "seat", seatId: "A6" },
                            ],
                            [
                                { type: "seat", seatId: "B1" },
                                { type: "seat", seatId: "B2" },
                                { type: "seat", seatId: "B3" },
                                { type: "aisle" },
                                { type: "seat", seatId: "B4" },
                                { type: "seat", seatId: "B5" },
                                { type: "seat", seatId: "B6" },
                            ],
                            [
                                { type: "seat", seatId: "C1" },
                                { type: "seat", seatId: "C2" },
                                { type: "seat", seatId: "C3" },
                                { type: "aisle" },
                                { type: "seat", seatId: "C4" },
                                { type: "seat", seatId: "C5" },
                                { type: "seat", seatId: "C6" },
                            ],
                            [
                                { type: "seat", seatId: "D1" },
                                { type: "seat", seatId: "D2" },
                                { type: "seat", seatId: "D3" },
                                { type: "aisle" },
                                { type: "seat", seatId: "D4" },
                                { type: "seat", seatId: "D5" },
                                { type: "seat", seatId: "D6" },
                            ],
                        ],
                    },
                ]}
            />
        </>
    );
}

export default App;
