import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

export default function HeroCarousel({ cars, carKeys, onSlideChange }) {
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
      {carKeys.map((key) => {
        const car = cars[key];
        return <SwiperSlide key={car.id}></SwiperSlide>;
      })}
    </Swiper>
  );
}
