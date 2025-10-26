import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Handshake, Heart, MessageSquare, Briefcase, Users, Award } from 'lucide-react';
import { motion } from "framer-motion";
import SagarJhaProfile from "../Images/sagar-jhaProfile.jpg";

export default function About() {
  return (
    <div className="w-full">

      {/* ------------------- 1. Hero Section: Our Story (with CEO story) ------------------- */}
      <section className="w-full py-12 lg:py-20 bg-gray-50 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
          Our Story
        </p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Bringing Quality Healthcare <br className="hidden md:inline"/> Right to Your Doorstep.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto space-y-4 text-justify">
          It all started with <strong>Sagar Jha</strong>, a passionate entrepreneur and dentist from Kathmandu, Nepal. From a young age, Sagar noticed the struggles people faced in accessing genuine medicines and healthcare services. Inspired to make a difference, he envisioned a platform where healthcare would be transparent, trustworthy, and convenient for everyone.
          <br /><br />
          With this vision, he founded <strong>Medizo</strong> — a digital healthcare startup aimed at simplifying the way people obtain medications, medical equipment, and wellness products. His journey was filled with challenges: building a tech platform from scratch, ensuring compliance with medical regulations, and earning users’ trust. But Sagar’s unwavering dedication, empathy, and technical expertise turned Medizo into a trusted platform for hundreds of users.
          <br /><br />
          Today, Medizo continues to grow under his leadership, merging technology with care. Every feature, every service, and every product is a reflection of Sagar’s commitment to making healthcare simple, affordable, and accessible for all. Innovation, empathy, and trust form the heart of Medizo’s story — a story still being written with each satisfied user and every step towards a healthier future.
        </p>
      </section>

      {/* ------------------- 2. Key Trust Pillars Section ------------------- */}
      <section className="container max-w-6xl py-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Medizo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-primary/50">
            <ShieldCheck size={36} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Quality</h3>
            <p className="text-gray-600">
              We source all medications from certified manufacturers and follow strict regulatory guidelines to ensure every product is 100% genuine and safe.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-primary/50">
            <Zap size={36} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast, Discreet Delivery</h3>
            <p className="text-gray-600">
              Get your essentials quickly with our reliable, tracked, and discreet delivery service. Health management made hassle-free.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-primary/50">
            <Handshake size={36} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Dedicated Care</h3>
            <p className="text-gray-600">
              Our registered pharmacists are available for consultation and support via chat or phone, ensuring you get the right advice.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------- 3. CEO Profile Section (Middle) ------------------- */}
      <section className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-10 max-w-4xl w-full text-center border border-gray-100"
        >
          <div className="flex justify-center">
            <img
              src={SagarJhaProfile}
              alt="Sagar Jha"
              className="w-44 h-44 rounded-full object-cover shadow-lg border-4 border-blue-500"
            />
          </div>

          <h1 className="text-4xl font-bold mt-6 text-gray-900">Sagar Jha</h1>
          <p className="text-blue-600 font-semibold text-lg mt-1">Founder & CEO of Medizo</p>

          <p className="italic text-gray-600 mt-4">
            “Innovation in healthcare begins with empathy — making wellness simple, affordable, and accessible for everyone.”
          </p>

          <div className="mt-8 text-gray-700 leading-relaxed text-justify space-y-4">
            <p><strong>Sagar Jha</strong> is the visionary <strong>Founder & CEO of Medizo</strong>, a digital healthcare startup redefining how people buy medicines and healthcare products online. His journey began with a mission to solve a simple but powerful problem — to make healthcare more transparent, affordable, and accessible for everyone.</p>
            <p>Under his leadership, Medizo has evolved from a small concept into a rapidly growing platform trusted by hundreds of users. Sagar’s technical expertise, passion for innovation, and deep understanding of user needs have helped shape Medizo into a brand that prioritizes trust, quality, and care above all else.</p>
            <p>Beyond technology, Sagar believes in the power of humanity in business. His work reflects a balance between cutting-edge software development and meaningful social impact — ensuring that every Medizo initiative serves a real human purpose.</p>
          </div>

          <div className="mt-10 text-left bg-blue-50 p-6 rounded-2xl shadow-sm">
            <h2 className="text-2xl font-semibold text-blue-700 mb-3">Leadership & Vision 🌍</h2>
            <p className="text-gray-700 leading-relaxed">
              As the driving force behind Medizo, Sagar is focused on building a sustainable healthcare ecosystem. His leadership centers on transparency, innovation, and teamwork — empowering every individual in his company to make a difference.  
              He envisions Medizo becoming one of the most trusted and loved online healthcare brands across South Asia by merging AI technology with medical convenience.
            </p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-gray-50 p-5 rounded-2xl shadow-sm">
              <p><strong>📍 Location:</strong> Kathmandu, Nepal</p>
              <p><strong>🎓 Education:</strong> Dentist and Bachelor in Medicine</p>
              <p><strong>💼 Role:</strong> Founder & CEO, Medizo</p>
              <p><strong>💡 Expertise:</strong> Dental Field, Software Development, Product Design, Leadership</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl shadow-sm">
              <p><strong>📧 Email:</strong> <a href="mailto:sagar@medizo.com" className="text-blue-600">sagar@medizo.com</a></p>
              <p><strong>🌐 Website:</strong> <a href="https://medizo.com" className="text-blue-600">www.medizo.com</a></p>
              <p><strong>💬 Motto:</strong> “Build technology that heals.”</p>
              <p><strong>🕊️ Interests:</strong> Innovation, Reading, Fitness, Entrepreneurship</p>
            </div>
          </div>

          <div className="mt-10 flex justify-center gap-6">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-900 font-semibold">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-700 hover:text-black font-semibold">GitHub</a>
            <a href="mailto:sagar@medizo.com" className="text-red-600 hover:text-red-800 font-semibold">Email</a>
          </div>

          <div className="mt-12 text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Medizo — Empowering Healthcare Digitally</p>
          </div>
        </motion.div>
      </section>

      {/* ------------------- 4. Our Values Section ------------------- */}
      <section className="container max-w-6xl py-10">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Our Core Values</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ValueCard icon={Heart} title="Empathy" description="Putting patient well-being at the heart of every decision." />
          <ValueCard icon={Briefcase} title="Integrity" description="Upholding the highest standards of ethics and honesty." />
          <ValueCard icon={Users} title="Accessibility" description="Making healthcare affordable and easy to reach for all." />
          <ValueCard icon={Award} title="Excellence" description="Continuously improving our platform and service quality." />
        </div>
      </section>

      {/* ------------------- 5. Call-to-Action Section ------------------- */}
      <section className="container max-w-6xl text-center pt-10">
        <div className="p-8 md:p-12 bg-white rounded-xl shadow-2xl border-t-4 border-primary">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Experience Better Pharmacy?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our curated selection of health, wellness, and essential products today. Your health journey starts here.
          </p>
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <Link 
              to="/products" 
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Start Shopping Now 
              <Zap size={20} />
            </Link>
            <Link 
              to="/contact" 
              className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              Contact Us 
              <MessageSquare size={20} />
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-primary transition-colors mx-2">Privacy Policy</Link>
            |
            <Link to="/terms" className="hover:text-primary transition-colors mx-2">Terms of Service</Link>
            |
            <Link to="/help" className="hover:text-primary transition-colors mx-2">Help Center</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 text-center shadow-sm">
      <Icon size={30} className="text-primary mx-auto mb-2" />
      <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}
