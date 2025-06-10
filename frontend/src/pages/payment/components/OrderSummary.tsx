import { FC } from "react";
import { IEvent, IOrderDetails } from "../Payment";

interface OrderSummaryProps {
    eventDetails: IEvent;
    orderDetails: IOrderDetails;
}

const OrderSummary: FC<OrderSummaryProps> = ({
    eventDetails,
    orderDetails,
}) => {
    const subtotal = orderDetails.tickets.reduce(
        (acc, ticket) => acc + ticket.price * ticket.quantity,
        0,
    );
    const processingFee = 35000;
    const totalAmount = subtotal + processingFee;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md lg:sticky lg:top-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-4 mb-4">
                Tóm tắt đơn hàng
            </h2>
            <div className="space-y-2 mb-4">
                <h3 className="font-semibold">{eventDetails.title}</h3>
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
                <p className="text-sm text-gray-600">
                    {eventDetails.location.name}
                </p>
            </div>
            <div className="border-t border-b border-gray-200 py-4 space-y-2">
                {orderDetails.tickets.map((ticket) => (
                    <div
                        key={ticket.type}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {ticket.quantity}x {ticket.type}
                        </span>
                        <span className="font-semibold">
                            {new Intl.NumberFormat("vi-VN").format(
                                ticket.price * ticket.quantity,
                            )}
                            đ
                        </span>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng cộng</span>
                    <span>
                        {new Intl.NumberFormat("vi-VN").format(subtotal)}đ
                    </span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí xử lý</span>
                    <span>
                        {new Intl.NumberFormat("vi-VN").format(processingFee)}đ
                    </span>
                </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>Thành tiền</span>
                    <span>
                        {new Intl.NumberFormat("vi-VN").format(totalAmount)}đ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
