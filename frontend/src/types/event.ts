export type Tag = {
    id: string;
    name: string;
};

export type Ticket = {
    id: string;
    label: string;
    quantity: number;
    description?: string;
    price: number;
    currency: 'VND' | 'USD';
};

export type UploadedImage = {
    key: string;
    isPublic: boolean;
    contentType: string;
};

export type ProvidedVenue = {
    id: string;
    name: string;
    address: {
        street: string;
        ward: string;
        district: string;
        city: string;
    }
}

export type EventFormData = {
    eventName: string;
    eventType: 'online' | 'onsite';
    // IMPROVEMENT: Removed venueType. The presence of providedVenueId will determine the type.
    providedVenueId: string | null;
    venueType: 'custom' | 'provided';
    // IMPROVEMENT: These fields are now optional, only used for custom venues.
    venueName?: string; 
    address: {
        city: string;
        district: string;
        ward: string;
        street: string;
    };
    category: string;
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
    tickets: Ticket[];
    payment: {
        accountOwner: string;
        accountNumber: string;
        bank: string;
        branch: string;
    };
    eventPoster: File | null;
    eventCovers: File[];
};
