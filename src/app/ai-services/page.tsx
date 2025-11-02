'use client';

import React, { Suspense } from 'react';
import { Sidebar } from "@/components/Sidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AIServicesContent } from "./AIServicesContent";

export default function AIServicesPage() {
  return (
    <ProtectedRoute>
      <div className="bg-[#f6f6f6] min-h-screen">
        <div className="flex relative">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9747FF]"></div>
            </div>
          }>
            <AIServicesContent />
          </Suspense>
        </div>
      </div>
    </ProtectedRoute>
  );
}
