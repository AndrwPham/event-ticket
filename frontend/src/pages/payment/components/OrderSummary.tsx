import { FC } from "react";
import { Event, OrderDetails } from "../../../types";

interface GroupedTicket {
    name: string;
    quantity: number;
    price: number;
}

interface OrderSummaryProps {
    eventDetails: Event;
    orderDetails: OrderDetails;
}

const OrderSummary: FC<OrderSummaryProps> = ({
                                                 eventDetails,
                                                 orderDetails,
                                             }) => {
    // This function groups tickets by name and price for a cleaner display.
    const groupedTickets = orderDetails.tickets.reduce<{
        [key: string]: GroupedTicket;
    }>((acc, ticket) => {
        const key = `${ticket.name}-${String(ticket.price)}`;
        if (!(key in acc)) {
            acc[key] = { ...ticket, quantity: 0 };
        }
        acc[key].quantity += ticket.quantity;
        return acc;
    }, {});

    // This function calculates the total amount of the order.
    const totalAmount = orderDetails.tickets.reduce(
        (acc, ticket) => acc + ticket.price * ticket.quantity,
        0,
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-4">
                Order Summary
            </h2>
            <div className="space-y-2 mb-4">
                {/* Ensure eventDetails exists before trying to access its properties */}
                {eventDetails && (
                    <>
                        <h3 className="font-semibold">{eventDetails.title}</h3>

                        {/* FIXED: Added optional chaining to 'schedule' and 'location'.
                          This safely checks if these properties exist before trying to display them,
                          which prevents the application from crashing.
                        */}
                        {eventDetails.schedule?.[0]?.datetime && (
                            <p className="text-sm text-gray-600">
                                {new Date(
                                    eventDetails.schedule[0].datetime,
                                ).toLocaleDateString("vi-VN", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        )}
                        {eventDetails.location?.name && (
                            <p className="text-sm text-gray-600">
                                {eventDetails.location.name}
                            </p>
                        )}
                    </>
                )}
            </div>
            <div className="border-t border-b border-gray-200 py-4 space-y-2">
                {Object.values(groupedTickets).map((ticket) => (
                    <div
                        key={ticket.name}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {ticket.quantity}x {ticket.name}
                        </span>
                        <span className="font-semibold">
                            {new Intl.NumberFormat("vi-VN").format(
                                ticket.price * ticket.quantity,
                            )}
                        </span>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 py-4 space-y-2">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>
                        {new Intl.NumberFormat("vi-VN").format(totalAmount)}đ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
