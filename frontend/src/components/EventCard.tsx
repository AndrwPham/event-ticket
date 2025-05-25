import { FC } from 'react';
import { Calendar, MapPin } from 'lucide-react';

export interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  price: string;
  followers: string;
  image: string;
  category: string;
}

interface EventCardProps {
  event: Event;
  onClick?: (event: Event) => void;
}

const EventCard: FC<EventCardProps> = ({ event, onClick }) => {

    event.image = "https://placehold.co/306x170";

    return (
        <div 
            className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => onClick?.(event)}
        >
            <div className="aspect-9/5 relative">
            <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-auto object-cover rounded-lg"
            />
            </div>
            <div className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{event.title}</h3>
            <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span className="text-orange-600 font-medium">{event.date}</span></div>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /><span className="truncate">{event.location}</span></div>
                <div className="text-gray-900 font-medium">{event.price}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs text-purple-600 font-medium mb-1">{event.category.toUpperCase()}</div>
            </div>
            </div>
        </div>
    );
} 

export default EventCard;
