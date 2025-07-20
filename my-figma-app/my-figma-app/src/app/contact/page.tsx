'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BaseLayout } from '@/components/login/BaseLayout';

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsSubmitting(false);
  };

  const contactIllustration = (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80">
        <div className="w-full h-full bg-gradient-to-br from-green-200 via-emerald-200 to-teal-200 rounded-full flex items-center justify-center">
          <div className="text-6xl">📞</div>
        </div>
        <div className="absolute top-12 right-12 w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">💬</span>
        </div>
        <div className="absolute bottom-12 left-12 w-14 h-14 bg-orange-300 rounded-lg flex items-center justify-center shadow-lg -rotate-12">
          <span className="text-2xl">✉️</span>
        </div>
        <div className="absolute top-1/2 left-0 w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl">🤝</span>
        </div>
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <BaseLayout illustration={contactIllustration} showHelpButtons={false}>
        <div className="flex flex-col justify-center h-full max-h-[calc(100vh-12rem)] space-y-4 text-center">
          <div className="text-3xl">✅</div>
          <div>
            <h1 className="text-lg font-bold text-[#2a2a2f] mb-2 font-['Manrope']">Thank You!</h1>
            <p className="text-[#a1a1a1] text-xs mb-4 font-['Manrope'] px-2">
              We have received your message and will get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-2">
            <Link
              href="/login"
              className="block bg-[#7856ff] text-white px-4 py-2 rounded font-medium hover:bg-[#6545dd] transition-colors text-xs font-['Manrope']"
            >
              Back to Login
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', company: '', message: '' });
              }}
              className="block w-full text-[#7856ff] hover:text-[#6545dd] transition-colors text-xs font-medium font-['Manrope']"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout illustration={contactIllustration} showHelpButtons={false}>
      <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] space-y-3">
        {/* Header */}
        <div className="text-center space-y-1 flex-shrink-0">
          <h1 className="text-lg font-bold text-[#2a2a2f] font-['Manrope']">Contact Tab Sales</h1>
          <p className="text-[#a1a1a1] text-xs font-['Manrope']">Get in touch with our sales team</p>
        </div>

        {/* Quick Contact Info */}
        <div className="bg-[#f5f4ed] rounded p-2 flex-shrink-0">
          <div className="flex items-center justify-around text-center">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-[#7856ff] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📧</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[#2a2a2f] font-['Manrope']">sales@tab.business</div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-[#7856ff] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📱</span>
              </div>
              <div>
                <div className="text-xs font-medium text-[#2a2a2f] font-['Manrope']">+91 9876 543 210</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full h-8 px-2 py-1 border border-[#e9e9e9] rounded text-xs text-[#2a2a2f] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-transparent font-['Manrope']"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full h-8 px-2 py-1 border border-[#e9e9e9] rounded text-xs text-[#2a2a2f] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-transparent font-['Manrope']"
              required
            />
          </div>

          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Company Name"
            className="w-full h-8 px-2 py-1 border border-[#e9e9e9] rounded text-xs text-[#2a2a2f] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-transparent font-['Manrope']"
            required
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="How can we help you?"
            rows={2}
            className="w-full px-2 py-1 border border-[#e9e9e9] rounded text-xs text-[#2a2a2f] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#7856ff] focus:border-transparent resize-none font-['Manrope'] flex-1"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-8 rounded font-semibold text-xs transition-all duration-200 font-['Manrope'] ${
              isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#2a2a2f] text-white hover:bg-gray-800 active:bg-gray-900'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                <span className="text-xs">Sending...</span>
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

        {/* Bottom Links */}
        <div className="flex-shrink-0 space-y-1">
          <div className="text-center text-xs text-[#626266] font-['Manrope']">
            Need immediate assistance?{' '}
            <Link href="/help" className="text-[#7856ff] hover:text-[#6545dd] font-medium">
              Check FAQ
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-[#7856ff] hover:text-[#6545dd] transition-colors text-xs font-medium font-['Manrope']"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
