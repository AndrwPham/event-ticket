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
    startingPrice: number;

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

export interface ApiError {
    message: string | string[];
    error?: string;
    statusCode?: number;
}

export interface User {
    id: string;
    email: string;
    username: string;
}

export function isApiError(data: unknown): data is ApiError {
    return typeof data === "object" && data !== null && "message" in data;
}
export interface IssuedTicket {
    id: string;
    price: number;
    class: string;
    seat: string;
    status: "UNAVAILABLE" | "AVAILABLE" | "HELD" | "PAID";
    classColor?: string;
    [key: string]: unknown;
}

export interface Venue {
    id: string;
    name: string;
    layout: {
        rows: { type: string; seatId?: string }[][];
    };
}

export interface EventData {
    id: string;
    title: string;
    tickets: IssuedTicket[];
    venue: Venue;
}

export interface LiveEvent {
    id: string;
    title: string;
    active_start_date: string;
    venue: { name: string } | null;
    images: { url: string }[];
    // Add any other fields you need for the event card
}
export enum TicketStatus {
    AVAILABLE = "AVAILABLE",
    HELD = "HELD",
    SOLD = "SOLD",
    RESERVED = "RESERVED",
}

export enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    EXPIRED = "EXPIRED",
}
