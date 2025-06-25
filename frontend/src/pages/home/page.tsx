import { FC, useState, useEffect } from "react";
import SpecialEventsCarousel from "./components/SpecialEventsCarousel";
import UpcomingEvents from "./components/UpcomingEvents";
import TrustedBrands from "./components/TrustedBrands";

// Define the shape of the event data for type safety
export interface LiveEvent {
    id: string;
    title: string;
    active_start_date: string;
    venue: { name: string } | null;
    images: { url: string }[];
}

const Home: FC = () => {
    const [events, setEvents] = useState<LiveEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/events");
                if (!response.ok) throw new Error("Failed to fetch events");
                const data = (await response.json()) as LiveEvent[];
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };
        void fetchEvents();
    }, []);

    return (
        <div>
            <SpecialEventsCarousel />
            {loading ? (
                <div className="text-center py-20">Loading Events...</div>
            ) : (
                <UpcomingEvents events={events} />
            )}
            <TrustedBrands />
        </div>
    );
};

export default Home;
