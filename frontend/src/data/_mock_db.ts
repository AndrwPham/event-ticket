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
        posterUrl: "/image_d4e69a.jpg", // Assumes this image is in your /public folder
        description: `VGU Career Fair and Industry Exploration Day 2025 is a flagship event to foster collaboration, innovation, and career exploration within the VGU community. Day 2025 aims to:
      - Connect VGU students with industry partners for careers and internships.
      - Provide a platform for companies to showcase their technologies and opportunities.
      - Build and strengthen VGU-industry partnerships for collaboration and knowledge exchange.
      - Highlight VGU as a hub for industry-ready graduates with German-Vietnamese expertise.`,
        artists: [],
        startingPrice: 100000,
        location: {
            name: "VGU Convention Hall - Ben Cat Campus",
            address:
                "Ring road 4, Quarter 4, Thoi Hoa Ward, Ben Cat City, Binh Duong Province",
        },
        schedule: [
            {
                datetime: "2025-05-14T08:30:00",
                tiers: [
                    { name: "VIP", price: 250000 },
                    { name: "Standard", price: 100000 },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Đại Nhạc Kịch Mùa Hè",
        // MODIFIED: 'organizer' is now an object
        organizer: {
            name: "Sân Vận Động Phú Thọ",
            logoUrl: "https://via.placeholder.com/150x50?text=Organizer+Logo",
        },
        // MODIFIED: Added a placeholder poster image
        posterUrl:
            "https://via.placeholder.com/1200x500?text=Dai+Nhac+Kich+Banner",
        description:
            "Sự kiện âm nhạc lớn nhất mùa hè với sự góp mặt của dàn sao V-Pop đình đám. Một đêm bùng nổ với âm thanh và ánh sáng hiện đại.",
        artists: ["Sơn Tùng M-TP", "Hà Anh Tuấn", "Bích Phương", "Đen Vâu"],
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
                    { name: "Khu vực đứng", price: 400000 },
                    { name: "Khu vực ngồi", price: 600000 },
                ],
            },
        ],
    },
    {
        id: 3,
        title: "Liveshow Ca Sĩ Nổi Tiếng",
        // MODIFIED: 'organizer' is now an object
        organizer: {
            name: "Trung tâm Hội nghị Quốc gia",
            logoUrl: "https://via.placeholder.com/150x50?text=Organizer+Logo",
        },
        // MODIFIED: Added a placeholder poster image
        posterUrl: "https://via.placeholder.com/1200x500?text=Liveshow+Banner",
        description:
            "Đêm nhạc cá nhân của một giọng ca vàng, mang đến những bản hit bất hủ và những ca khúc mới nhất.",
        artists: ["Ca Sĩ Bí Mật"],
        startingPrice: 500000,
        location: {
            name: "Trung tâm Hội nghị Quốc gia",
            address: "57 Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội",
        },
        schedule: [
            {
                datetime: "2025-08-10T20:00:00",
                tiers: [
                    { name: "Hạng Bạc", price: 500000 },
                    { name: "Hạng Vàng", price: 800000 },
                    { name: "Hạng Bạch Kim", price: 1200000 },
                ],
            },
        ],
    },
];
