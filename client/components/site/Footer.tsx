import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-gradient-to-b from-green-50 to-green-100 text-gray-900">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-8">
          
          {/* Brand */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-green-100 grid place-items-center">
                <span className="text-green-600 text-lg font-black">✚</span>
              </div>
              <span className="text-base font-extrabold tracking-tight">Medizo</span>
            </div>
            <p className="mt-3 text-sm text-gray-700 leading-relaxed max-w-xs">
              Your trusted online medical store — delivering genuine medicines,
              wellness essentials, and healthcare products at your doorstep.
            </p>
          </div>

          {/* Support + Contact */}
          <div className="flex flex-col sm:flex-row md:flex-row gap-8 md:gap-12 flex-1">
            
            {/* Support */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Support
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link to="/help" className="hover:text-green-600 transition-colors">Help Center</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-green-600 transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                Contact
              </h4>
              <div className="mt-3 flex flex-col sm:flex-row sm:gap-6 gap-3 text-sm text-gray-700 flex-wrap">
                <a
                  href="mailto:abhijeetmishralyff@gmail.com"
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <FaEnvelope className="h-5 w-5" /> Email
                </a>
                <a
                  href="https://instagram.com/itsabhi0770"
                  target="_blank"
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <FaInstagram className="h-5 w-5" /> Insta
                </a>
                <a
                  href="https://wa.me/9779821765304"
                  className="flex items-center gap-1 hover:text-green-600 transition-colors"
                >
                  <FaPhone className="h-5 w-5" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold text-gray-800">Medizo</span>. All rights reserved.
      </div>
    </footer>
  );
}
