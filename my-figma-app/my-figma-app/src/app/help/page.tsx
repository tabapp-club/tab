'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BaseLayout } from '@/components/login/BaseLayout';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do I log in to my account?",
    answer: "Enter your registered phone number and we'll send you a 6-digit OTP. Enter the OTP to access your dashboard."
  },
  {
    id: 2,
    question: "I didn't receive the OTP, what should I do?",
    answer: "Wait for 30 seconds and click 'Resend OTP'. Make sure your phone number is correct and check your SMS messages."
  },
  {
    id: 3,
    question: "What phone numbers are supported?",
    answer: "We support Indian mobile numbers starting with 6, 7, 8, or 9. International numbers are not currently supported."
  },
  {
    id: 4,
    question: "How long is my session valid?",
    answer: "Your session remains active until you log out or clear your browser data. For security, we recommend logging out when using shared devices."
  },
  {
    id: 5,
    question: "Can I change my registered phone number?",
    answer: "Yes, you can update your phone number from your profile settings after logging in to your dashboard."
  },
  {
    id: 6,
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption and security measures to protect your data. Your information is never shared with third parties."
  }
];

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const helpIllustration = (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative w-80 h-80">
        <div className="w-full h-full bg-gradient-to-br from-blue-200 via-indigo-200 to-purple-200 rounded-full flex items-center justify-center">
          <div className="text-6xl">🤔</div>
        </div>
        <div className="absolute top-16 right-8 w-16 h-16 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">💡</span>
        </div>
        <div className="absolute bottom-16 left-8 w-14 h-14 bg-green-300 rounded-lg flex items-center justify-center shadow-lg rotate-12">
          <span className="text-2xl">❓</span>
        </div>
      </div>
    </div>
  );

  return (
    <BaseLayout illustration={helpIllustration} showHelpButtons={false}>
      <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] space-y-3">
        {/* Header */}
        <div className="text-center space-y-1 flex-shrink-0">
          <h1 className="text-lg sm:text-xl font-bold text-[#2a2a2f] font-['Manrope']">Need Help?</h1>
          <p className="text-[#a1a1a1] text-xs font-['Manrope']">Find answers to common questions</p>
        </div>

        {/* FAQ Section - Scrollable */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {faqData.slice(0, 4).map((faq) => (
            <div key={faq.id} className="border border-[#e9e9e9] rounded overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full text-left px-3 py-2 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span className="text-xs font-medium text-[#2a2a2f] font-['Manrope'] pr-2 leading-tight">
                  {faq.question}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transition-transform duration-200 flex-shrink-0 ${
                    openFAQ === faq.id ? 'rotate-180' : ''
                  }`}
                >
                  <path
                    d="M12 6L8 10L4 6"
                    stroke="#2a2a2f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {openFAQ === faq.id && (
                <div className="px-3 py-2 bg-gray-50 border-t border-[#e9e9e9]">
                  <p className="text-xs text-[#626266] leading-tight font-['Manrope']">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex-shrink-0 space-y-2">
          {/* Contact Support */}
          <div className="bg-[#f5f4ed] rounded p-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm">📞</span>
              <div className="text-left">
                <h3 className="text-xs font-semibold text-[#2a2a2f] font-['Manrope']">
                  Still need help?
                </h3>
                <Link
                  href="/contact"
                  className="text-xs text-[#7856ff] hover:text-[#6545dd] font-medium font-['Manrope']"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>

          {/* Back to Login */}
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
