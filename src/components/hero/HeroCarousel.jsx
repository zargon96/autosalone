import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HeroCarousel({ cars, onSlideChange }) {
  return (
    <Swiper
      modules={[Navigation, EffectFade, Pagination]}
      navigation
      effect="fade"
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      onSlideChange={(sw) => onSlideChange(sw.activeIndex)}
      className="swiper"
    >
      {cars.map((car) => (
        <SwiperSlide key={car.model}></SwiperSlide>
      ))}
    </Swiper>
  );
}
