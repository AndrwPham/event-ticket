export interface MyTicket {
    id: string; // changed from number to string for MongoDB compatibility
    title: string;
    date: string | null | undefined;
    location: string;
    image: string;
    status: "Ready" | "Used" | "Cancelled" | "Expired" ;
}

// We use the current date to determine which tickets are upcoming vs. past.
// Note: In a real app, this data would come from a server.
export const myTickets: MyTicket[] = [
    {
        id: "1",
        title: "Hài Kịch: Náo Loạn Tiếu Lâm Đường",
        date: "2025-08-15T19:00:00",
        location: "Nhà hát Thanh Niên, Q1, TPHCM",
        image: "https://placehold.co/400x200/2D1D53/FFFFFF/?text=Event",
        status: "Ready",
    },
    {
        id: "2",
        title: "Đại Nhạc Kịch Mùa Hè",
        date: "2024-05-20T18:00:00",
        location: "Sân vận động Phú Thọ, Q11, TPHCM",
        image: "https://placehold.co/400x200/2D1D53/FFFFFF/?text=Event",
        status: "Used",
    },
    {
        id: "3",
        title: "Liveshow Ca Sĩ Nổi Tiếng",
        date: "2025-09-01T20:00:00",
        location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
        image: "https://placehold.co/400x200/2D1D53/FFFFFF/?text=Event",
        status: "Ready",
    },
    {
        id: "4",
        title: "Triển lãm nghệ thuật đương đại",
        date: "2025-06-28T16:00:00",
        location: "Bảo tàng Mỹ thuật Việt Nam, Hà Nội",
        image: "https://placehold.co/400x200/E63946/FFFFFF/?text=Cancelled",
        status: "Cancelled",
    },
    {
        id: "5",
        title: "Những Thành Phố Mơ Màng Summer 2025",
        date: "2025-06-10T10:00:00",
        location: "Sân Vận Động Phú Thọ (ngoài trời), TPHCM",
        image: "https://placehold.co/400x200/E63946/FFFFFF/?text=Failed",
        status: "Expired",
    },
    {
        id: "6",
        title: "LULULOLA SHOW VŨ CÁT TƯỜNG | NGÀY NÀY, NGƯỜI CON GÁI NÀY",
        date: "2025-06-28T17:30:00",
        location: "Đầu đèo Prenn, Số 32/2 Đường 3/4, 3 Ward, Đà Lạt, Lâm Đồng",
        image: "https://placehold.co/400x200/E63946/FFFFFF/?text=Event",
        status: "Ready",
    },
    {
        id: "7",
        title: "Hội chợ ẩm thực đường phố Việt Nam",
        date: "2025-08-05T11:00:00",
        location: "Công viên Lê Văn Tám, TPHCM",
        image: "https://placehold.co/400x200/E63946/FFFFFF/?text=Event",
        status: "Ready",
    },
    {
        id: "8",
        title: "Lễ hội ánh sáng quốc tế",
        date: "2025-09-15T19:30:00",
        location: "Cầu Ánh Sao, Q7, TPHCM",
        image: "https://placehold.co/400x200/E63946/FFFFFF/?text=Event",
        status: "Ready",
    },
];
