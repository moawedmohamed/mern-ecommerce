import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";


interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface FeaturedProps {
  featuredProducts: Product[];
}

const FeaturedCarousel = ({ featuredProducts }: FeaturedProps) => {
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold text-center mb-6">Featured</h2>
      <Swiper
        modules={[Navigation,Autoplay]}
        navigation
        spaceBetween={20}
        slidesPerView={4} // 4 منتجات في الشاشة
		autoplay={{
			delay: 3000,   // المدة بين كل حركة بالمللي ثانية (3 ثواني هنا)
			disableOnInteraction: false, // لو ضغط المستخدم على زرار، الـ autoplay يكمل
		  }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {featuredProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-green-500 font-bold mb-2">${product.price}</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2">
                🛒 Add to Cart
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FeaturedCarousel;
