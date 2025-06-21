import React, { useState } from "react";

interface SendSeatmapButtonConfig {
    selectedSeatStartId: string | null;
    selectedSeatEndId: string | null;
    selectedVenueID: number;
    hasSelectionChanged: boolean;
    setHasSelectionChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Send Seatmap button.
 *
 * @author LunaciaDev
 */
export const SendSeatmapButton = ({
    selectedSeatStartId,
    selectedSeatEndId,
    selectedVenueID,
    hasSelectionChanged,
    setHasSelectionChanged,
}: SendSeatmapButtonConfig) => {
    const state = Object.freeze({
        READY: 1,
        IN_PROGRESS: 2,
        SAVE_FAILED: 3,
        SAVE_SUCCESS: 4,
    });

    const [currentState, setCurrentState] = useState<number>(state.READY);

    const handleMouseUp = () => {
        switch (currentState) {
            case state.READY: {
                setCurrentState(state.IN_PROGRESS);
                setHasSelectionChanged(false);
                postSeatmapConfig().then(
                    () => {},
                    () => {},
                );
                break;
            }
        }
    };

    const postSeatmapConfig = async () => {
        try {
            if (selectedSeatStartId === null || selectedSeatEndId === null) {
                return;
            }

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const response = await fetch("https://localhost:5000/api/data", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    SeatmapStartId: selectedSeatStartId,
                    SeatmapEndId: selectedSeatEndId,
                    VenueID: selectedVenueID,
                }),
            });

            if (!response.ok) {
                setCurrentState(state.SAVE_FAILED);
                setTimeout(() => {
                    setCurrentState(state.READY);
                    setHasSelectionChanged(true);
                }, 1500);
                return;
            }

            setCurrentState(state.SAVE_SUCCESS);
            setTimeout(() => {
                setCurrentState(state.READY);
                setHasSelectionChanged(false);
            }, 1500);
        } catch {
            setCurrentState(state.SAVE_FAILED);
            setTimeout(() => {
                setCurrentState(state.READY);
                setHasSelectionChanged(true);
            }, 1500);
        }
    };

    const getButtonText = (): string => {
        switch (currentState) {
            case state.IN_PROGRESS:
                return "Saving...";
            case state.SAVE_FAILED:
                return "Save Failed";
            case state.SAVE_SUCCESS:
                return "Save Success";
            default:
                return "Save";
        }
    };

    return (
        <button
            onMouseUp={handleMouseUp}
            disabled={!hasSelectionChanged}
            className="bg-blue-600"
        >
            {getButtonText()}
        </button>
    );
};
