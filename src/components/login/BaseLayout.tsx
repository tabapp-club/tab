'use client';

import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  illustration: React.ReactNode;
  showHelpButtons?: boolean;
}

export function BaseLayout({ children, illustration, showHelpButtons = true }: BaseLayoutProps) {
  return (
    <div className="bg-white relative w-screen h-screen overflow-hidden">
      {/* Background Shadow Elements */}
      <div className="absolute w-[93%] h-[87%] left-[3.4%] top-[6.3%] bg-white shadow-2xl">
        <div className="absolute inset-0 border border-[#2a2a2f] border-opacity-20" />
      </div>

      {/* Left Side - Illustration */}
      <div className="absolute w-[60%] h-[80%] left-[5%] top-[10%] flex items-center justify-center">
        {illustration}
      </div>

      {/* Right Side - Content */}
      <div className="absolute w-[30%] h-[80%] right-[5%] top-[10%] flex flex-col items-center justify-center px-6">
        {children}
      </div>

      {/* Help Buttons - Bottom Right */}
      {showHelpButtons && (
        <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
          <button className="w-12 h-12 bg-[#7856ff] rounded-full flex items-center justify-center shadow-lg hover:bg-[#6545dd] transition-colors">
            <span className="text-white text-lg">?</span>
          </button>
          <button className="w-12 h-12 bg-[#2a2a2f] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
            <span className="text-white text-lg">💬</span>
          </button>
        </div>
      )}
    </div>
  );
}
