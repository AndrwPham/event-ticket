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
}

export interface IOrderTicket {
    type: string;
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
