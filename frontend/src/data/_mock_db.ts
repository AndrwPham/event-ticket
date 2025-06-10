/*
Keep in mind that these attributes are the information I use to keep render the UI
I can modify this so it can match with our database if possible
The current attributes are wat I think we should have to render the ticket details
that looks similar to the ticketbox.com page
 */

export const allEvents = [
    {
        id: 1,
        title: "Hài Kịch: Náo Loạn Tiếu Lâm Đường",
        organizer: "Nhà hát Thanh Niên",
        posterUrl: "", // This image should be in your /public folder
        description:
            "Một vở hài kịch đặc sắc với sự tham gia của các nghệ sĩ hàng đầu, hứa hẹn mang lại những tràng cười sảng khoái và những giây phút giải trí khó quên.",
        artists: [
            "Hoài Linh",
            "Trường Giang",
            "Trấn Thành",
            "Thu Trang",
            "Tiến Luật",
            "Nam Thư",
        ],
        startingPrice: 250000,
        location: {
            name: "Nhà hát Thanh Niên",
            address:
                "Số 4 Phạm Ngọc Thạch, Phường Bến Nghé, Quận 1, Thành Phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-06-13T19:00:00",
                tiers: [
                    { name: "Hạng VIP", price: 300000 },
                    { name: "Hạng thường", price: 250000 },
                ],
            },
        ],
    },
    {
        id: 2,
        title: "Đại Nhạc Kịch Mùa Hè",
        organizer: "Sân Vận Động Phú Thọ",
        posterUrl: "",
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
        organizer: "Trung tâm Hội nghị Quốc gia",
        posterUrl: "",
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
