import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactFormData {
  name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
  recaptchaToken?: string;
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone_number: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Mutation for submitting contact form
  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      // const response = await api.post('/contacts', data);
      const response = await fetch( `${import.meta.env.VITE_BASE_URL || "http://localhost:4000"}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      return response.json();
    },
    onSuccess: () => {
      setFormStatus('success');
      toast.success('Message sent successfully! We\'ll contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormStatus('');
      }, 5000);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send message. Please try again.');
      console.error('Contact form error:', error);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone_number || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation (basic)
    if (formData.phone_number.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const token = await recaptchaRef.current?.getValue();

    // Submit form
    contactMutation.mutate({ ...formData, recaptchaToken: token || "" });
    recaptchaRef.current?.reset();
  };

  const contactInfo = [
    {
      icon: "📞",
      title: "Phone",
      value: "+91 98765 43210",
      link: "tel:+919876543210"
    },
    {
      icon: "💬",
      title: "WhatsApp",
      value: "+91 98765 43210",
      link: "https://wa.me/919876543210"
    },
    {
      icon: "✉️",
      title: "Email",
      value: "info@sikkimtourism.com",
      link: "mailto:info@sikkimtourism.com"
    },
    {
      icon: "📍",
      title: "Address",
      value: "Tourism Office, Gangtok, Sikkim 737101",
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-6 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            Get In Touch
          </span>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Plan Your Sikkim Adventure
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about your trip? We're here to help you create unforgettable memories
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Travel Image & Contact Info */}
          <div className="space-y-8">
            {/* Travel Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] group">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                alt="Sikkim Mountain Landscape"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-8">
                <div>
                  <h3 className="text-white text-3xl font-bold mb-2">
                    Your Journey Begins Here
                  </h3>
                  <p className="text-white/90 text-lg">
                    Let us guide you through the Himalayas
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className="text-4xl mb-3">{info.icon}</div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-1">
                    {info.title}
                  </h4>
                  {info.link ? (
                    <a
                      href={info.link}
                      target={info.link.startsWith('http') ? '_blank' : undefined}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-gray-900 font-semibold hover:text-purple-600 transition-colors break-all"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-semibold">
                      {info.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Connect Buttons */}
            <div className="rounded-2xl p-8 text-white shadow-xl"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}>
              <h3 className="text-2xl font-bold mb-4">Quick Connect</h3>
              <p className="mb-6 text-white/90">
                Reach out instantly through your preferred channel
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">💬</span>
                  WhatsApp
                </a>
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">📞</span>
                  Call Now
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you within 24 hours
            </p>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center gap-3">
                <span className="text-2xl">✓</span>
                <span className="font-semibold">Message sent successfully! We'll contact you soon.</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={contactMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={contactMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={contactMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="+91 12345 67890"
                />
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={contactMutation.isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a subject</option>
                  <option value="Tour Package Inquiry">Tour Package Inquiry</option>
                  <option value="Booking Information">Booking Information</option>
                  <option value="Custom Trip Planning">Custom Trip Planning</option>
                  <option value="Travel Tips & Advice">Travel Tips & Advice</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={contactMutation.isPending}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Tell us about your travel plans, questions, or requirements..."
                ></textarea>
              </div>

              <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onLoad={() => {
                console.log("✅ reCAPTCHA loaded successfully");
                // setRecaptchaLoaded(true);
              }}
              onError={(error) => {
                console.error("❌ reCAPTCHA load error:", error);
                toast.error("Failed to load reCAPTCHA");
              }}
            />

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={contactMutation.isPending}
                className="w-full text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%)' }}
              >
                {contactMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </div>

            {/* Bottom Note */}
            <p className="text-center text-sm text-gray-500 mt-6">
              We respect your privacy and will never share your information
            </p>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Working Hours
              </h3>
              <p className="text-gray-600">
                Monday - Saturday<br />
                9:00 AM - 6:00 PM
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Quick Response
              </h3>
              <p className="text-gray-600">
                We typically respond<br />
                within 2-4 hours
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">🌍</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Expert Guidance
              </h3>
              <p className="text-gray-600">
                Local experts ready<br />
                to assist you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;