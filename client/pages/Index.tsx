import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { motion } from "framer-motion";
import ProductCard, { ProductCardProps } from "@/components/site/ProductCard";
import { apiGet } from "@/lib/api";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// Importing icons for USPs
import { Truck, ShieldCheck, Clock, Heart, FlaskConical, Stethoscope, ShoppingBag } from "lucide-react";


// --- IMAGE IMPORTS (assuming these paths are correct relative to the component) ---
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
// SagarJhaProfile is not used in the updated UI but kept for completeness
// import SagarJhaProfile from "../Images/sagar-jhaProfile.jpg"; 

// --- INTERFACES ---
interface ProductsResponse {
  items: ProductCardProps[];
  total: number;
}
interface Deal {
  id: string;
  title: string;
  subtitle: string;
  img: string;
  link: string; // Added link for clarity
}
interface Category {
  id: string;
  title: string;
  img: string;
  icon: React.ReactNode; // Added icon for USPs
}

// --- HELPER COMPONENTS ---

// Custom arrows for slider
const NextArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 right-4 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-indigo-600/80 p-3 text-white shadow-xl hover:bg-indigo-600 transition"
    onClick={onClick}
  >
    <FaChevronRight className="w-5 h-5" />
  </div>
);

const PrevArrow = ({ onClick }: any) => (
  <div
    className="absolute top-1/2 left-4 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-indigo-600/80 p-3 text-white shadow-xl hover:bg-indigo-600 transition"
    onClick={onClick}
  >
    <FaChevronLeft className="w-5 h-5" />
  </div>
);

