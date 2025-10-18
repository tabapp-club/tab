"use client";

import { BlogCards } from "@/components/BlogCards";

export function BlogsSection() {
  return (
    <section className="mb-6 sm:mb-8 lg:mb-12 rounded-[4px] bg-[#ffffff] box-border overflow-hidden relative -mt-2 sm:-mt-3 lg:-mt-4">
      {/* Brand Gradient Border */}
      <div className="absolute inset-0 rounded-[4px] bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] via-[#E9D5FF] to-[#A78BFA] p-[1px] animate-gradient-x">
        <div className="w-full h-full rounded-[3px] bg-[#ffffff]"></div>
      </div>
      <div className="relative z-10 p-3 sm:p-4 lg:p-6 lg:pl-[35px]">
        <h2 className="text-sm sm:text-[16px] font-semibold text-[#696969] leading-[1.4] sm:leading-[22.4px] tracking-[-0.1px] mb-3 sm:mb-4 lg:mb-[17px]">
          Blogs and news around your dental business
        </h2>
        <div className="w-full max-w-full overflow-hidden">
          <BlogCards />
        </div>
      </div>
    </section>
  );
}