"use client";

import { BusinessGrowthCards } from "@/components/BusinessGrowthCards";

export function BusinessGrowthSection() {
  return (
    <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[8px] bg-[#ffffff] border border-gray-200 overflow-hidden relative">
      <div className="p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
        <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
          How to boost business growth
        </h2>
        <div className="w-full max-w-full">
          <BusinessGrowthCards />
        </div>
      </div>
    </section>
  );
}
