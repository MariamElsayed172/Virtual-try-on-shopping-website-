// Abdalrady

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "swiper/swiper-bundle.css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { GoArrowRight, GoArrowUpRight } from "react-icons/go";
import { useState } from "react";

const slides = [
  {
    image:
      "https://sumilux-fashion.myshopify.com/cdn/shop/files/home1-slider-1.webp?v=1729765034&width=1920",
    title: "Express Yourself",
    subtitle: "Fashion",
    description: "AI Powered",
    Button: "AI Model",
    path: "/e-prova/newarrivals"
  },
  {
    image:
      "https://sumilux-fashion.myshopify.com/cdn/shop/files/home1-slider-2.webp?v=1729765033&width=1920",
    title: "New Arrivals",
    subtitle: "Fall Session",
    description: "Trending",
    Button: "Learn More",
    path: "/e-prova/newarrivals"
  },
  {
    image:
      "https://sumilux-fashion.myshopify.com/cdn/shop/files/home1-slider-3.webp?v=1729765034&width=1920",
    title: "Man Wear",
    subtitle: "Leather",
    description: "Jacket & Coats",
    Button: "Shop Now",
    path: "/e-prova/products"
  },
];

export default function Slideshow() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (button) => {
    setHoveredButton(button);
  };

  const handleMouseLeave = () => {
    setHoveredButton(null);
  };

  const handleImageClick = (path) => {
    navigate(path);
  };

  return (
    <div className="mb-10 -mx-3">
      <Swiper
        modules={[Pagination, EffectFade, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        pagination={{ dynamicBullets: true, clickable: true }}
        effect={"fade"}
        className="mySwiper"
        autoplay={{
          delay: 2500,
          disableOnInteraction: true,
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="relative cursor-pointer" 
                onClick={() => handleImageClick(slide.path)}
              />
              <div className="absolute inset-0 flex items-start justify-center flex-col ml-5 md:ml-20">
                <motion.p
                  key={index}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="z-20 text-xs md:text-xl xl:text-xl font-thin uppercase text-gray-800 md:mb-5"
                >
                  {slide.title}
                </motion.p>
                <motion.h2
                  key={index}
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="z-20 text-lg  md:text-4xl xl:text-5xl font-bold text-black  md:mb-6"
                >
                  {slide.subtitle}
                </motion.h2>
                <motion.h1
                  key={index}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="z-20 text-xl  md:text-5xl xl:text-6xl font-extrabold  md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#120f0f] to-[#740a0a]"
                >
                  {slide.description}
                </motion.h1>
                <motion.div
                  initial={{ y: "100%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="flex justify-center items-center gap-2 md:gap-4"
                >
                  <button
                    className="bg-white mb-1 text-black font-semibold text-xs md:text-sm px-2 md:px-4 py-1 md:py-2 rounded-full hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center overflow-hidden"
                    onMouseEnter={() => handleMouseEnter(slide.Button)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleImageClick(slide.path)}
                  >
                    {slide.Button}
                    {hoveredButton === slide.Button ? (
                      <GoArrowRight className="inline-block ml-1 md:ml-2" />
                    ) : (
                      <GoArrowUpRight className="inline-block ml-1 md:ml-2" />
                    )}
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
