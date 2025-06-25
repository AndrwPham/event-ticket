/*
Keep in mind that these attributes are the information I use to keep render the UI
I can modify this so it can match with our database if possible
The current attributes are wat I think we should have to render the ticket details
that looks similar to the ticketbox.com page
 */
import { IEvent } from "../types";
export const allEvents: IEvent[] = [
    {
        id: 1,
        title: "CAREER FAIR & INDUSTRY EXPLORATION DAY 2025",
        organizer: {
            name: "Vietnamese - German University",
            logoUrl: "https://i.imgur.com/T1YAS2q.png",
        },
        posterUrl:
            "https://images.careerbuilder.vn/employer_folders/2022/08/10/1629532_1660124800_VGU_Career Fair 2022_FB Event Page Cover.png",
        description:
            "VGU Career Fair and Industry Exploration Day 2025 is a flagship event to foster collaboration, innovation, and career exploration within the VGU community. This event aims to connect VGU students with industry partners for careers and internships, provide a platform for companies to showcase their technologies and opportunities, build and strengthen VGU-industry partnerships for collaboration and knowledge exchange, and highlight VGU as a hub for industry-ready graduates with German-Vietnamese expertise.",

        startingPrice: 0,
        location: {
            name: "VGU Convention Hall - Ben Cat Campus",
            address:
                "Ring road 4, Quarter 4, Thoi Hoa Ward, Ben Cat City, Binh Duong Province",
        },
        schedule: [
            {
                datetime: "2025-10-25T08:30:00",
                tiers: [{ name: "Free Entry", price: 0 }],
            },
        ],
    },
    {
        id: 2,
        title: "Đại Nhạc Kịch Mùa Hè: The Greatest Show",
        organizer: {
            name: "VinaShow",
            logoUrl: "https://via.placeholder.com/150x50?text=VinaShow",
        },
        posterUrl: "https://i.ytimg.com/vi/2g92h_nK4rM/maxresdefault.jpg",
        description:
            "Sự kiện âm nhạc lớn nhất mùa hè với sự góp mặt của dàn sao V-Pop đình đám. Một đêm bùng nổ với âm thanh và ánh sáng hiện đại, hứa hẹn mang đến những trải nghiệm không thể nào quên.",
        startingPrice: 400000,
        location: {
            name: "Sân vận động Phú Thọ",
            address:
                "219 Lý Thường Kiệt, Phường 15, Quận 11, Thành Phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-07-25T18:00:00",
                tiers: [
                    { name: "GA Standing", price: 400000 },
                    { name: "GA+ Standing", price: 600000 },
                    { name: "Seated A", price: 800000 },
                    { name: "Seated VIP", price: 1500000 },
                ],
            },
        ],
        venueId: 2,

        seats: {
            A1: {
                id: "A1",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            A2: {
                id: "A2",
                tier: "Seated VIP",
                price: 1500000,
                status: "sold",
            },
            A3: {
                id: "A3",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            A4: {
                id: "A4",
                tier: "GA Standing",
                price: 1500000,
                status: "available",
            },
            A5: {
                id: "A5",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            A6: {
                id: "A6",
                tier: "Seated VIP",
                price: 1500000,
                status: "sold",
            },
            A7: {
                id: "A7",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            A8: {
                id: "A8",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            A9: {
                id: "A9",
                tier: "GA Standing",
                price: 1500000,
                status: "sold",
            },
            B1: {
                id: "B1",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            B2: {
                id: "B2",
                tier: "Seated VIP",
                price: 1500000,
                status: "held",
            },
            B3: {
                id: "B3",
                tier: "GA+ Standing",
                price: 1500000,
                status: "sold",
            },
            B4: {
                id: "B4",
                tier: "Seated VIP",
                price: 1500000,
                status: "held",
            },
            B5: {
                id: "B5",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            B6: {
                id: "B6",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            B7: {
                id: "B7",
                tier: "Seated VIP",
                price: 1500000,
                status: "sold",
            },
            B8: {
                id: "B8",
                tier: "GA+ Standing",
                price: 1500000,
                status: "available",
            },
            B9: {
                id: "B9",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            // ... and so on for all other seats in the layout ...
            E1: {
                id: "E1",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
            E2: {
                id: "E2",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
            E3: { id: "E3", tier: "Seated A", price: 800000, status: "sold" },
            E4: {
                id: "E4",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
            E5: {
                id: "E5",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
            E6: {
                id: "E6",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
            E7: { id: "E7", tier: "Seated A", price: 800000, status: "sold" },
            E8: {
                id: "E8",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
            E9: {
                id: "E9",
                tier: "Seated A",
                price: 800000,
                status: "available",
            },
        },
    },
    {
        id: 3,
        title: "VinaGame Tech Summit 2025",
        organizer: {
            name: "VinaGame Corporation",
            logoUrl: "https://i.imgur.com/3q8x8g5.png",
        },
        posterUrl: "https://i.imgur.com/R209K3p.png",
        description: "Join the brightest minds in tech at the VinaGame Tech Summit. This year's focus is on AI, Cloud Computing, and the future of gaming. Network with industry leaders, attend insightful keynotes, and discover the next big thing in technology.",
        startingPrice: 500000,
        location: {
            name: "VNG Campus",
            address: "Khu Chế Xuất Tân Thuận, Lô Z06, Đường 13, Tân Thuận Đông, Quận 7, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-11-15T09:00:00",
                tiers: [
                    { name: "Student Pass", price: 500000 },
                    { name: "Standard Pass", price: 1200000 },
                    { name: "VIP Pass", price: 2500000 },
                ],
            },
        ],
        venueId: 3,
        seats: {
            S1: { id: "S1", tier: "Student Pass", price: 500000, status: "available" },
            S2: { id: "S2", tier: "Student Pass", price: 500000, status: "available" },
            S3: { id: "S3", tier: "Student Pass", price: 500000, status: "sold" },
            T1: { id: "T1", tier: "Standard Pass", price: 1200000, status: "available" },
            T2: { id: "T2", tier: "Standard Pass", price: 1200000, status: "held" },
            T3: { id: "T3", tier: "Standard Pass", price: 1200000, status: "available" },
            V1: { id: "V1", tier: "VIP Pass", price: 2500000, status: "sold" },
            V2: { id: "V2", tier: "VIP Pass", price: 2500000, status: "available" },
        }
    },
    {
        id: 4,
        title: "Saigon International Food Festival 2025",
        organizer: {
            name: "Saigon Culinary Arts",
            logoUrl: "https://i.imgur.com/J3y2tY8.png",
        },
        posterUrl: "https://i.imgur.com/N7aJ1vj.png",
        description: "A celebration of global cuisine in the heart of Saigon! Explore hundreds of stalls from local and international chefs, enjoy live music, and participate in cooking workshops. A perfect weekend outing for foodies and families.",
        startingPrice: 150000,
        location: {
            name: "Le Van Tam Park",
            address: "Đ. Võ Thị Sáu, Đa Kao, Quận 1, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-09-20T10:00:00",
                tiers: [
                    { name: "Day Pass - Saturday", price: 150000 },
                    { name: "Day Pass - Sunday", price: 150000 },
                    { name: "Weekend Pass", price: 250000 },
                ],
            },
            {
                datetime: "2025-09-21T10:00:00",
                tiers: [
                    { name: "Day Pass - Sunday", price: 150000 },
                ],
            },
        ],
        venueId: 4, // This event is general admission, so no 'seats' object is needed.
    },
    {
        id: 5,
        title: "The Indie Wave - Music Festival",
        organizer: {
            name: "Indie Music Saigon",
            logoUrl: "https://i.imgur.com/tX6pU8e.png",
        },
        posterUrl: "https://i.imgur.com/3Y2uXzS.png",
        description: "Discover your new favorite band at The Indie Wave, Saigon's premier independent music festival. Featuring a diverse lineup of local and regional artists across two stages. Expect a day of great music, art installations, and good vibes.",
        startingPrice: 350000,
        location: {
            name: "Saigon Outcast",
            address: "188/1 Nguyễn Văn Hưởng, Thảo Điền, Quận 2, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-12-06T15:00:00",
                tiers: [
                    { name: "Early Bird", price: 350000 },
                    { name: "General Admission", price: 500000 },
                    { name: "At The Door", price: 600000 },
                ],
            },
        ],
        venueId: 5,
        seats: {
            EB1: { id: "EB1", tier: "Early Bird", price: 350000, status: "available" },
            EB2: { id: "EB2", tier: "Early Bird", price: 350000, status: "sold" },
            GA1: { id: "GA1", tier: "General Admission", price: 500000, status: "available" },
            GA2: { id: "GA2", tier: "General Admission", price: 500000, status: "available" },
            GA3: { id: "GA3", tier: "General Admission", price: 500000, status: "held" },
            DOOR1: { id: "DOOR1", tier: "At The Door", price: 600000, status: "available" },
        }
    },
    
    {
        id: 6,
        title: "Digital Marketing Masterclass",
        organizer: {
            name: "Binh Duong Business Hub",
            logoUrl: "https://i.imgur.com/L4k48sC.png",
        },
        posterUrl: "https://i.imgur.com/5g5g5g5.png",
        description: "Elevate your marketing skills with our intensive one-day workshop. Learn the latest strategies in SEO, content marketing, and social media advertising from industry experts. Ideal for students, entrepreneurs, and marketing professionals.",
        startingPrice: 300000,
        location: {
            name: "Becamex Business Incubator",
            address: "230 Đại lộ Bình Dương, Phú Hoà, Thủ Dầu Một, Bình Dương",
        },
        schedule: [
            {
                datetime: "2025-08-10T09:00:00",
                tiers: [
                    { name: "Early Bird", price: 300000 },
                    { name: "Standard Ticket", price: 500000 },
                ],
            },
        ],
        venueId: 6,
    },
    {
        id: 7,
        title: "Saigon Tếu: Đêm Hài Độc Thoại",
        organizer: {
            name: "Saigon Tếu",
            logoUrl: "https://i.imgur.com/y9r8V8y.png",
        },
        posterUrl: "https://i.imgur.com/eZ1r3r4.png",
        description: "Get ready for a night of non-stop laughter with Saigon Tếu, Vietnam's leading stand-up comedy group. Featuring a lineup of hilarious comedians, this show is guaranteed to be a memorable one. Viewer discretion is advised.",
        startingPrice: 250000,
        location: {
            name: "Yoko Cafe",
            address: "22A Nguyễn Thị Diệu, Phường 6, Quận 3, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-07-18T20:00:00",
                tiers: [
                    { name: "Standard Seating", price: 250000 },
                ],
            },
        ],
        venueId: 7,
    },
    {
        id: 8,
        title: "Vietnam AI Conference 2025",
        organizer: {
            name: "Hanoi AI & Robotics Association",
            logoUrl: "https://i.imgur.com/s6n4X4Z.png",
        },
        posterUrl: "https://i.imgur.com/a9c8b7c.png",
        description: "The premier conference for artificial intelligence in Vietnam. Join researchers, developers, and business leaders as they discuss the latest advancements in AI and its applications across various industries. The conference will feature keynote speeches, panel discussions, and technical workshops.",
        startingPrice: 1500000,
        location: {
            name: "National Convention Center",
            address: "57 Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội",
        },
        schedule: [
            {
                datetime: "2025-10-10T08:00:00",
                tiers: [
                    { name: "Academic Pass", price: 1500000 },
                    { name: "Corporate Pass", price: 3000000 },
                ],
            },
        ],
        venueId: 8,
    },
    {
        id: 9,
        title: "Da Nang Charity Run 2025: Run for the Ocean",
        organizer: {
            name: "Green Da Nang",
            logoUrl: "https://i.imgur.com/k2j4p3p.png",
        },
        posterUrl: "https://i.imgur.com/u7y6t5t.png",
        description: "Join us for a scenic run along the beautiful coastline of Da Nang. All proceeds from the event will go towards local marine conservation projects. Choose between a 5km fun run or a 10km competitive race. Let's run for a cause!",
        startingPrice: 200000,
        location: {
            name: "Biển Mỹ Khê",
            address: "Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
        },
        schedule: [
            {
                datetime: "2025-08-02T05:00:00",
                tiers: [
                    { name: "5km Fun Run", price: 200000 },
                    { name: "10km Competitive Race", price: 350000 },
                ],
            },
        ],
        venueId: 9,
    },
    {
        id: 10,
        title: "Hoi An Lantern Festival Art Exhibition",
        organizer: {
            name: "Hoi An Arts & Culture",
            logoUrl: "https://i.imgur.com/f8d7c6b.png",
        },
        posterUrl: "https://i.imgur.com/c4b3a2d.png",
        description: "Experience the magic of Hoi An's lanterns through the eyes of local artists. This special exhibition showcases a collection of paintings, photographs, and installations inspired by the town's iconic Lantern Festival. A must-see for art lovers and culture enthusiasts.",
        startingPrice: 0,
        location: {
            name: "Hoi An Ancient Town",
            address: "Trần Phú, Phường Minh An, Hội An, Quảng Nam",
        },
        schedule: [
            {
                datetime: "2025-09-15T18:00:00",
                tiers: [
                    { name: "Free Entry", price: 0 },
                ],
            },
        ],
        venueId: 10,
    },
    {
        id: 11,
        title: "K-Pop SuperFest 2025",
        organizer: {
            name: "K-Vibe Entertainment",
            logoUrl: "https://i.imgur.com/g9h8i7j.png",
        },
        posterUrl: "https://i.imgur.com/kLmnop.png",
        description: "The ultimate K-Pop experience is coming to Ho Chi Minh City! Featuring a star-studded lineup of your favorite idols, this one-night-only concert promises electrifying performances and unforgettable moments. Get your light sticks ready!",
        startingPrice: 1200000,
        location: {
            name: "Sân vận động Quân khu 7",
            address: "202 Hoàng Văn Thụ, Phường 9, Phú Nhuận, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-11-29T19:00:00",
                tiers: [
                    { name: "CAT 5", price: 1200000 },
                    { name: "CAT 4", price: 2000000 },
                    { name: "CAT 3", price: 3500000 },
                    { name: "CAT 2", price: 5000000 },
                    { name: "CAT 1 (VIP)", price: 7500000 },
                ],
            },
        ],
        venueId: 11,
        seats: {
            C5A1: { id: "C5A1", tier: "CAT 5", price: 1200000, status: "available" },
            C4B2: { id: "C4B2", tier: "CAT 4", price: 2000000, status: "available" },
            C3C3: { id: "C3C3", tier: "CAT 3", price: 3500000, status: "sold" },
            C2D4: { id: "C2D4", tier: "CAT 2", price: 5000000, status: "held" },
            C1E5: { id: "C1E5", tier: "CAT 1 (VIP)", price: 7500000, status: "available" },
        }
    },
    {
        id: 12,
        title: "Phu Quoc New Year's Countdown Party",
        organizer: {
            name: "Pearl Island Events",
            logoUrl: "https://i.imgur.com/x1y2z3w.png",
        },
        posterUrl: "https://i.imgur.com/qRSTuv.png",
        description: "Ring in the New Year in paradise! Join us for an epic beach party featuring international DJs, spectacular fireworks, and a night of dancing under the stars. Say goodbye to 2025 and hello to 2026 in style.",
        startingPrice: 800000,
        location: {
            name: "Sunset Sanato Beach Club",
            address: "Bắc Bãi Trường, Dương Tơ, Phú Quốc, Kiên Giang",
        },
        schedule: [
            {
                datetime: "2025-12-31T20:00:00",
                tiers: [
                    { name: "General Access", price: 800000 },
                    { name: "VIP Table (4 persons)", price: 5000000 },
                ],
            },
        ],
        venueId: 12,
        seats: {
            GA001: { id: "GA001", tier: "General Access", price: 800000, status: "available" },
            GA002: { id: "GA002", tier: "General Access", price: 800000, status: "available" },
            VIP1: { id: "VIP1", tier: "VIP Table (4 persons)", price: 5000000, status: "sold" },
            VIP2: { id: "VIP2", tier: "VIP Table (4 persons)", price: 5000000, status: "available" },
        }
    }

];
