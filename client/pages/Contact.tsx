import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare } from 'lucide-react';
import emailjs from '@emailjs/browser';


// Tailwind class merger
const cn = (...classes) => classes.filter(Boolean).join(' ');

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    emailjs.send(
      'service_8fwf3yd',
      'template_27tadih',
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
      },
      'TvETOkkYO7KDPXQRG'
    )
    .then(() => {
      setStatus('Message sent successfully! We will be in touch shortly. 🎉');
      setFormData({ name: '', email: '', message: '' });
    })
    .catch(() => {
      setStatus('Failed to send. Please check your details and try again.');
    });
  };

  const InputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition placeholder:text-gray-400";
  const LabelStyle = "block text-sm font-medium text-gray-700 mb-1";
  const SubmitButtonStyle = "h-12 bg-primary px-6 text-base font-bold text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 rounded-lg";

  return (
    <div className="container py-12 lg:py-20 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12 p-6">

        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-8 p-6 bg-white rounded-xl shadow-xl border border-gray-100 h-fit">
          <h2 className="text-3xl font-bold text-gray-900 border-b pb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600">
            We're here to help you with prescriptions, product inquiries, or any feedback you have.
          </p>

          <div className="space-y-6">
            <ContactInfoItem icon={Phone} title="Call Us" value="+977 9821765304" link="tel:+9779821765304" />
            <ContactInfoItem icon={Mail} title="Email Support" value="support@medizo.com" link="mailto:support@medizo.com" />
            <ContactInfoItem icon={MapPin} title="Our Office" value="Baneshwor, Kathmandu, Nepal" />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Business Hours</h3>
            <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-gray-600 text-sm">Saturday: 10:00 AM - 4:00 PM</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-8 bg-white rounded-xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div>
              <label htmlFor="name" className={LabelStyle}>Your Full Name</label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={cn(InputStyle, "pl-10")}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={LabelStyle}>Email Address</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className={cn(InputStyle, "pl-10")}
                  required
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className={LabelStyle}>Your Message</label>
              <div className="relative">
                <MessageSquare size={20} className="absolute left-3 top-4 text-gray-400" />
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I have a question about my prescription refill..."
                  rows={6}
                  className={cn(InputStyle, "pl-10 h-32 resize-none")}
                  required
                />
              </div>
            </div>

            {/* Status Message */}
            {status && (
              <p className={cn(
                "p-3 rounded-lg font-medium",
                status.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              )}>
                {status}
              </p>
            )}

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button type="submit" className={SubmitButtonStyle} disabled={status.includes('Sending')}>
                <Send size={20} />
                {status.includes('Sending') ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

function ContactInfoItem({ icon: Icon, title, value, link }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        {link ? (
          <a href={link} className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">{value}</a>
        ) : (
          <p className="text-gray-600 text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}
