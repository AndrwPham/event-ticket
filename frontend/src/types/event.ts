export type Tag = {
    id: string;
    name: string;
};

export type UploadedImage = {
    key: string;
    isPublic: boolean;
    contentType: string;
};

// --- Venue & Seat Map Types (from VenueConfig) ---

export type SeatCell = {
    type: "seat" | "aisle" | "empty" | "stage" | "lectern";
    seatId?: string; // only for type 'seat'
};

export type SeatClass = {
    id: string;       // e.g., 'vip', 'standard'
    name: string;     // e.g., 'VIP', 'Standard'
    price: number | null;
    color: string;
};

export type SeatAssignments = {
    [seatId: string]: string; // Maps a seatId (e.g., 'A1') to a classId (e.g., 'vip')
};

// This is the object that our new SeatMapEditor will output
export type SeatMapConfig = {
    seatClasses: SeatClass[];
    seatAssignments: SeatAssignments;
};

// --- Provided Venue Type (for the dropdown) ---

export type ProvidedVenue = {
    id: string; // Using string to be consistent
    name: string;
    // The raw layout structure for the venue
    layout: SeatCell[][];
    address: string;
    // A venue can come with a default configuration
    defaultSeatConfig?: SeatMapConfig; 
}

// --- Non-SeatMap Ticket Type ---

export type Ticket = {
    id:string;
    label: string;
    quantity: number;
    description?: string;
    price: number;
    currency: 'VND' | 'USD';
};

export type EventFormData = {
    eventName: string;
    eventType: 'online' | 'onsite';
    venueType: 'custom' | 'provided';
    providedVenueId: string | null;
    address: {
        city: string;
        district: string;
        ward: string;
        street: string;
    };
    tagIds: string[];
    description: string;
    organizer: {
        name: string;
        info: string;
        logo: File | null;
    };
    time: {
        start: string;
        end: string;
    };
    // This holds tickets for events WITHOUT a seat map
    tickets: Ticket[];
    // IMPROVEMENT: This will hold the configuration from our new editor
    seatMapConfig?: SeatMapConfig;
    payment: {
        accountOwner: string;
        accountNumber: string;
        bank: string;
        branch: string;
    };
    eventPoster: File | null;
    eventCovers: File[];
};
