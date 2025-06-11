import React, { useState } from "react";

interface sendSeatmapButtonConfig {
    selectedSeatStartCoord: [number, number] | null;
    selectedSeatEndCoord: [number, number] | null;
    selectedVenueID: number;
    hasSelectionChanged: boolean;
    setHasSelectionChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Send Seatmap button.
 *
 * Default State: button read "Save", but not clickable.
 * - Change to Ready state once a change in seat selection is detected.
 *
 * Ready State: button read "Save", clickable.
 * - Change to In Progress state once clicked.
 *
 * In Progress State: button read "Saving...", not clickable.
 * - Change to Save Failed: if the POST request for saving failed.
 * - Change to Save Success: if the POST request for saving succeeded.
 *
 * Save Failed state: button read "Failed to Save", not clickable. Background turn to red.
 * - Change to Ready state after 1.5s.
 *
 * Save Success state: button read "Save Success", not clickable. Background turn to green.
 * - Change to Default state after 1.5s.
 *
 * @author LunaciaDev
 */
export const SendSeatmapButton = ({
    selectedSeatStartCoord,
    selectedSeatEndCoord,
    selectedVenueID,
    hasSelectionChanged,
    setHasSelectionChanged,
}: sendSeatmapButtonConfig) => {
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
            if (
                selectedSeatStartCoord === null ||
                selectedSeatEndCoord === null
            ) {
                return;
            }

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const response = await fetch("gttps://localhost:5000/api/data", {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    SeatmapStartCoordinate: selectedSeatStartCoord,
                    SeatmapEndCoordinate: selectedSeatEndCoord,
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
            className=".bg-blue-600"
        >
            {getButtonText()}
        </button>
    );
};
