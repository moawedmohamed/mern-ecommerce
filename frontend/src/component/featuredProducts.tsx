import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useCartStore } from "../stores/useCartStore";
import type { IProduct } from "../interfaces";
import { ShoppingCart } from "lucide-react";



interface FeaturedProps {
  featuredProducts: IProduct[];
}
const FeaturedCarousel = ({ featuredProducts }: FeaturedProps) => {
  const {addToCart}=useCartStore()
  return (
    <>
            				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>Featured</h2>

       <Swiper
      modules={[Navigation, Autoplay]}
      spaceBetween={16}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 3000 }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      className="py-4"
    >

      {featuredProducts?.map((product:IProduct) => (
        <SwiperSlide key={product._id}>
          
          <div className="w-full flex-shrink-0 px-2">
            <div className="bg-gray-700 bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">{product.name}</h3>
                <p className="text-emerald-300 font-medium mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </>
   
  );
};

export default FeaturedCarousel;
