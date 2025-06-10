import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const carouselImages = [
  "https://placehold.co/1100x600", // Replace with your own images or paths
  "https://placehold.co/1100x600", // Replace with your own images or paths
];

const SpecialEventsCarousel = () => {
  return (
    <section className="my-8 px-4 ">
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