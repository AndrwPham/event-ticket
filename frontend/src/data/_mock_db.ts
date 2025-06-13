/*
Keep in mind that these attributes are the information I use to keep render the UI
I can modify this so it can match with our database if possible
The current attributes are wat I think we should have to render the ticket details
that looks similar to the ticketbox.com page
 */

export const allEvents = [
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
        artists: [],
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
        artists: [
            "Sơn Tùng M-TP",
            "Hà Anh Tuấn",
            "Bích Phương",
            "Đen Vâu",
            "Hoàng Thùy Linh",
        ],
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
                tier: "Seated VIP",
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
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
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
                status: "available",
            },
            B3: {
                id: "B3",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
            },
            B4: {
                id: "B4",
                tier: "Seated VIP",
                price: 1500000,
                status: "available",
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
                tier: "Seated VIP",
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
];
