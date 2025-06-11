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
    },
    {
        id: 3,
        title: "Liveshow Tri Âm - Mỹ Tâm",
        organizer: {
            name: "MT Entertainment",
            logoUrl: "https://via.placeholder.com/150x50?text=MT+Entertainment",
        },
        posterUrl:
            "https://i.scdn.co/image/ab67616d0000b273e23c4a243d1a8a57e37d5707",
        description:
            "Đêm nhạc cá nhân của 'Họa mi tóc nâu' Mỹ Tâm, mang đến những bản hit bất hủ đã làm nên tên tuổi và những ca khúc mới nhất trong album 'Tri Âm'. Một không gian âm nhạc sâu lắng và đầy cảm xúc.",
        artists: ["Mỹ Tâm"],
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
                    { name: "Hạng Kim Cương", price: 2500000 },
                ],
            },
        ],
    },
    {
        id: 4,
        title: "Workshop Nhiếp Ảnh Phong Cảnh Đà Lạt",
        organizer: {
            name: "Hội Nhiếp ảnh TP.HCM",
            logoUrl: "https://via.placeholder.com/150x50?text=Hoi+Nhiep+Anh",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1575650281023-d6a1b9135384?q=80&w=2070&auto=format&fit=crop",
        description:
            "Khóa học thực hành nhiếp ảnh kéo dài 2 ngày tại Đà Lạt. Học viên sẽ được hướng dẫn các kỹ thuật chụp ảnh phong cảnh, từ bố cục, ánh sáng đến hậu kỳ, và có cơ hội săn những khoảnh khắc đẹp nhất của thành phố sương mù.",
        artists: ["Nhiếp ảnh gia Trần Văn A"],
        startingPrice: 2000000,
        location: {
            name: "Đồi chè Cầu Đất, Đà Lạt",
            address: "Thôn Cầu Đất, Xã Xuân Trường, Thành phố Đà Lạt, Lâm Đồng",
        },
        schedule: [
            {
                datetime: "2025-09-20T05:00:00",
                tiers: [{ name: "Học viên", price: 2000000 }],
            },
        ],
    },
    {
        id: 5,
        title: "Tech Conference Vietnam 2025",
        organizer: {
            name: "TopDev",
            logoUrl: "https://via.placeholder.com/150x50?text=TopDev",
        },
        posterUrl:
            "https://vietnaminsider.vn/wp-content/uploads/2022/11/Tech-conference-scaled.jpg",
        description:
            "Hội nghị công nghệ thường niên lớn nhất Việt Nam, quy tụ các chuyên gia hàng đầu trong lĩnh vực AI, Blockchain, và Cloud Computing. Nơi cập nhật những xu hướng công nghệ mới nhất và kết nối với cộng đồng lập trình viên.",
        artists: ["Speaker: Dr. Nguyen Le", "Speaker: Jane Doe"],
        startingPrice: 750000,
        location: {
            name: "White Palace Event Center",
            address:
                "108 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-11-15T09:00:00",
                tiers: [
                    { name: "Early Bird", price: 750000 },
                    { name: "Standard", price: 1000000 },
                    { name: "Business", price: 1800000 },
                ],
            },
        ],
    },
    {
        id: 6,
        title: "Hanoi International Food Festival 2025",
        organizer: {
            name: "Hanoi Culinary Association",
            logoUrl: "https://via.placeholder.com/150x50?text=Hanoi+Culinary",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
        description:
            "Lễ hội ẩm thực quốc tế tại Hà Nội, nơi bạn có thể thưởng thức hàng trăm món ăn đặc sắc từ khắp nơi trên thế giới. Một trải nghiệm văn hóa và ẩm thực không thể bỏ lỡ.",
        artists: [],
        startingPrice: 50000,
        location: {
            name: "Công viên Thống Nhất",
            address: "Trần Nhân Tông, Lê Duẩn, Hai Bà Trưng, Hà Nội",
        },
        schedule: [
            {
                datetime: "2025-09-05T10:00:00",
                tiers: [{ name: "Vé vào cổng", price: 50000 }],
            },
        ],
    },
    {
        id: 7,
        title: "EDM Festival - The Wave",
        organizer: {
            name: "Ravolution Music Festival",
            logoUrl: "https://via.placeholder.com/150x50?text=Ravolution",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1582711012103-60a6cf389601?q=80&w=1932&auto=format&fit=crop",
        description:
            "Lễ hội âm nhạc điện tử sôi động với sự tham gia của các DJ hàng đầu thế giới và Việt Nam. Hãy sẵn sàng để hòa mình vào những giai điệu EDM bùng nổ.",
        artists: ["Hardwell", "Alan Walker", "Hoàng Touliver", "Masew"],
        startingPrice: 800000,
        location: {
            name: "Ecopark",
            address: "Ecopark, Văn Giang, Hưng Yên",
        },
        schedule: [
            {
                datetime: "2025-08-30T16:00:00",
                tiers: [
                    { name: "Phase 1", price: 800000 },
                    { name: "Phase 2", price: 1000000 },
                    { name: "VIP", price: 2500000 },
                ],
            },
        ],
    },
    {
        id: 8,
        title: "K-Pop Flex Tour in Ho Chi Minh City",
        organizer: {
            name: "Live Nation",
            logoUrl: "https://via.placeholder.com/150x50?text=Live+Nation",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1599842055598-f7a28a38a9a4?q=80&w=2070&auto=format&fit=crop",
        description:
            "Cơn lốc K-Pop đổ bộ Sài Gòn với dàn line-up không thể hot hơn. Cơ hội gặp gỡ các thần tượng K-Pop ngay tại Việt Nam.",
        artists: ["BLACKPINK", "EXO", "TWICE", "Stray Kids"],
        startingPrice: 1200000,
        location: {
            name: "Nhà thi đấu Quân khu 7",
            address:
                "202 Hoàng Văn Thụ, Phường 9, Phú Nhuận, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-10-12T19:00:00",
                tiers: [
                    { name: "CAT 5", price: 1200000 },
                    { name: "CAT 4", price: 1800000 },
                    { name: "CAT 3", price: 2500000 },
                    { name: "CAT 2", price: 3800000 },
                    { name: "CAT 1", price: 5800000 },
                ],
            },
        ],
    },
    {
        id: 9,
        title: "Hội Chợ Sách Mùa Thu",
        organizer: {
            name: "Fahasa",
            logoUrl: "https://via.placeholder.com/150x50?text=Fahasa",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop",
        description:
            "Hội sách lớn nhất trong năm với hàng ngàn đầu sách giảm giá. Nơi lý tưởng cho những người yêu sách tìm kiếm những cuốn sách hay với giá ưu đãi.",
        artists: [],
        startingPrice: 0,
        location: {
            name: "Nhà Văn hóa Thanh niên",
            address:
                "4 Phạm Ngọc Thạch, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-09-12T09:00:00",
                tiers: [{ name: "Vào cửa tự do", price: 0 }],
            },
        ],
    },
    {
        id: 10,
        title: "Marathon 'Run for the Ocean'",
        organizer: {
            name: "Green Việt",
            logoUrl: "https://via.placeholder.com/150x50?text=Green+Viet",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
        description:
            "Giải chạy marathon gây quỹ bảo vệ môi trường biển. Cùng nhau chạy vì một đại dương xanh, sạch, đẹp. Toàn bộ lợi nhuận sẽ được đóng góp cho các tổ chức bảo tồn biển.",
        artists: [],
        startingPrice: 300000,
        location: {
            name: "Bãi biển Mỹ Khê, Đà Nẵng",
            address: "Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng",
        },
        schedule: [
            {
                datetime: "2025-07-20T04:30:00",
                tiers: [
                    { name: "5KM", price: 300000 },
                    { name: "10KM", price: 450000 },
                    { name: "21KM", price: 600000 },
                ],
            },
        ],
    },
    {
        id: 11,
        title: "Đêm nhạc Jazz - Saigon Serenade",
        organizer: {
            name: "Sax N' Art Jazz Club",
            logoUrl: "https://via.placeholder.com/150x50?text=Sax+N+Art",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1511192336575-5a79af67d629?q=80&w=1932&auto=format&fit=crop",
        description:
            "Thưởng thức những giai điệu Jazz du dương và tinh tế trong một không gian ấm cúng và sang trọng giữa lòng Sài Gòn. Một đêm nhạc dành cho những tâm hồn đồng điệu.",
        artists: ["Trần Mạnh Tuấn", "The Saigon Big Band"],
        startingPrice: 350000,
        location: {
            name: "Sax N' Art Jazz Club",
            address: "28 Lê Lợi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-08-16T20:30:00",
                tiers: [
                    { name: "Standard Seat", price: 350000 },
                    { name: "Premium Seat", price: 500000 },
                ],
            },
        ],
    },
    {
        id: 12,
        title: "Triển lãm Nghệ thuật Đương đại 'Khởi Nguồn'",
        organizer: {
            name: "The Factory Contemporary Arts Centre",
            logoUrl: "https://via.placeholder.com/150x50?text=The+Factory",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop",
        description:
            "Triển lãm giới thiệu các tác phẩm mới nhất của những nghệ sĩ trẻ tài năng Việt Nam, thể hiện những góc nhìn đa chiều về xã hội hiện đại.",
        artists: ["Ly Hoàng Ly", "Lê Quý Tông", "Nguyễn Phương Linh"],
        startingPrice: 70000,
        location: {
            name: "The Factory Contemporary Arts Centre",
            address: "15 Nguyễn Ư Dĩ, Thảo Điền, Quận 2, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-10-01T10:00:00",
                tiers: [
                    { name: "Người lớn", price: 70000 },
                    { name: "Sinh viên", price: 50000 },
                ],
            },
        ],
    },
    {
        id: 13,
        title: "Stand-up Comedy: Saigon Tếu",
        organizer: {
            name: "Saigon Tếu",
            logoUrl: "https://via.placeholder.com/150x50?text=Saigon+Teu",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1599389901493-087034789547?q=80&w=1887&auto=format&fit=crop",
        description:
            "Đêm hài độc thoại hứa hẹn mang lại những tràng cười sảng khoái với những câu chuyện hài hước và dí dỏm về cuộc sống Sài Gòn.",
        artists: ["Uy Lê", "Phương Nam", "Uyển Ân"],
        startingPrice: 250000,
        location: {
            name: "Yoko Cafe",
            address:
                "22A Nguyễn Thị Diệu, Phường 6, Quận 3, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-07-18T20:00:00",
                tiers: [{ name: "Vé tiêu chuẩn", price: 250000 }],
            },
        ],
    },
    {
        id: 14,
        title: "Lễ hội Đèn lồng Hội An",
        organizer: {
            name: "UBND Thành phố Hội An",
            logoUrl: "https://via.placeholder.com/150x50?text=Hoi+An+City",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1534279383439-94bb3d27972a?q=80&w=1887&auto=format&fit=crop",
        description:
            "Hòa mình vào không gian lung linh, huyền ảo của phố cổ Hội An trong đêm rằm. Thả đèn hoa đăng trên sông Hoài và ước nguyện những điều tốt đẹp.",
        artists: [],
        startingPrice: 0,
        location: {
            name: "Phố cổ Hội An",
            address: "Thành phố Hội An, Quảng Nam",
        },
        schedule: [
            {
                datetime: "2025-08-09T18:00:00",
                tiers: [{ name: "Tham quan tự do", price: 0 }],
            },
        ],
    },
    {
        id: 15,
        title: "RockFest 2025 - Bão Lửa",
        organizer: {
            name: "RockSVIET",
            logoUrl: "https://via.placeholder.com/150x50?text=RockSVIET",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1499415474345-56e07751c360?q=80&w=1964&auto=format&fit=crop",
        description:
            "Lễ hội nhạc Rock lớn nhất năm quy tụ các ban nhạc Rock hàng đầu Việt Nam. Một đêm cháy hết mình với những giai điệu mạnh mẽ và cuồng nhiệt.",
        artists: ["Bức Tường", "Ngũ Cung", "Microwave", "Parasite"],
        startingPrice: 350000,
        location: {
            name: "Sân vận động Bách Khoa",
            address: "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
        },
        schedule: [
            {
                datetime: "2025-11-22T17:00:00",
                tiers: [
                    { name: "Early Rocker", price: 350000 },
                    { name: "GA", price: 450000 },
                    { name: "Rock VIP", price: 800000 },
                ],
            },
        ],
    },
    {
        id: 16,
        title: "Khóa thiền Vipassana 10 ngày",
        organizer: {
            name: "Trung tâm Thiền Vipassana Dhamma Sota",
            logoUrl: "https://via.placeholder.com/150x50?text=Vipassana",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop",
        description:
            "Khóa thiền 10 ngày dành cho những ai muốn tìm lại sự bình yên trong tâm hồn và học cách quan sát thực tại như chính nó đang là. Khóa học miễn phí, chi phí dựa trên sự đóng góp tùy tâm của thiền sinh cũ.",
        artists: [],
        startingPrice: 0,
        location: {
            name: "Dhamma Sota, Sóc Sơn",
            address: "Thôn Minh Tân, Xã Minh Trí, Sóc Sơn, Hà Nội",
        },
        schedule: [
            {
                datetime: "2025-12-01T08:00:00",
                tiers: [{ name: "Đăng ký (Tùy tâm)", price: 0 }],
            },
        ],
    },
    {
        id: 17,
        title: "Vietnam GameVerse 2025",
        organizer: {
            name: "VnExpress",
            logoUrl: "https://via.placeholder.com/150x50?text=VnExpress",
        },
        posterUrl:
            "https://vcdn1-sohoa.vnecdn.net/2024/04/10/vietnam-gameverse-2024-soi-don-2978-1712743958.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=I09m6p7K33Nl44i1gC82cA",
        description:
            "Sự kiện triển lãm và hội thảo về ngành game tại Việt Nam. Trải nghiệm các sản phẩm game mới, tham gia các giải đấu eSports và gặp gỡ các nhà phát triển game hàng đầu.",
        artists: [],
        startingPrice: 100000,
        location: {
            name: "Nhà thi đấu Phú Thọ",
            address:
                "219 Lý Thường Kiệt, Phường 15, Quận 11, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-08-02T09:00:00",
                tiers: [
                    { name: "Vé tham quan", price: 100000 },
                    { name: "Vé hội thảo", price: 300000 },
                ],
            },
        ],
    },
    {
        id: 18,
        title: "Da Lat Music Festival - 'City of Stars'",
        organizer: {
            name: "Lululola",
            logoUrl: "https://via.placeholder.com/150x50?text=Lululola",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1605655115591-621a6a43950f?q=80&w=1974&auto=format&fit=crop",
        description:
            "Lễ hội âm nhạc acoustic giữa lòng Đà Lạt thơ mộng. Thưởng thức những bản tình ca nhẹ nhàng dưới bầu trời đầy sao. Một trải nghiệm âm nhạc chữa lành tâm hồn.",
        artists: ["Thái Đinh", "Vũ.", "Tiên Tiên", "Trang"],
        startingPrice: 450000,
        location: {
            name: "Lululola Coffee+",
            address: "Đường 3/4, Phường 3, Thành phố Đà Lạt, Lâm Đồng",
        },
        schedule: [
            {
                datetime: "2025-10-26T17:00:00",
                tiers: [
                    { name: "Standard", price: 450000 },
                    { name: "Couple Combo", price: 850000 },
                ],
            },
        ],
    },
    {
        id: 19,
        title: "Triển lãm Cưới 'Forever & Always'",
        organizer: {
            name: "WeddingBells Magazine",
            logoUrl: "https://via.placeholder.com/150x50?text=WeddingBells",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1597157639073-6928495a2422?q=80&w=2070&auto=format&fit=crop",
        description:
            "Triển lãm cưới lớn nhất trong năm, quy tụ hàng trăm thương hiệu váy cưới, studio, và các dịch vụ cưới hàng đầu. Nơi các cặp đôi có thể tìm thấy mọi thứ cho ngày trọng đại của mình với nhiều ưu đãi hấp dẫn.",
        artists: [],
        startingPrice: 25000,
        location: {
            name: "Adora Center",
            address:
                "431 Hoàng Văn Thụ, Phường 4, Tân Bình, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-09-27T09:00:00",
                tiers: [{ name: "Vé vào cổng", price: 25000 }],
            },
        ],
    },
    {
        id: 20,
        title: "Vở ballet 'Hồ Thiên Nga'",
        organizer: {
            name: "Nhà hát Giao hưởng Nhạc Vũ Kịch TP.HCM (HBSO)",
            logoUrl: "https://via.placeholder.com/150x50?text=HBSO",
        },
        posterUrl:
            "https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?q=80&w=1887&auto=format&fit=crop",
        description:
            "Thưởng thức vở ballet kinh điển 'Hồ Thiên Nga' của Tchaikovsky qua sự thể hiện của các nghệ sĩ tài năng từ HBSO. Một tác phẩm nghệ thuật đỉnh cao, lay động lòng người.",
        artists: ["Nghệ sĩ múa HBSO"],
        startingPrice: 650000,
        location: {
            name: "Nhà hát Thành phố Hồ Chí Minh (Saigon Opera House)",
            address:
                "7 Công trường Lam Sơn, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        },
        schedule: [
            {
                datetime: "2025-11-08T20:00:00",
                tiers: [
                    { name: "Tầng trệt", price: 900000 },
                    { name: "Tầng lửng", price: 750000 },
                    { name: "Tầng lầu", price: 650000 },
                ],
            },
        ],
    },
];
