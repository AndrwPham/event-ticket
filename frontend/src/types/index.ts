// This file will hold all the common data shapes for our application.

export interface ITier {
    name: string;
    price: number;
}

export interface ISchedule {
    datetime: string;
    tiers: ITier[];
}

export interface IEvent {
    id: number;
    title: string;
    organizer: {
        name: string;
        logoUrl: string;
    };
    location: {
        name: string;
        address: string;
    };
    schedule: ISchedule[];
    posterUrl: string;
    description: string;

    venueId?: number;
    seats?: { [seatId: string]: ISeat };
}

export interface IOrderTicket {
    name: string;
    quantity: number;
    price: number;
}

export interface IOrderDetails {
    tickets: IOrderTicket[];
}

// This defines the shape of the data we pass between pages
export interface ILocationState {
    eventDetails: IEvent;
    orderDetails: IOrderDetails;
}

export interface IOrderResponse {
    status: "PAID" | "PENDING" | "CANCELLED" | "EXPIRED" | "PROCESSING";
    orderCode: number;
    amount: number;
    description: string;
}

export interface IApiResponse {
    error: number;
    message: string;
    data: IOrderResponse | null;
}

export interface IPayOSEvent {
    orderCode: number;
    [key: string]: unknown; // Allow for other properties
}

export interface ISeat {
    id: string; // e.g., "A1"
    tier: string; // e.g., "VIP", "Standard"
    price: number;
    status: "available" | "sold" | "reserved";
}

export type LayoutCell =
    | { type: "seat"; seatId: string }
    | { type: "aisle" }
    | { type: "empty" }
    | { type: "stage" }
    | { type: "lectern" };

export interface IVenue {
    id: number;
    name: string;
    layout: LayoutCell[][];
}
