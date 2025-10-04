'use client';

import React from 'react';
import { useBusiness } from '@/contexts/BusinessContext';
import { BusinessFeatures } from '@/lib/api/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface FeatureGuardProps {
  feature: keyof BusinessFeatures;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function FeatureGuard({
  feature,
  children,
  fallback,
  redirectTo = '/dashboard'
}: FeatureGuardProps) {
  const { hasFeature, isLoading } = useBusiness();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasFeature(feature)) {
      if (redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [hasFeature, feature, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6E4EFF]"></div>
      </div>
    );
  }

  if (!hasFeature(feature)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Available</h1>
          <p className="text-gray-600 mb-6">
            This feature is not enabled for your business. Please contact support to enable this feature.
          </p>
          <button
            onClick={() => router.push(redirectTo)}
            className="bg-[#6E4EFF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5D3EE8] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook for checking feature access
export function useFeatureGuard(feature: keyof BusinessFeatures) {
  const { hasFeature, isLoading } = useBusiness();

  return {
    hasAccess: hasFeature(feature),
    isLoading,
    canAccess: !isLoading && hasFeature(feature)
  };
}
