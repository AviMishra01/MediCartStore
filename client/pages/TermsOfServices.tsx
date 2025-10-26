import React from "react";

export default function TermsOfService() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6">Terms of Service</h1>

      <p className="mb-4 text-gray-700">
        Welcome to Medizo! By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
      </p>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">1. Acceptance of Terms</h2>
        <p className="text-gray-700">
          By using Medizo services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">2. Eligibility</h2>
        <p className="text-gray-700">
          You must be at least 18 years old to use our services. By using our website, you represent that you meet this requirement.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">3. User Accounts</h2>
        <p className="text-gray-700">
          Some features may require creating an account. You are responsible for maintaining the confidentiality of your login information and for all activities under your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">4. Purchases & Payments</h2>
        <p className="text-gray-700">
          All purchases made through Medizo are subject to our pricing, payment terms, and applicable laws. Payment information must be accurate and complete.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">5. Shipping & Delivery</h2>
        <p className="text-gray-700">
          We strive to deliver orders in a timely manner. Delivery times may vary depending on location and product availability.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">6. Returns & Refunds</h2>
        <p className="text-gray-700">
          Returns and refunds are subject to our <Link to="/refund-policy" className="text-indigo-600 underline hover:text-indigo-800">Refund Policy</Link>. Please review it carefully.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">7. Prohibited Conduct</h2>
        <p className="text-gray-700">
          Users must not misuse the website, engage in fraudulent activities, or violate applicable laws. Any violation may result in account suspension or legal action.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">8. Intellectual Property</h2>
        <p className="text-gray-700">
          All content on Medizo, including text, images, logos, and software, is owned by Medizo or its licensors and is protected by intellectual property laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">9. Limitation of Liability</h2>
        <p className="text-gray-700">
          Medizo shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">10. Changes to Terms</h2>
        <p className="text-gray-700">
          We may update these Terms of Service at any time. Continued use of our services constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 mb-2">11. Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions regarding these Terms of Service, please contact us at <Link to="/help" className="text-indigo-600 underline hover:text-indigo-800">Help & Support</Link>.
        </p>
      </section>
    </div>
  );
}
