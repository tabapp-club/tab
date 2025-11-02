'use client';

import { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTitle
} from "@/components/ui/sheet";

export interface SidepaneSection {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
}

interface SidepaneProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  headerContent?: ReactNode;
  sections: SidepaneSection[];
  footerContent?: ReactNode;
  className?: string;
}

export function Sidepane({ 
  isOpen, 
  onClose, 
  title, 
  headerContent,
  sections, 
  footerContent,
  className = ''
}: SidepaneProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent
        side="right"
        className={`w-full max-w-full sm:w-[480px] sm:max-w-xl md:w-[600px] md:max-w-2xl lg:w-1/2 lg:max-w-none p-0 [&>button]:hidden bg-[#f6f6f6] flex flex-col h-full max-h-screen ${className}`}
      >
        <SheetTitle className="sr-only">{title}</SheetTitle>
        <div className="flex flex-col h-full min-h-0">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#2a2a2f]">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close sidepane"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {headerContent && (
              <div className="mt-4">
                {headerContent}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-0 overflow-y-auto p-6">
            <div className="space-y-5">
              {sections.map((section) => (
                <div key={section.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      {section.icon}
                    </div>
                    <h3 className="font-bold text-[#2a2a2f]">{section.title}</h3>
                  </div>
                  {section.content}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          {footerContent && (
            <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-100 bg-white">
              {footerContent}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

