export type Event = {
    id: number;
    name: string;
    date: string;
    location: string;
    price: number;
    image: string;
    organizer: string;
    category: "Music" | "Sports" | "Arts" | "Business" | "Food";
    description: string;
    special?: "Special" | "New" | "Sold Out";
    isFree?: boolean;
};

export const events: Event[] = [
    {
        id: 1,
        name: "Jazz Night",
        date: "2024-08-15",
        location: "The Blue Note, New York",
        price: 50,
        image: "/images/jazz-night.jpg",
        organizer: "Jazz Club",
        category: "Music",
        description: "An evening of smooth jazz with top artists.",
    },
    {
        id: 2,
        name: "Marathon 2024",
        date: "2024-09-10",
        location: "Central Park, New York",
        price: 30,
        image: "/images/marathon.jpg",
        organizer: "NY Runners",
        category: "Sports",
        description: "Annual city marathon. All levels welcome.",
        special: "New",
    },
    {
        id: 3,
        name: "Art Expo",
        date: "2024-10-05",
        location: "Metropolitan Museum of Art",
        price: 75,
        image: "/images/art-expo.jpg",
        organizer: "Art World",
        category: "Arts",
        description:
            "Featuring modern and classical art from around the globe.",
    },
    {
        id: 4,
        name: "Tech Conference 2024",
        date: "2024-11-20",
        location: "Javits Center, New York",
        price: 200,
        image: "/images/tech-conference.jpg",
        organizer: "Tech Innovators",
        category: "Business",
        description: "The future of technology, today.",
        special: "Special",
    },
    {
        id: 5,
        name: "Food Festival",
        date: "2024-07-29",
        location: "Brooklyn Bridge Park",
        price: 40,
        image: "/images/food-festival.jpg",
        organizer: "Gourmet Inc.",
        category: "Food",
        description: "Taste the world in one place.",
        isFree: true,
    },
    {
        id: 6,
        name: "Summer Concert Series",
        date: "2024-08-01",
        location: "Prospect Park Bandshell",
        price: 60,
        image: "/images/summer-concert.jpg",
        organizer: "Music Fest",
        category: "Music",
        description: "Live music every weekend of August.",
    },
    {
        id: 7,
        name: "Yoga in the Park",
        date: "2024-09-15",
        location: "Bryant Park",
        price: 15,
        image: "/images/yoga.jpg",
        organizer: "Wellness First",
        category: "Sports",
        description: "Morning yoga sessions to start your day right.",
        special: "Sold Out",
    },
    {
        id: 8,
        name: "Photography Workshop",
        date: "2024-10-12",
        location: "SoHo, New York",
        price: 120,
        image: "/images/photography-workshop.jpg",
        organizer: "Creative Minds",
        category: "Arts",
        description: "Learn from the best in the field of photography.",
    },
];
