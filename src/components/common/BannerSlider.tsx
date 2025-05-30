import React from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "./Swiper.css";

const ads = [
    { id: 1, imageUrl: 'https://cdn.chotot.com/admincentre/wmUG-GLEEB80Ut0lTmsov-FBASI-O8PEjQRXZgTPyY8/preset:raw/plain/6afd7855b4d879be625b1c465f87f9f6-2933039680029198719.jpg', alt: 'Advertisement 1' },
    { id: 2, imageUrl: 'https://cdn.chotot.com/admincentre/XOMVkEuirj7S_Dz8L6BxK8IRdf5rpZ2Y_uIso06W7L0/preset:raw/plain/86004bd119e9d07e376413ebace4373b-2883913672886655493.jpg', alt: 'Advertisement 2' },
    { id: 3, imageUrl: 'https://cdn.chotot.com/admincentre/lyUqIZB2GKoglbY3y2kcnfSYwmxJCgfow6yBZ474mco/preset:raw/plain/40cbae95b36176c6785a88467e252b75-2928430618505531480.jpg', alt: 'Advertisement 3' },
    { id: 5, imageUrl: 'https://cdn.chotot.com/admincentre/z1RFXqbrxfNIfC4buJX8cXrXpfMCc_DnkEKTbCE9X1s/preset:raw/plain/697bdefefa7ec9c31f1e8dcd7a38827f-2932228140549143173.jpg', alt: 'Advertisement 5' },
    { id: 6, imageUrl: 'https://cdn.chotot.com/admincentre/jfsYdDIVO-9ix_SMwj7N0ne0VAZR3NBNUZqLDEqCuuQ/preset:raw/plain/b70537db22d89fbdb8c648369733d441-2928040935390102423.jpg', alt: 'Advertisement 6' },
    { id: 7, imageUrl: 'https://cdn.chotot.com/admincentre/f1V1P5j8Zje-AdlQj1mCDi_iXhE8IF08hR2QMgJlHgM/preset:raw/plain/05cca3a73b31789c414b0592be1787a7-2893641460692669751.jpg', alt: 'Advertisement 7' },
    { id: 8, imageUrl: 'https://cdn.chotot.com/admincentre/lXOmM8sWPsBKaQrVCe_FKO8nO9H-FSn-lN-nB0QjcLg/preset:raw/plain/58d025ad5929b4c1e4bc75882f39ed8d-2932629090748113458.jpg', alt: 'Advertisement 8' },
  ];

const BannerSlider: React.FC = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={true}
        pagination={{ 
          clickable: true
        }}
        centeredSlides={false}
        autoplay={{ 
          delay: 10000,
          disableOnInteraction: false 
        }}
        loop={true}
        className="custom-swiper"
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 40,
          },
        }}
        style={{ 
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        } as React.CSSProperties}
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad.id}>
            <div className="rounded-lg overflow-hidden shadow-md">
              <img
                src={ad.imageUrl}
                alt={ad.alt}
                className="w-full h-[280px] object-cover"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load:', ad.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
