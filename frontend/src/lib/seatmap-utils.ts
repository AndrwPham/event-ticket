import { SeatCell, SeatClass, SeatAssignments, SeatMapConfig } from "@/types/event";

// Define the ISeat interface that was missing
export interface ISeat {
    id: string;
    tier: string;
    price: number;
    status: 'available' | 'sold' | 'reserved';
}

/**
 * Generates a detailed seats object required by the VenueMap component.
 *
 * @param layout - The 2D array representing the venue's physical layout.
 * @param seatClasses - The array of available seat classes (e.g., VIP, Standard).
 * @param seatAssignments - An object mapping specific seat IDs to their class ID.
 * @returns An object where each key is a seatId and the value is a detailed ISeat object.
 */
export const generateSeatsObject = (
    layout: SeatCell[][],
    seatClasses: SeatClass[],
    seatAssignments: SeatAssignments
): { [seatId: string]: ISeat } => {
    const seats: { [seatId: string]: ISeat } = {};
    const standardClass = seatClasses.find(c => c.id === 'standard');

    layout.forEach(row => {
        row.forEach(cell => {
            // Process only cells that are actual seats with an ID
            if (cell.type === 'seat' && cell.seatId) {
                const seatId = cell.seatId;

                // Determine the class of the seat from assignments, defaulting to 'standard'
                const assignedClassId = seatAssignments[seatId] || 'standard';
                let seatClass = seatClasses.find(c => c.id === assignedClassId);

                // Fallback to the standard class if the assigned class doesn't exist
                if (!seatClass) {
                    seatClass = standardClass;
                }

                // Build the final ISeat object
                if (seatClass) {
                    seats[seatId] = {
                        id: seatId,
                        tier: seatClass.name,
                        price: seatClass.price ?? 0,
                        // For the editor, all seats are 'available' by default. 'sold' status would come from an event's booking data.
                        status: 'available',
                    };
                }
            }
        });
    });

    return seats;
};

export const convertSeatMapToTicketSchema = (config: SeatMapConfig) => {
    // Define the type for class details
    interface ClassDetails {
        label: string;
        price: number;
        seats: Array<{ seatNumber: string; price: number }>;
    }

    // 1. Create a map for easy lookup of class details.
    const classDetailsMap = new Map<string, ClassDetails>();
    config.seatClasses.forEach(cls => {
        // Fix: Remove the incorrect quantity check - SeatClass doesn't have a quantity property
        if (cls.id !== 'unavailable') {
            classDetailsMap.set(cls.id, {
                label: cls.name,
                price: cls.price || 0,
                seats: []
            });
        }
    });

    // 2. Go through each seat assignment and push it into the correct class.
    for (const seatId in config.seatAssignments) {
        const classId = config.seatAssignments[seatId];

        const classInfo = classDetailsMap.get(classId);
        if (classInfo) {
            classInfo.seats.push({
                seatNumber: seatId,
                price: classInfo.price
            });
        }
    }

    // 3. Convert the map back to an array and add the quantity.
    const finalClasses = Array.from(classDetailsMap.values()).map(cls => ({
        ...cls,
        quantity: cls.seats.length // The quantity is the count of assigned seats.
    }));

    return {
        classes: finalClasses,
    };
};
