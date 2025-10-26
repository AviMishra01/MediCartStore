import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Handshake, Heart, MessageSquare, Briefcase, Users, Award, ShoppingBag, Mail, GitFork } from 'lucide-react';
import { motion } from "framer-motion";
import SagarJhaProfile from "../Images/sagar-jhaProfile.jpg";
import AbhijeetProfile from "../Images/abhijeet-mishraProfile.jpg"; // Add your profile image

const PRIMARY_COLOR = "indigo";
const PRIMARY_CLASS = `text-${PRIMARY_COLOR}-600`;
const BG_PRIMARY_CLASS = `bg-${PRIMARY_COLOR}-600`;
const HOVER_BG_CLASS = `hover:bg-${PRIMARY_COLOR}-700`;

function ValueCard({ icon: Icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-100 text-center shadow-lg transition duration-300 hover:shadow-2xl hover:border-indigo-200">
      <Icon size={32} className={`text-${PRIMARY_COLOR}-600 mx-auto mb-3`} />
      <h4 className="text-xl font-bold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default function About() {
  return (
    <div className="w-full">

      {/* 1. Hero Section */}
      <section className="w-full py-16 lg:py-24 bg-indigo-50/70 text-center">
        <p className={`text-sm font-bold uppercase tracking-widest ${PRIMARY_CLASS} mb-3`}>
          Our Story, Our Mission
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
          Seamless Healthcare, <br className="hidden md:inline" /> Delivered with Trust.
        </h1>
        <div className="text-lg text-gray-700 max-w-4xl mx-auto px-4 space-y-5 text-justify">
          <p>
            The journey of Medizo began with <strong>Sagar Jha</strong>, a medical field expert, and <strong>Abhijeet Mishra</strong>, a tech and business expert. Together, they envisioned a digital bridge connecting people directly to certified, affordable, and reliable healthcare products.
          </p>
          <p>
            Founded on the principles of <strong>transparency and empathy</strong>, Medizo quickly grew from a simple idea into a <strong>trusted digital pharmacy</strong>. Despite technological challenges and regulatory hurdles, Sagar’s dedication to healthcare and Abhijeet’s tech expertise powered the platform’s success.
          </p>
          <p className="font-semibold text-gray-800">
            Today, Medizo reflects their shared belief: that high-quality health management should be <strong>simple, convenient, and accessible</strong> for everyone — <strong>providing medical accessories everywhere, every time</strong>.
          </p>

        </div>
      </section>


      {/* 2. Key Trust Pillars */}
      <section className="container max-w-7xl py-16 lg:py-24 px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Promise to You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-indigo-300">
            <ShieldCheck size={40} className={`text-${PRIMARY_COLOR}-600 mx-auto mb-4`} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Certified Quality</h3>
            <p className="text-gray-600">
              Every supplier is verified and strict quality checks ensure you receive <strong>100% genuine and safe</strong> products.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-indigo-300">
            <Zap size={40} className={`text-${PRIMARY_COLOR}-600 mx-auto mb-4`} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Rapid & Discreet</h3>
            <p className="text-gray-600">
              Get your essential medication fast. Our delivery is <strong>reliable, tracked, and discreet</strong>.
            </p>
          </div>
          <div className="p-8 bg-white rounded-2xl shadow-xl border border-gray-100 transition duration-300 hover:shadow-2xl hover:border-indigo-300">
            <Handshake size={40} className={`text-${PRIMARY_COLOR}-600 mx-auto mb-4`} />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Expert Human Care</h3>
            <p className="text-gray-600">
              Our team of <strong>registered pharmacists</strong> is available via chat and phone to provide professional support.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Leadership Profiles */}
      <section className="min-h-screen bg-gradient-to-tr from-indigo-50 to-white flex flex-col items-center justify-center px-4 py-16 lg:py-24 space-y-16">

        {/* Sagar Jha */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 max-w-5xl w-full text-center border-4 border-white ring-8 ring-indigo-100/50"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Meet the Visionary</h2>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">

            <div className="flex flex-col items-center flex-shrink-0 lg:w-1/3">
              <img
                src={SagarJhaProfile}
                alt="Sagar Jha - Founder & CEO of Medizo"
                className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-indigo-500 ring-4 ring-indigo-200/50"
              />
              <h1 className="text-3xl font-extrabold mt-6 text-gray-900">Sagar Jha</h1>
              <p className={`text-${PRIMARY_COLOR}-700 font-semibold text-lg mt-1`}>Founder & CEO, Medizo</p>
              <p className="italic text-gray-500 mt-3 max-w-xs">
                “Innovation in healthcare begins with empathy — making wellness simple, affordable, and accessible for everyone.”
              </p>
              <div className="mt-6 flex justify-center gap-4 text-sm">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`flex items-center gap-1 ${PRIMARY_CLASS} hover:text-indigo-800 font-semibold transition`}>
                  <Briefcase size={16} /> LinkedIn
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-gray-700 hover:text-black font-semibold transition">
                  <GitFork size={16} /> GitHub
                </a>
                <a href="mailto:sagar@medizo.com" className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold transition">
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>

            <div className="text-left leading-relaxed text-gray-700 space-y-5 lg:w-2/3">
              <p>
                <strong>Sagar Jha</strong> is a medical field expert and the Founder & CEO of Medizo. With a background in healthcare, he focuses on <strong>quality healthcare solutions</strong> and improving access to essential medicines for everyone.
              </p>
              <div className={`mt-6 p-5 rounded-2xl shadow-inner bg-indigo-50 border-l-4 border-${PRIMARY_COLOR}-600`}>
                <h2 className={`text-xl font-bold text-${PRIMARY_COLOR}-700 mb-2`}>Our Guiding Vision 🌍</h2>
                <p>
                  Sagar aims to create a sustainable, user-centric healthcare ecosystem, making Medizo the most trusted online healthcare brand across South Asia.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <p className="text-sm">📍 Location: Kathmandu, Nepal</p>
                <p className="text-sm">🎓 Education: Dentist</p>
                <p className="text-sm">💡 Expertise: Medical Field & Entrepreneurship</p>
                <p className="text-sm">💬 Motto: “Empathy drives innovation in healthcare.”</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Abhijeet Mishra */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-12 max-w-5xl w-full text-center border-4 border-white ring-8 ring-indigo-100/50"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Meet the Co-Founder</h2>
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">

            <div className="flex flex-col items-center flex-shrink-0 lg:w-1/3">
              <img
                src={AbhijeetProfile}
                alt="Abhijeet Mishra - CFO & Tech Expert"
                className="w-48 h-48 rounded-full object-cover shadow-xl border-4 border-indigo-500 ring-4 ring-indigo-200/50"
              />
              <h1 className="text-3xl font-extrabold mt-6 text-gray-900">Abhijeet Mishra</h1>
              <p className={`text-${PRIMARY_COLOR}-700 font-semibold text-lg mt-1`}>CFO & Co-Founder, Tech Expert</p>
              <p className="italic text-gray-500 mt-3 max-w-xs">
                “Bridging technology with healthcare to create seamless and reliable solutions for everyone.”
              </p>
              <div className="mt-6 flex justify-center gap-4 text-sm">
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`flex items-center gap-1 ${PRIMARY_CLASS} hover:text-indigo-800 font-semibold transition`}>
                  <Briefcase size={16} /> LinkedIn
                </a>
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-gray-700 hover:text-black font-semibold transition">
                  <GitFork size={16} /> GitHub
                </a>
                <a href="mailto:abhijeet@medizo.com" className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold transition">
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>

            <div className="text-left leading-relaxed text-gray-700 space-y-5 lg:w-2/3">
              <p>
                <strong>Abhijeet Mishra</strong> is the CFO & Co-Founder of Medizo, bringing expertise in <strong>technology, product design, and business strategy</strong> to the platform. He ensures Medizo operates efficiently while delivering cutting-edge tech solutions for healthcare.
              </p>
              <div className={`mt-6 p-5 rounded-2xl shadow-inner bg-indigo-50 border-l-4 border-${PRIMARY_COLOR}-600`}>
                <h2 className={`text-xl font-bold text-${PRIMARY_COLOR}-700 mb-2`}>Tech & Vision 💻</h2>
                <p>
                  Abhijeet focuses on integrating technology to streamline healthcare services, enhance user experience, and innovate digital solutions for medical access.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <p className="text-sm">📍 Location: Kathmandu, Nepal</p>
                <p className="text-sm">🎓 Education: Software Development</p>
                <p className="text-sm">💡 Expertise: Software Development & Product Design</p>
                <p className="text-sm">💬 Motto: “Technology that empowers healthcare.”</p>
              </div>
            </div>
          </div>
        </motion.div>

      </section>

      {/* 4. Values Section */}
      <section className="container max-w-7xl py-16 lg:py-24 px-4 bg-white">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">The Values That Drive Us</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ValueCard icon={Heart} title="Empathy" description="Putting patient well-being at the heart of every service and decision." />
          <ValueCard icon={Award} title="Integrity" description="Upholding the highest standards of ethics, honesty, and product quality." />
          <ValueCard icon={Users} title="Accessibility" description="Striving to make essential healthcare products affordable and easy to reach." />
          <ValueCard icon={Zap} title="Innovation" description="Continuously improving our platform with cutting-edge technology for convenience." />
        </div>
      </section>

      {/* 5. Call-to-Action */}
      <section className="container max-w-7xl text-center pt-10 pb-16 lg:pb-24">
        <div className={`p-8 md:p-16 bg-white rounded-3xl shadow-2xl border-t-8 border-${PRIMARY_COLOR}-600`}>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your Healthcare Experience?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore our verified products, get expert advice, and manage your health seamlessly. Join the Medizo family today.
          </p>
          <div className="flex justify-center items-center gap-5 flex-wrap">
            <Link
              to="/products"
              className={`px-10 py-3 ${BG_PRIMARY_CLASS} text-white font-bold rounded-full shadow-lg ${HOVER_BG_CLASS} transition-all duration-300 flex items-center gap-2 text-lg`}
            >
              Start Shopping
              <ShoppingBag size={20} />
            </Link>
            <Link
              to="/contact"
              className="px-10 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 text-lg"
            >
              Get in Touch
              <MessageSquare size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
