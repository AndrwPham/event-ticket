import { FC } from "react";
import { Calendar, MapPin } from "lucide-react";
import { MyTicket } from "../data/my_tickets_db";

interface TicketCardProps {
    ticket: MyTicket;
}

const statusStyles: Record<MyTicket["status"], string> = {
    Ready: "bg-blue-100 text-blue-800",
    Used: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Expired: "bg-yellow-100 text-yellow-800",
};

const TicketCard: FC<TicketCardProps> = ({ ticket }) => {
    let formattedDate = "";
    if (ticket.date) {
        try {
            formattedDate = new Intl.DateTimeFormat("en-US", {
                dateStyle: "full",
                timeStyle: "short",
            }).format(new Date(ticket.date));
        } catch {
            formattedDate = "Invalid date";
        }
    }

    return (
        <div className="flex flex-col md:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <img
                src={ticket.image}
                alt={ticket.title}
                className="w-full md:w-48 h-40 md:h-auto object-cover"
            />
            <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">
                            {ticket.title}
                        </h3>
                        <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[ticket.status]}`}
                        >
                            {ticket.status}
                        </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{ticket.location}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <button className="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-700">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
