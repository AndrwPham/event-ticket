
export type TicketStatus = "AVAILABLE" | "UNAVAILABLE" | "HELD" | "PAID";

export interface IssuedTicket {
    id: string;
    seat: string;
    class: string;
    price: number;
    status: TicketStatus;
    classColor?: string; // Optional color for UI display
}

export interface Venue {
    name: string;
    layout: {
        rows: {
            type: "seat" | "aisle" | "empty";
            seatId?: string;
        }[][];
    };
}

export interface Event {
    id: number | string;
    title: string;
    organizer: {
        name: string;
        logoUrl: string;
    };
    location: {
        name: string;
        address: string;
    };
    schedule: { datetime: string }[];
    posterUrl: string;
    description: string;
    startingPrice: number;
    seats?: { [seatId: string]: any }; // Using 'any' for now, can be a 'Seat' interface
}

export interface EventData {
    id: string;
    title: string;
    venue: Venue;
    tickets: IssuedTicket[];
}

export interface BuyerInfo {
    fullName: string;
    email: string;
    phone: string;
}

export interface OrderDetails {
    tickets: {
        id?: string; // Optional ticket ID
        name: string;
        quantity: number;
        price: number;
    }[];
}

export interface Order {
    id: string;
    totalPrice: number;
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
    method: 'PAYOS' | string;
    attendeeId: string;
    ticketItems: string[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderResponse {
    status: "PAID" | "PENDING" | "CANCELLED" | "EXPIRED" | "PROCESSING";
    orderCode: number;
    amount: number;
    description: string;
}

export interface ApiResponse {
    error: number;
    message: string;
    data: OrderResponse | null;
}

export interface CreateOrderResponse {
    order: Order;
    paymentLink: {
        checkoutUrl: string;
        orderCode: number;
        [key: string]: unknown;
    };
    message?: string;
}

export interface LocationState {
    order?: Order;
    eventDetails: Event;
    orderDetails: OrderDetails;
    buyerInfo: BuyerInfo;
}
export interface ApiError {
    message: string | string[];
    error?: string;
    statusCode?: number;
}

export function isApiError(data: unknown): data is ApiError {
    return typeof data === "object" && data !== null && "message" in data;
}