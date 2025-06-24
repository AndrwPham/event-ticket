export type Ticket = {
    id: string;
    label: string;
    quantity: number;
    description?: string;
    price: number;
    currency: 'VND' | 'USD';
};

export type EventFormData = {
    eventName: string;
    eventType: 'online' | 'onsite'; //BUG:  conflict onsite and offline in backend
    venueName: string;
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
    eventLogo: File | null;
    eventCover: File | null;
};