// PromoCard Component (Refined)
function PromoCard({ title, subtitle, img }: { title: string; subtitle: string; img: string }) {
  return (
    <Link to="/products" className="block">
      <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-lg transition duration-300 hover:shadow-2xl">
        <div className="relative h-40 w-full">
          <img src={img} alt={title} className="h-full w-full object-cover brightness-90" loading="lazy" />
          {/* Subtle gradient to ensure text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute left-6 bottom-6 z-10 text-white">
            <div className="text-xl font-bold drop-shadow-md">{title}</div>
            <div className="text-sm text-white/90 font-medium">{subtitle}</div>
            <span className="mt-2 inline-block text-xs font-bold text-yellow-300 border-b border-yellow-300">
              EXPLORE
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}


// --- MAIN COMPONENT: HomePage ---

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<ProductCardProps[]>([]);
  const [hotDeals] = useState<Deal[]>([
    {
      id: "deal-1",
      title: "Heart Care Essentials",
      subtitle: "Flat 25% Off + Extra Cashback on Card Payments.",
      img: HeartCARE,
      link: '/products?category=Heart%20Care'
    },
    {
      id: "deal-2",
      title: "Daily Vitamins & Immunity",
      subtitle: "Buy 1 Get 1 Free on all Immunity Boosters. Stock up now!",
      img: "https://images.unsplash.com/photo-1603398938378-e54eab446dde",
      link: '/products?category=Vitamins'
    },
    {
      id: "deal-3",
      title: "Baby & Mother Wellness",
      subtitle: "Extra 20% Off on select Baby and Mom essential brands.",
      img: BabyMotherCare,
      link: '/products?category=Baby%20Care'
    },
    {
      id: "deal-4",
      title: "Complete Diabetes Care",
      subtitle: "Save 15% on testing strips, supplements, and diabetic diet products.",
      img: DiabetesCare,
      link: '/products?category=Diabetes'
    },
  ]);

  const topCategories: Category[] = [
    { id: "c1", title: "Vitamins & Supplements", img: Vitamins, icon: <FlaskConical className="w-6 h-6 text-indigo-500" /> },
    { id: "c2", title: "Diabetes Care", img: diabetes, icon: <Stethoscope className="w-6 h-6 text-red-500" /> },
    { id: "c3", title: "Pain Relief", img: painrelief, icon: <Heart className="w-6 h-6 text-yellow-500" /> },
    { id: "c4", title: "Baby Care", img: babyCare, icon: <ShoppingBag className="w-6 h-6 text-blue-500" /> },
    { id: "c5", title: "Women's Health", img: WomenCare, icon: <Heart className="w-6 h-6 text-pink-500" /> },
  ];

  useEffect(() => {
    apiGet<ProductsResponse>("/api/products", { featured: true, limit: 12 })
      .then((d) => setFeatured(d.items))
      .catch(() => setFeatured([]));
  }, []);

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
    customPaging: () => (
      <div className="h-2 w-2 rounded-full bg-white/50 transition-colors duration-300 hover:bg-white" />
    ),
  };

  const USP_ITEMS = [
    { icon: <ShieldCheck className="w-7 h-7 text-indigo-500" />, title: "100% Genuine", description: "Only verified products from trusted brands." },
    { icon: <Truck className="w-7 h-7 text-green-500" />, title: "Fast Delivery", description: "Doorstep service in 24-48 hours." },
    { icon: <Clock className="w-7 h-7 text-yellow-500" />, title: "24/7 Support", description: "Assistance available day and night." },
    { icon: <Stethoscope className="w-7 h-7 text-red-500" />, title: "Expert Advice", description: "Connect with our certified pharmacists." },
  ];


  return (
    <div className="w-full bg-gray-50">

      {/* HERO & SLIDER SECTION */}
      <section className="border-b bg-white">
        <div className="container grid gap-8 py-8 md:grid-cols-3 md:py-12">

          {/* Main Content & Slider */}
          <div className="md:col-span-2">

            {/* Main Headline Block (Simplified) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-green-50 p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                      Health <span className="text-indigo-600">Simplified</span>, Delivery <span className="text-green-600">Fast</span>.
                    </h1>
                    <p className="mt-3 text-base text-gray-700 max-w-md">
                      Get genuine medicines, wellness products, and healthcare essentials delivered right to your home.
                    </p>
                  </div>

                  {/* Search and CTA */}
                  <div className="mt-3 md:mt-0 w-full md:w-2/5">
                    <div className="relative">
                      <input
                        placeholder="Search medicines, brands, symptoms..."
                        className="w-full rounded-full border border-gray-300 py-3 pl-5 pr-4 text-sm shadow-inner focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") navigate('/products?q=' + (e.target as HTMLInputElement).value);
                        }}
                      />
                      <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 transition shadow-md">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HOT DEALS SLIDER */}
            <div className="mt-8 relative">
              <Slider {...sliderSettings}>
                {hotDeals.map((d) => (
                  <motion.div key={d.id} whileHover={{ scale: 1.005 }} className="px-2 cursor-pointer">
                    <Link to={d.link}>
                      <div className="relative overflow-hidden rounded-xl shadow-xl">
                        <img
                          src={d.img}
                          alt={d.title}
                          className="h-64 w-full object-cover brightness-75 transition-transform duration-500 hover:scale-[1.01]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 text-white max-w-md">
                          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-300 bg-red-600/80 px-2 py-0.5 rounded-sm">Hot Deal</span>
                          <h3 className="text-3xl font-extrabold mt-2 drop-shadow-md">{d.title}</h3>
                          <p className="text-md text-white/90 mt-1">{d.subtitle}</p>
                          <div className="mt-4">
                            <span className="rounded-full bg-green-500 px-5 py-2 text-sm font-semibold shadow hover:bg-green-600 transition-colors">
                              Shop Offer
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </Slider>
            </div>
          </div>

          {/* RIGHT PROMOS */}
          <aside className="hidden md:block">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-6">
              <PromoCard title="Exclusive Card Offer" subtitle="Get 10% Cashback on bank cards" img={CardsImage} />
              <PromoCard title="Zero Delivery Cost" subtitle="Free Shipping on all orders over ₹499" img={freeShipping} />
            </motion.div>
          </aside>
        </div>
      </section>

      {/* WHY CHOOSE US / USPs SECTION */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {USP_ITEMS.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50">
              {item.icon}
              <div>
                <h3 className="text-base font-semibold text-gray-800">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP CATEGORIES */}
      <section className="container py-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-800 border-b pb-2">Shop By Top Categories</h2>
        <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4">
          {topCategories.map(cat => (
            <motion.button
              whileHover={{ y: -3, scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(cat.title)}`)}
              key={cat.id}
              className="group flex w-40 flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-center shadow-md transition-all duration-300 flex-shrink-0"
            >
              {/* Icon/Image wrapper */}
              <div className="h-16 w-16 overflow-hidden rounded-full border-4 border-indigo-100 grid place-items-center bg-white shadow-inner">
                {cat.icon}
              </div>
              <div className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition">{cat.title}</div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container py-10 bg-white rounded-xl shadow-inner border border-gray-100 mb-12">
        <div className="flex items-center justify-between border-b pb-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
          <Link to="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
            View all products &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {featured.slice(0, 10).map((p) => (
            <motion.div key={p._id} whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }} className="relative rounded-lg overflow-hidden transition-shadow">
              <ProductCard {...p} />
            </motion.div>
          ))}
          {featured.length === 0 && (
            <div className="col-span-full text-center text-base text-gray-500 p-8">Loading best-selling products...</div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS SECTION (kept the structure, updated styling) */}
      <section className="bg-gray-100 py-12 mb-12">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Trusted by Our Community</h2>
          <Slider
            dots
            infinite
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={5000}
            arrows={false}
          >
            {[
              { id: 1, name: "Rita Sharma", feedback: "Medizo delivers my medicines on time every time! The quality is reliable, and the checkout process is seamless. Highly recommended.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
              { id: 2, name: "Anil Kumar", feedback: "Great platform! Easy to navigate and I appreciate the genuine product guarantee. The support team is also very helpful.", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
              { id: 3, name: "Priya Singh", feedback: "My order arrived super fast, and the packaging was excellent. Customer support resolved my query instantly. A truly reliable online pharmacy.", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
            ].map(t => (
              <div key={t.id} className="p-4">
                <div className="flex flex-col items-center text-center bg-white shadow-2xl rounded-2xl p-8 max-w-2xl mx-auto border-t-4 border-indigo-600">
                  <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-4" loading="lazy" />
                  <div className="text-2xl text-yellow-500 mb-3">★★★★★</div>
                  <p className="mb-4 text-gray-700 text-lg italic leading-relaxed">"{t.feedback}"</p>
                  <p className="font-extrabold text-indigo-600 text-base mt-2">-- {t.name}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
}