import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Medizo Privacy Policy</h1>
      
      <p className="mb-4">
        At Medizo, your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect personal information such as your name, email address, phone number, shipping address, and payment information when you create an account, place orders, or contact our support team.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
      <p className="mb-4">
        We use your information to:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Process and deliver your orders efficiently</li>
        <li>Provide customer support and resolve queries</li>
        <li>Send updates, promotions, and offers (if you opt-in)</li>
        <li>Improve our website, products, and services</li>
        <li>Prevent fraud and ensure secure transactions</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-3">3. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell or rent your personal information to third parties. We may share information with trusted service providers such as payment processors, shipping partners, and IT service providers to operate Medizo efficiently.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">4. Security</h2>
      <p className="mb-4">
        We use industry-standard security measures to protect your personal information. However, no method of online transmission is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">5. Cookies</h2>
      <p className="mb-4">
        Medizo uses cookies to enhance your browsing experience, remember your preferences, analyze website traffic, and deliver personalized content. You may disable cookies in your browser, but some features may not work correctly.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">6. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your personal information. You can also opt-out of marketing communications at any time by updating your preferences in your account or contacting our support.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">7. Changes to This Policy</h2>
      <p className="mb-4">
        Medizo may update this Privacy Policy periodically. Any changes will be reflected on this page with the latest effective date.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-3">8. Contact Us</h2>
      <p>
        If you have any questions regarding this Privacy Policy or how we handle your personal information, please contact us at{" "}
        <a href="mailto:support@medizo.com" className="text-blue-600 underline">support@medizo.com</a>.
      </p>
    </div>
  );
}
