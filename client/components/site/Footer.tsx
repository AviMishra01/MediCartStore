import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaTwitter, FaCreditCard } from "react-icons/fa"; // Added more icons

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-gradient-to-b from-indigo-50/50 to-indigo-100/70 text-gray-900 shadow-inner">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-8">

          {/* Brand & Description (Column 1) */}
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2">
             <div className="h-8 w-8 rounded-md bg-primary/10 grid place-items-center">
            <span className="text-primary text-lg font-black">✚</span>
          </div>
          <span className="text-base font-extrabold tracking-tight text-gray-900">
            Medizo
          </span>
            </div>
            <p className="mt-4 text-sm text-gray-700 leading-relaxed max-w-sm">
              Your trusted online medical store — delivering genuine medicines,
              wellness essentials, and healthcare products right to your doorstep.
            </p>

            {/* Social Media Links */}
            <div className="mt-6 flex gap-4 text-gray-500">
              <a href="https://facebook.com" target="_blank" aria-label="Facebook" className="hover:text-indigo-600 transition">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com/itsabhi0770" target="_blank" aria-label="Instagram" className="hover:text-indigo-600 transition">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" aria-label="Twitter" className="hover:text-indigo-600 transition">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links (Column 2) */}
          <div>
            <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>
                <Link to="/products" className="hover:text-indigo-600 transition-colors">Shop All</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-indigo-600 transition-colors">Track Orders</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal (Column 3) */}
          <div>
            <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">
              Support
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>
                <Link to="/help" className="hover:text-indigo-600 transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Follow (Column 4) */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-bold text-indigo-700 uppercase tracking-wider">
              Get in Touch
            </h4>
            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <a
                href="mailto:abhijeetmishralyff@gmail.com"
                className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
              >
                <FaEnvelope className="h-4 w-4 text-indigo-500" /> abhijeetmishralyff@gmail.com
              </a>
              <a
                href="https://wa.me/9779821765304"
                className="flex items-center gap-2 hover:text-indigo-600 transition-colors"
              >
                <FaPhone className="h-4 w-4 text-indigo-500" /> +977 9821765304 (WhatsApp)
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-indigo-200 bg-indigo-100 py-6 text-center">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600 order-2 md:order-1">
              © {new Date().getFullYear()} <span className="font-semibold text-gray-800">Medizo</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs order-1 md:order-2">
              <FaCreditCard className="text-xl text-indigo-400" /> Secure Payments
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}