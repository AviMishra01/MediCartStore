import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import ProductCard, { ProductCardProps } from "@/components/site/ProductCard";
import { apiGet } from "@/lib/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CardsImage from "../Images/CardsOffer.png";
import babyCare from "../Images/BabyCare.jpg";
import WomenCare from "../Images/WomensCare.jpg";
import BabyMotherCare from "../Images/Baby-MotherCare.jpg";
import Vitamins from "../Images/Vitamins.jpg";
import painrelief from "../Images/painrelief.jpg";
import DiabetesCare from "../Images/DiabetesCare.jpg";
import diabetes from "../Images/Diabetes.jpg";
import freeShipping from "../Images/freeShipping.jpg";
import HeartCARE from "../Images/HeartCARE.png";
import SagarJhaProfile from "../Images/sagar-jhaProfile.jpg";

interface ProductsResponse {
  items: ProductCardProps[];
  total: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<ProductCardProps[]>([]);
  const [hotDeals] = useState([
    {
      id: "deal-1",
      title: "Heart Care Medicines – Flat 25% Off",
      subtitle: "Limited time • Card cashback",
      img: HeartCARE,
    },
    {
      id: "deal-2",
      title: "Immunity Boosters – Buy 1 Get 1",
      subtitle: "While stocks last",
      img: "https://images.unsplash.com/photo-1603398938378-e54eab446dde",
    },
    {
      id: "deal-3",
      title: "Baby & Mother Care – Extra 20% Off",
      subtitle: "Select brands",
      img: BabyMotherCare,
    },
    {
      id: "deal-4",
      title: "Diabetes Care – Save 15%",
      subtitle: "Popular picks",
      img: DiabetesCare,
    },
  ]);

  useEffect(() => {
    apiGet<ProductsResponse>("/api/products", { featured: true, limit: 12 })
      .then((d) => setFeatured(d.items))
      .catch(() => setFeatured([]));
  }, []);

  // Custom arrows
  const NextArrow = ({ onClick }: any) => (
    <div
      className="absolute top-1/2 right-2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-green-500 p-2 text-white shadow hover:bg-green-600"
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );

  const PrevArrow = ({ onClick }: any) => (
    <div
      className="absolute top-1/2 left-2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-green-500 p-2 text-white shadow hover:bg-green-600"
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
  };

  return (
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="border-b">
        <div className="container grid gap-6 py-8 md:grid-cols-3 md:py-12">
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-lg">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">
                      Genuine Medicines. Fast Delivery.
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                      Thousands of medicines, wellness and healthcare essentials at your doorstep.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-green-700 font-semibold">
                      <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 bg-green-100">✔ 100% Genuine</span>
                      <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 bg-green-100">✔ Free Returns</span>
                      <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 bg-green-100">✔ 24x7 Support</span>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-0 w-full md:w-1/2">
                    <div className="relative">
                      <input
                        placeholder="Search medicines, brands, symptoms..."
                        className="w-full rounded-lg border py-3 pl-4 pr-12 text-sm shadow-sm focus:ring-2 focus:ring-green-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") navigate('/products?q=' + (e.target as HTMLInputElement).value);
                        }}
                      />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-green-500 px-3 py-2 text-white text-sm hover:bg-green-600 transition">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HOT DEALS SLIDER */}
            <div className="mt-6 relative">
              <Slider {...sliderSettings}>
                {hotDeals.map((d) => (
                  <motion.div key={d.id} whileHover={{ scale: 1.02 }} className="px-2">
                    <div className="relative overflow-hidden rounded-xl shadow-lg">
                      <img
                        src={d.img}
                        alt={d.title}
                        className="h-56 w-full object-cover brightness-90 transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute left-6 bottom-6 z-10 text-white">
                        <h3 className="text-2xl font-bold drop-shadow-lg">{d.title}</h3>
                        <p className="text-sm text-white/90 mt-1">{d.subtitle}</p>
                        <div className="mt-3">
                          <Link to="/products" className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium shadow hover:bg-green-600 transition-colors">
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Slider>
            </div>
          </div>

          {/* RIGHT PROMOS */}
          <aside className="hidden md:block">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
              <PromoCard title="Card Offer: 10% Cashback" subtitle="On selected banks" img={CardsImage} />
              <PromoCard title="Free Shipping over ₹499" subtitle="Across select cities" img={freeShipping} />
            </motion.div>
          </aside>
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="container py-8">
        <h2 className="mb-4 text-lg font-bold">Top Categories</h2>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {[{ id: "c1", title: "Vitamins", img: Vitamins },
            { id: "c2", title: "Diabetes", img: diabetes },
            { id: "c3", title: "Pain Relief", img: painrelief },
            { id: "c4", title: "Baby Care", img: babyCare },
            { id: "c5", title: "Women's Care", img: WomenCare },
          ].map(cat => (
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.title)}`)}
              key={cat.id}
              className="group flex w-40 flex-col items-center gap-2 rounded-lg border bg-white p-3 text-center shadow-sm hover:shadow-lg transition"
            >
              <div className="h-20 w-full overflow-hidden rounded-md">
                <img src={cat.img} alt={cat.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
              </div>
              <div className="text-sm font-medium">{cat.title}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Medicines</h2>
          <Link to="/products" className="text-sm text-green-600 hover:underline">View all</Link>
        </div>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => (
            <motion.div key={p._id} whileHover={{ y: -6 }} className="relative">
              <ProductCard {...p} />
            </motion.div>
          ))}
          {featured.length === 0 && (
            <div className="col-span-full text-center text-sm text-gray-500">No featured products yet.</div>
          )}
        </div>
      </section>

      {/* UPDATED TESTIMONIALS SECTION */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-700">What Our Customers Say</h2>
        <Slider
          dots
          infinite
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          autoplay
          autoplaySpeed={4000}
          arrows={false}
        >
          {[ 
            { id: 1, name: "Rita Sharma", feedback: "Medizo delivers my medicines on time every time! Highly recommended.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
            { id: 2, name: "Anil Kumar", feedback: "Great platform! Easy to navigate and genuine products.", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
            { id: 3, name: "Priya Singh", feedback: "Customer support is amazing and delivery is super fast.", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
          ].map(t => (
            <div key={t.id} className="flex flex-col items-center text-center px-4 sm:px-8">
              <div className="flex items-center flex-col sm:flex-row gap-4 sm:gap-6 bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto">
                <img src={t.avatar} alt={t.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-green-500" loading="lazy"/>
                <div className="text-gray-700 text-sm sm:text-base">
                  <p className="mb-2">"{t.feedback}"</p>
                  <p className="font-semibold text-green-700">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

    </div>
  );
}

// PromoCard Component
function PromoCard({ title, subtitle, img }: { title: string; subtitle: string; img: string }) {
  return (
    <div className="rounded-lg overflow-hidden border bg-white shadow hover:shadow-lg transition">
      <div className="relative h-32 w-full">
        <img src={img} alt={title} className="h-full w-full object-cover" loading="lazy"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-4 bottom-4 z-10 text-white">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-white/90">{subtitle}</div>
        </div>
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500">Limited time only</div>
        <div className="mt-3">
          <Link to="/products" className="rounded-md bg-green-500 px-4 py-2 text-sm text-white shadow hover:bg-green-600 transition">
            Shop Offers
          </Link>
        </div>
      </div>
    </div>
  );
}
