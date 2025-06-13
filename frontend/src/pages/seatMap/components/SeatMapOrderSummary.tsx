import { FC } from "react";
import { ISeat } from "../../../types";

interface SeatMapOrderSummaryProps {
    selectedSeats: ISeat[];
    onProceed: () => void;
}

const SeatMapOrderSummary: FC<SeatMapOrderSummaryProps> = ({
    selectedSeats,
    onProceed,
}) => {
    const totalPrice = selectedSeats.reduce(
        (total, seat) => total + seat.price,
        0,
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">
                Your Selection
            </h3>
            <div className="space-y-2 mb-4 min-h-[100px]">
                {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat) => (
                        <div
                            key={seat.id}
                            className="flex justify-between text-sm"
                        >
                            <span>
                                Seat {seat.id} ({seat.tier})
                            </span>
                            <span className="font-semibold">
                                {seat.price.toLocaleString()}đ
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        Select a seat from the map
                    </p>
                )}
            </div>
            <div className="border-t pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString()}đ</span>
                </div>
                <button
                    onClick={onProceed}
                    disabled={selectedSeats.length === 0}
                    className="w-full mt-4 py-3 bg-indigo-600 text-white font-bold rounded-lg transition hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default SeatMapOrderSummary;
