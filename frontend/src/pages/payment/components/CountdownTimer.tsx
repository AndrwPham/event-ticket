import { FC, useState, useEffect } from "react";

interface CountdownTimerProps {
    initialSeconds: number;
    onTimerEnd: () => void;
}

const CountdownTimer: FC<CountdownTimerProps> = ({
    initialSeconds,
    onTimerEnd,
}) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);

    useEffect(() => {
        if (timeLeft === 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            onTimerEnd();
        }
    }, [timeLeft, onTimerEnd]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
                Time till complete order
            </h2>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
                {String(minutes).padStart(2, "0")}:
                {String(seconds).padStart(2, "0")}
            </p>
        </div>
    );
};

export default CountdownTimer;
