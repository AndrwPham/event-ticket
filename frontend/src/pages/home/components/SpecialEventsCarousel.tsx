import { FC } from "react"; // Add FC for TypeScript
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import firstBanner from "../../../assets/images/billie_eilish.png";
import secondBanner from "../../../assets/images/IVE.jpg";
import thirdBanner from "../../../assets/images/thinh_suy.png";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const carouselImages = [
  firstBanner,
  secondBanner,
  thirdBanner,
];

const SpecialEventsCarousel: FC = () => {
  return (
    <section className="my-8 px-4">
      <h2 className="w-5/6 mx-auto text-2xl font-bold text-[#1A0B49] mb-4">
        Special Events
      </h2>
      <div className="w-5/6 h-auto mx-auto overflow-hidden shadow-lg">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: false }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          loop
          className="w-full"
        >
          {carouselImages.map((src, index) => (
            <SwiperSlide key={index}>
              <img
                src={src}
                alt={`Event ${index + 1}`}
                className="w-full aspect-auto object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default SpecialEventsCarousel;