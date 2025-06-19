export interface MyTicket {
    id: number;
    title: string;
    date: string;
    location: string;
    image: string;
    status: "Processing" | "Finished" | "Cancelled";
}

// We use the current date to determine which tickets are upcoming vs. past.
// Note: In a real app, this data would come from a server.
export const myTickets: MyTicket[] = [
    {
        id: 1,
        title: "Hài Kịch: Náo Loạn Tiếu Lâm Đường",
        date: "2025-08-15T19:00:00",
        location: "Nhà hát Thanh Niên, Q1, TPHCM",
        image: "https://placehold.co/400x200/2D1D53/FFFFFF/?text=Event",
        status: "Processing",
    },
    {
        id: 2,
        title: "Đại Nhạc Kịch Mùa Hè",
        date: "2024-05-20T18:00:00",
        location: "Sân vận động Phú Thọ, Q11, TPHCM",
        image: "https://placehold.co/400x200/2D1D53/FFFFFF/?text=Event",
        status: "Finished",
    },
    {
        id: 3,
        title: "Liveshow Ca Sĩ Nổi Tiếng",
        date: "2025-09-01T20:00:00",
        location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
        image: "https://placehold.co/400x200/2D1D53/FFFFFF/?text=Event",
        status: "Processing",
    },
    {
        id: 4,
        title: "Triển lãm nghệ thuật đương đại",
        date: "2025-07-10T10:00:00",
        location: "Bảo tàng Mỹ thuật Việt Nam, Hà Nội",
        image: "https://placehold.co/400x200/E63946/FFFFFF/?text=Cancelled",
        status: "Cancelled",
    },
];
