'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', height = 'h-4', width = 'w-full' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${height} ${width} ${className}`} />
);

export const DataTableSkeleton: React.FC = () => {
  return (
    <div className="lg:bg-white overflow-hidden">
      {/* Mobile Skeleton */}
      <div className="lg:hidden">
        <div className="space-y-3 p-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white border border-[#e9e9e9] rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <Skeleton height="h-4" width="w-24" className="mb-2" />
                  <Skeleton height="h-3" width="w-32" />
                </div>
                <Skeleton height="h-6" width="w-16" className="rounded" />
              </div>
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton height="h-6" width="w-20" className="rounded" />
                  <Skeleton height="h-6" width="w-16" className="rounded" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Skeleton height="h-3" width="w-20" />
                <Skeleton height="h-3" width="w-16" />
                <Skeleton height="h-3" width="w-24" className="col-span-2" />
              </div>
              <div className="mt-3 pt-3 border-t border-[#f3f4f6]">
                <Skeleton height="h-4" width="w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:block overflow-x-auto scrollbar-hide">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] border-b border-[#e9e9e9] flex min-w-max">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-32 flex items-center px-4 h-10 border-r border-[#e9e9e9]">
                <Skeleton height="h-4" width="w-20" />
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div>
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex border-b border-[#e9e9e9] min-w-max">
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <div key={colIndex} className="w-32 flex items-center px-4 h-[66px] border-r border-[#e9e9e9]">
                    {colIndex === 2 ? (
                      <div className="flex flex-wrap gap-1.5">
                        <Skeleton height="h-6" width="w-16" className="rounded" />
                        <Skeleton height="h-6" width="w-12" className="rounded" />
                      </div>
                    ) : colIndex === 5 ? (
                      <Skeleton height="h-6" width="w-16" className="rounded" />
                    ) : colIndex === 7 ? (
                      <Skeleton height="h-6" width="w-6" className="rounded" />
                    ) : (
                      <Skeleton height="h-4" width="w-20" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableSkeleton;
