import React, { useState } from 'react';
import { ChevronDown, Search, Mail, Phone, ShoppingCart, User, Truck, CreditCard } from 'lucide-react';

// Define the FAQ data structure
const faqSections = [
  {
    title: "Ordering & Prescriptions",
    icon: ShoppingCart,
    faqs: [
      {
        question: "How do I upload a new prescription?",
        answer: "You can securely upload your prescription directly on the 'Prescription Refill' page. We accept digital scans or clear photos of a valid prescription from a licensed healthcare provider."
      },
      {
        question: "Can I track my order status?",
        answer: "Yes. Once your order is shipped, you will receive a tracking number via email. You can also view the status and tracking details anytime in your 'Order History' under your profile."
      },
      {
        question: "What if a product is out of stock?",
        answer: "If a product is out of stock, you can sign up for an email notification on the product page. We will alert you the moment it becomes available again."
      },
    ],
  },
  {
    title: "Account & Security",
    icon: User,
    faqs: [
      {
        question: "How do I update my shipping address?",
        answer: "Log into your account, navigate to the 'Profile' or 'Addresses' section, and you can add, edit, or delete any saved addresses there."
      },
      {
        question: "Is my personal and medical information secure?",
        answer: "Absolutely. We are committed to patient privacy. All personal and prescription data is encrypted and handled in strict compliance with all relevant privacy regulations. Please review our Privacy Policy for more details."
      },
    ],
  },
  {
    title: "Shipping, Returns & Payment",
    icon: Truck,
    faqs: [
      {
        question: "What are your shipping costs and delivery times?",
        answer: "We offer flat-rate standard shipping and an expedited option. Standard delivery typically takes 3-5 business days. You can see the exact costs calculated at checkout."
      },
      {
        question: "What is your return policy?",
        answer: "Due to the nature of medical products, we cannot accept returns on prescription medications. Non-prescription items can be returned within 30 days if they are unopened and in their original packaging."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, Amex), PayPal, and occasionally offer a 'Buy Now, Pay Later' option through a third-party partner."
      },
    ],
  },
];

// Helper component for the Accordion Item
function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 px-4 text-left text-lg font-semibold text-gray-800 hover:text-primary transition-colors focus:outline-none"
        onClick={onClick}
      >
        <span>{question}</span>
        <ChevronDown 
          size={20} 
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'rotate-0 text-gray-500'}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600 leading-relaxed transition-all duration-300 ease-in-out">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const [openSection, setOpenSection] = useState(null); // State for which FAQ section is open
  const [openFAQ, setOpenFAQ] = useState(null); // State for which individual FAQ is open

  const handleFAQClick = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="container py-12 lg:py-20 bg-gray-50">
      <div className="mx-auto max-w-5xl">

        {/* Header and Search Bar */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Medizo Help Center</h1>
          <p className="text-lg text-gray-600 mb-6">Find answers to common questions or connect with our support team.</p>
          
          <div className="relative max-w-xl mx-auto">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              placeholder="Search for a topic or question..."
              className="w-full h-12 p-3 pl-12 border border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition"
              // In a real app, this would filter the FAQ content
            />
          </div>
        </div>

        {/* Main Content: Sidebar and Accordion */}
        <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl shadow-2xl border border-gray-100">

          {/* Sidebar Navigation */}
          <div className="lg:w-1/4 p-6 border-b lg:border-r lg:border-b-0">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Support Topics</h3>
            <nav className="space-y-2">
              {faqSections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setOpenSection(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors font-medium ${
                    openSection === index 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <section.icon size={20} />
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* FAQ Accordion Area */}
          <div className="lg:w-3/4 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {openSection !== null ? faqSections[openSection].title : "Frequently Asked Questions"}
            </h3>

            <div className="border-t border-gray-200">
              {(openSection !== null ? faqSections[openSection].faqs : faqSections.flatMap(s => s.faqs)).map((faq, index) => (
                <AccordionItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onClick={() => handleFAQClick(index)}
                />
              ))}
              {/* Fallback if no section is selected or if content is filtered out */}
              {openSection === null && faqSections.length > 0 && (
                 <p className="p-4 text-center text-gray-500">Select a topic from the left to view specific FAQs.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Contact CTA */}
        <div className="mt-12 p-8 bg-white rounded-xl shadow-xl border-t-4 border-primary text-center">
            <h4 className="text-2xl font-bold text-gray-900 mb-3">Still Need Help?</h4>
            <p className="text-gray-600 mb-6">If you can't find the answer you're looking for, our support team is ready to assist you.</p>
            <div className="flex justify-center gap-4">
                <a 
                    href="/contact" 
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors"
                >
                    <Mail size={20} /> Contact Support
                </a>
                <a 
                    href="tel:+18001234567" 
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                >
                    <Phone size={20} /> Call Us Now
                </a>
            </div>
        </div>

      </div>
    </div>
  );
}