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
                        seatClasses: [
                            {
                                id: "unavailable",
                                name: "Unavailable",
                                price: null,
                                color: "#D1D5DB",
                            },
                            {
                                id: "standard",
                                name: "Standard",
                                price: 0,
                                color: "#8c8e91",
                            },
                            {
                                id: "vip",
                                name: "VIP",
                                price: 50,
                                color: "#f8e45c",
                            },
                            {
                                id: "special-vip",
                                name: "Special VIP",
                                price: 100,
                                color: "#22c55e",
                            },
                        ],
                        seatAssignments: {
                            B1: "vip",
                            B2: "vip",
                            A1: "vip",
                            A2: "special-vip",
                            A3: "special-vip",
                            B3: "vip",
                            A4: "special-vip",
                            B4: "vip",
                            A5: "special-vip",
                            B5: "vip",
                            A6: "vip",
                            B6: "vip",
                            D1: "unavailable",
                            D2: "unavailable",
                            D3: "unavailable",
                            D4: "unavailable",
                            D5: "unavailable",
                            D6: "unavailable",
                        },
                    },
                ]}
            />
        </>
    );
}

export default App;
