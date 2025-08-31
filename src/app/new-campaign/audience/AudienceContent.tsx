"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

// Icons for the stepper
const CampaignIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.0996 13.0009H19.0996C18.8163 13.0009 18.5789 12.9049 18.3876 12.7129C18.1963 12.5209 18.1003 12.2836 18.0996 12.0009C18.0989 11.7182 18.1949 11.4809 18.3876 11.2889C18.5803 11.0969 18.8176 11.0009 19.0996 11.0009H21.0996C21.3829 11.0009 21.6206 11.0969 21.8126 11.2889C22.0046 11.4809 22.1003 11.7182 22.0996 12.0009C22.0989 12.2836 22.0029 12.5212 21.8116 12.7139C21.6203 12.9066 21.3829 13.0022 21.0996 13.0009ZM16.6996 16.8009C16.8663 16.5676 17.0829 16.4342 17.3496 16.4009C17.6163 16.3676 17.8663 16.4342 18.0996 16.6009L19.6996 17.8009C19.9329 17.9676 20.0663 18.1842 20.0996 18.4509C20.1329 18.7176 20.0663 18.9676 19.8996 19.2009C19.7329 19.4342 19.5163 19.5676 19.2496 19.6009C18.9829 19.6342 18.7329 19.5676 18.4996 19.4009L16.8996 18.2009C16.6663 18.0342 16.5329 17.8176 16.4996 17.5509C16.4663 17.2842 16.5329 17.0342 16.6996 16.8009ZM19.6996 6.20091L18.0996 7.40091C17.8663 7.56758 17.6163 7.63424 17.3496 7.60091C17.0829 7.56758 16.8663 7.43424 16.6996 7.20091C16.5329 6.96758 16.4663 6.71758 16.4996 6.45091C16.5329 6.18424 16.6663 5.96758 16.8996 5.80091L18.4996 4.60091C18.7329 4.43424 18.9829 4.36758 19.2496 4.40091C19.5163 4.43424 19.7329 4.56758 19.8996 4.80091C20.0663 5.03424 20.1329 5.28424 20.0996 5.55091C20.0663 5.81758 19.9329 6.03424 19.6996 6.20091ZM5.09961 15.0009H4.09961C3.54961 15.0009 3.07894 14.8052 2.68761 14.4139C2.29628 14.0226 2.10028 13.5516 2.09961 13.0009V11.0009C2.09961 10.4509 2.29561 9.98024 2.68761 9.58891C3.07961 9.19758 3.55028 9.00158 4.09961 9.00091H8.09961L11.5746 6.90091C11.9079 6.70091 12.2456 6.70091 12.5876 6.90091C12.9296 7.10091 13.1003 7.39258 13.0996 7.77591V16.2259C13.0996 16.6092 12.9286 16.9009 12.5866 17.1009C12.2446 17.3009 11.9073 17.3009 11.5746 17.1009L8.09961 15.0009H7.09961V18.0009C7.09961 18.2842 7.00361 18.5219 6.81161 18.7139C6.61961 18.9059 6.38228 19.0016 6.09961 19.0009C5.81694 19.0002 5.57961 18.9042 5.38761 18.7129C5.19561 18.5216 5.09961 18.2842 5.09961 18.0009V15.0009ZM14.0996 15.3509V8.65091C14.5496 9.05091 14.9123 9.53858 15.1876 10.1139C15.4629 10.6892 15.6003 11.3182 15.5996 12.0009C15.5989 12.6836 15.4613 13.3129 15.1866 13.8889C14.9119 14.4649 14.5496 14.9522 14.0996 15.3509Z" fill="#04B440"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2002 4.5H10.2002C6.42896 4.5 4.54334 4.5 3.37177 5.67157C2.52823 6.51511 2.29204 7.72882 2.22591 9.75H22.1745C22.1083 7.72882 21.8722 6.51511 21.0286 5.67157C19.857 4.5 17.9714 4.5 14.2002 4.5Z" fill="currentColor"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.2002 20.5H10.2002C6.42896 20.5 4.54334 20.5 3.37177 19.3284C2.2002 18.1569 2.2002 16.2712 2.2002 12.5C2.2002 12.0581 2.2002 11.642 2.20208 11.25H22.1983C22.2002 11.642 22.2002 12.0581 22.2002 12.5C22.2002 16.2712 22.2002 18.1569 21.0286 19.3284C19.857 20.5 17.9714 20.5 14.2002 20.5ZM16.2449 12.75C16.6778 12.7499 17.0746 12.7499 17.3974 12.7933C17.7529 12.8411 18.1286 12.9535 18.4376 13.2626C18.7467 13.5716 18.8591 13.9473 18.9069 14.3028C18.9503 14.6256 18.9502 15.0224 18.9502 15.4553V15.5447C18.9502 15.9776 18.9503 16.3744 18.9069 16.6972C18.8591 17.0527 18.7467 17.4284 18.4376 17.7374C18.1286 18.0465 17.7529 18.1589 17.3974 18.2067C17.0746 18.2501 16.6778 18.2501 16.2449 18.25L16.2002 18.25L16.1555 18.25C15.7226 18.2501 15.3258 18.2501 15.003 18.2067C14.6475 18.1589 14.2718 18.0465 13.9628 17.7374C13.6537 17.4284 13.5413 17.0527 13.4935 16.6972C13.4501 16.3744 13.4501 15.9776 13.4502 15.5447L13.4502 15.5L13.4502 15.4553C13.4501 15.0224 13.4501 14.6256 13.4935 14.3028C13.5413 13.9473 13.6537 13.5716 13.9628 13.2626C14.2718 12.9535 14.6475 12.8411 15.003 12.7933C15.3258 12.7499 15.7226 12.7499 16.1554 12.75H16.2449ZM5.4502 14C5.4502 13.5858 5.78598 13.25 6.2002 13.25H8.2002C8.61441 13.25 8.9502 13.5858 8.9502 14C8.9502 14.4142 8.61441 14.75 8.2002 14.75H6.2002C5.78598 14.75 5.4502 14.4142 5.4502 14ZM5.4502 17C5.4502 16.5858 5.78598 16.25 6.2002 16.25H10.2002C10.6144 16.25 10.9502 16.5858 10.9502 17C10.9502 17.4142 10.6144 17.75 10.2002 17.75H6.2002C5.78598 17.75 5.4502 17.4142 5.4502 17Z" fill="currentColor"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M17.1201 3.90039C17.7777 3.89668 18.4265 4.05279 19.0098 4.35645C19.5931 4.66014 20.0937 5.10171 20.4678 5.64258C20.8418 6.18349 21.078 6.80795 21.1562 7.46094C21.2345 8.11396 21.1527 8.7766 20.917 9.39062C20.6813 10.0046 20.2987 10.5514 19.8037 10.9844C19.3086 11.4174 18.7151 11.7232 18.0752 11.875C17.4354 12.0266 16.7684 12.0199 16.1318 11.8555C15.4952 11.6909 14.9081 11.3734 14.4219 10.9307C15.1713 10.0159 15.6589 8.91479 15.833 7.74512C16.0071 6.57547 15.8607 5.38045 15.4102 4.28711C15.9442 4.03298 16.5287 3.90107 17.1201 3.90039ZM9.20801 1.75C12.0221 1.75012 14.3037 4.0124 14.3037 6.80273C14.3036 9.59294 12.0220 11.8544 9.20801 11.8545C6.39394 11.8545 4.11245 9.59302 4.11230 6.80273C4.11230 4.01233 6.39385 1.75 9.20801 1.75Z" fill="currentColor"/>
<path d="M9.20801 13.1445C13.3816 13.1447 16.7646 15.407 16.7646 18.1973C16.7643 20.9874 13.3814 23.2489 9.20801 23.249C5.03447 23.249 1.65071 20.9875 1.65039 18.1973C1.65039 15.4069 5.03427 13.1445 9.20801 13.1445ZM17.1191 13.0371C20.4516 13.0371 23.1504 14.9291 23.1504 17.0791C23.1502 19.2289 20.6349 20.9813 17.4746 21.0996C18.0516 20.2413 18.3614 19.2314 18.3662 18.1973C18.3235 17.1777 18.0224 16.1852 17.4902 15.3145C16.958 14.4437 16.2122 13.7227 15.3242 13.2197C15.9147 13.0977 16.5162 13.0366 17.1191 13.0371Z" fill="currentColor"/>
</svg>
);

const BagIcon = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_719_7542)">
<path fillRule="evenodd" clipRule="evenodd" d="M19.8329 14.3459C19.8329 18.5916 15.9858 20.5002 10.6 20.5002C5.21433 20.5002 1.36719 18.5916 1.36719 14.3759C1.36719 9.76018 3.67576 7.42161 8.29147 5.08304L6.65719 2.03875C6.55968 1.88627 6.50538 1.71019 6.50008 1.52927C6.49478 1.34836 6.53868 1.1694 6.62711 1.01147C6.71553 0.853546 6.84515 0.72258 7.00215 0.632536C7.15916 0.542492 7.33766 0.496748 7.51862 0.50018H14.0429C14.2125 0.50452 14.3782 0.551947 14.5245 0.637997C14.6707 0.724047 14.7926 0.84589 14.8788 0.99206C14.965 1.13823 15.0125 1.30392 15.017 1.47353C15.0214 1.64315 14.9827 1.81111 14.9043 1.96161L12.9086 5.08304C17.5229 7.39018 19.8329 9.72875 19.8329 14.3459ZM7.68147 9.78589H10.0858C10.2858 9.84589 10.5372 9.95732 10.7386 10.143C10.8894 10.2798 11.0008 10.4544 11.0615 10.6488H7.6829C7.5891 10.6488 7.49622 10.6672 7.40956 10.7031C7.3229 10.739 7.24415 10.7916 7.17782 10.858C7.1115 10.9243 7.05888 11.003 7.02299 11.0897C6.98709 11.1764 6.96862 11.2692 6.96862 11.363C6.96862 11.4568 6.98709 11.5497 7.02299 11.6364C7.05888 11.723 7.1115 11.8018 7.17782 11.8681C7.24415 11.9344 7.3229 11.9871 7.40956 12.023C7.49622 12.0588 7.5891 12.0773 7.6829 12.0773H10.8358C10.5903 12.35 10.2789 12.5552 9.93147 12.673C9.48365 12.8366 9.01234 12.9268 8.53576 12.9402H8.51433C8.36893 12.9403 8.22703 12.9848 8.10759 13.0677C7.98815 13.1507 7.89686 13.2681 7.84593 13.4042C7.79499 13.5404 7.78684 13.6889 7.82254 13.8299C7.85825 13.9708 7.93612 14.0975 8.04576 14.193L8.04862 14.1959L8.05576 14.2002L8.07433 14.2173C8.17571 14.3033 8.28006 14.3857 8.38719 14.4645C9.61907 15.3844 11.02 16.0528 12.51 16.4316C12.6018 16.4568 12.6978 16.4634 12.7921 16.4509C12.8865 16.4385 12.9775 16.4074 13.0596 16.3593C13.1418 16.3112 13.2135 16.2472 13.2706 16.171C13.3277 16.0948 13.3689 16.008 13.392 15.9157C13.415 15.8233 13.4194 15.7273 13.4048 15.6332C13.3902 15.5391 13.3569 15.4489 13.307 15.3679C13.257 15.2869 13.1914 15.2166 13.1139 15.1613C13.0364 15.106 12.9486 15.0668 12.8558 15.0459C11.9819 14.8217 11.1414 14.4836 10.3558 14.0402L10.4329 14.0116C10.9158 13.8302 11.4472 13.5416 11.8615 13.0745C12.1115 12.7959 12.3072 12.463 12.4286 12.0773H13.5172C13.7066 12.0773 13.8883 12.0021 14.0223 11.8681C14.1562 11.7342 14.2315 11.5525 14.2315 11.363C14.2315 11.1736 14.1562 10.9919 14.0223 10.858C13.8883 10.724 13.7066 10.6488 13.5172 10.6488H12.5258C12.4806 10.3473 12.385 10.0556 12.2429 9.78589H13.5172C13.7066 9.78589 13.8883 9.71064 14.0223 9.57668C14.1562 9.44273 14.2315 9.26105 14.2315 9.07161C14.2315 8.88217 14.1562 8.70049 14.0223 8.56653C13.8883 8.43258 13.7066 8.35732 13.5172 8.35732H7.6829C7.49346 8.35732 7.31178 8.43258 7.17782 8.56653C7.04387 8.70049 6.96862 8.88217 6.96862 9.07161C6.96862 9.26105 7.04387 9.44273 7.17782 9.57668C7.31178 9.71064 7.49346 9.78589 7.6829 9.78589H7.68147Z" fill="#A1A1A1"/>
</g>
<defs>
<clipPath id="clip0_719_7542">
<rect width="20" height="20" fill="white" transform="translate(0.599609 0.5)"/>
</clipPath>
</defs>
</svg>
);

const CalendarIcon = () => (
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.54991 3C8.54991 2.80109 8.47089 2.61032 8.33024 2.46967C8.18958 2.32902 7.99882 2.25 7.79991 2.25C7.60099 2.25 7.41023 2.32902 7.26958 2.46967C7.12892 2.61032 7.04991 2.80109 7.04991 3V4.58C5.60991 4.695 4.66591 4.977 3.97191 5.672C3.27691 6.366 2.99491 7.311 2.87891 8.75H22.7209C22.6049 7.31 22.3229 6.366 21.6279 5.672C20.9339 4.977 19.9889 4.695 18.5499 4.579V3C18.5499 2.80109 18.4709 2.61032 18.3302 2.46967C18.1896 2.32902 17.9988 2.25 17.7999 2.25C17.601 2.25 17.4102 2.32902 17.2696 2.46967C17.1289 2.61032 17.0499 2.80109 17.0499 3V4.513C16.3849 4.5 15.6389 4.5 14.7999 4.5H10.7999C9.96091 4.5 9.21491 4.5 8.54991 4.513V3Z" fill="#A1A1A1"/>
<path fillRule="evenodd" clipRule="evenodd" d="M2.7998 12.5C2.7998 11.661 2.7998 10.915 2.8128 10.25H22.7868C22.7998 10.915 22.7998 11.661 22.7998 12.5V14.5C22.7998 18.271 22.7998 20.157 21.6278 21.328C20.4558 22.499 18.5708 22.5 14.7998 22.5H10.7998C7.0288 22.5 5.1428 22.5 3.9718 21.328C2.8008 20.156 2.7998 18.271 2.7998 14.5V12.5ZM17.7998 14.5C18.065 14.5 18.3194 14.3946 18.5069 14.2071C18.6944 14.0196 18.7998 13.7652 18.7998 13.5C18.7998 13.2348 18.6944 12.9804 18.5069 12.7929C18.3194 12.6054 18.065 12.5 17.7998 12.5C17.5346 12.5 17.2802 12.6054 17.0927 12.7929C16.9052 12.9804 16.7998 13.2348 16.7998 13.5C16.7998 13.7652 16.9052 14.0196 17.0927 14.2071C17.2802 14.3946 17.5346 14.5 17.7998 14.5ZM17.7998 18.5C18.065 18.5 18.3194 18.3946 18.5069 18.2071C18.6944 18.0196 18.7998 17.7652 18.7998 17.5C18.7998 17.2348 18.6944 16.9804 18.5069 16.7929C18.3194 16.6054 18.065 16.5 17.7998 16.5C17.5346 16.5 17.2802 16.6054 17.0927 16.7929C16.9052 16.9804 16.7998 17.2348 16.7998 17.5C16.7998 17.7652 16.9052 18.0196 17.0927 18.2071C17.2802 18.3946 17.5346 18.5 17.7998 18.5ZM13.7998 13.5C13.7998 13.7652 13.6944 14.0196 13.5069 14.2071C13.3194 14.3946 13.065 14.5 12.7998 14.5C12.5346 14.5 12.2802 14.3946 12.0927 14.2071C11.9052 14.0196 11.7998 13.7652 11.7998 13.5C11.7998 13.2348 11.9052 12.9804 12.0927 12.7929C12.2802 12.6054 12.5346 12.5 12.7998 12.5C13.065 12.5 13.3194 12.6054 13.5069 12.7929C13.6944 12.9804 13.7998 13.2348 13.7998 13.5ZM13.7998 17.5C13.7998 17.7652 13.6944 18.0196 13.5069 18.2071C13.3194 18.3946 13.065 18.5 12.7998 18.5C12.5346 18.5 12.2802 18.3946 12.0927 18.2071C11.9052 18.0196 11.7998 17.7652 11.7998 17.5C11.7998 17.2348 11.9052 16.9804 12.0927 16.7929C12.2802 16.6054 12.5346 16.5 12.7998 16.5C13.065 16.5 13.3194 16.6054 13.5069 16.7929C13.6944 16.9804 13.7998 17.2348 13.7998 17.5ZM7.7998 14.5C8.06502 14.5 8.31938 14.3946 8.50691 14.2071C8.69445 14.0196 8.7998 13.7652 8.7998 13.5C8.7998 13.2348 8.69445 12.9804 8.50691 12.7929C8.31938 12.6054 8.06502 12.5 7.7998 12.5C7.53459 12.5 7.28023 12.6054 7.0927 12.7929C6.90516 12.9804 6.7998 13.2348 6.7998 13.5C6.7998 13.7652 6.90516 14.0196 7.0927 14.2071C7.28023 14.3946 7.53459 14.5 7.7998 14.5ZM7.7998 18.5C8.06502 18.5 8.31938 18.3946 8.50691 18.2071C8.69445 18.0196 8.7998 17.7652 8.7998 17.5C8.7998 17.2348 8.69445 16.9804 8.50691 16.7929C8.31938 16.6054 8.06502 16.5 7.7998 16.5C7.53459 16.5 7.28023 16.6054 7.0927 16.7929C6.90516 16.9804 6.7998 17.2348 6.7998 17.5C6.7998 17.7652 6.90516 14.0196 7.0927 14.2071C7.28023 14.3946 7.53459 14.5 7.7998 14.5Z" fill="#A1A1A1"/>
</svg>
);

// Stepper Component
const StepperStep = ({
  title,
  icon,
  isActive = false,
  isCompleted = false,
  isCurrent = false,
  stepIndex = 0,
  totalSteps = 5,
  timeEstimate = "",
  description = ""
}: {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
  stepIndex?: number;
  totalSteps?: number;
  timeEstimate?: string;
  description?: string;
}) => {
  const getStepStyles = () => {
    if (isCurrent) {
      return "bg-[rgba(120,86,255,0.1)] text-[#7856ff]";
    }
    if (isCompleted) {
      return "bg-[rgba(4,180,64,0.1)] text-[#04b440]";
    }
    return "bg-[rgba(161,161,161,0.1)] text-[#a1a1a1]";
  };

  const getSubTextColor = () => {
    if (isCurrent) {
      return "text-[#7856ff]/70";
    }
    if (isCompleted) {
      return "text-[#04b440]/70";
    }
    return "text-[#a1a1a1]/70";
  };

  return (
    <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-center justify-center min-h-px min-w-px p-[8px] relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-4 items-center justify-start p-0 relative shrink-0 w-full">
        <div className={`box-border content-stretch flex flex-col gap-2.5 items-center justify-center p-0 relative rounded-[20px] shrink-0 size-10 ${getStepStyles()}`}>
          <div className="relative shrink-0 size-6">
            {icon}
          </div>
        </div>
        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center p-0 relative self-stretch shrink-0">
          <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0">
          </div>
          {(timeEstimate || description) && (
            <div className={`flex flex-col items-center justify-center text-[12px] font-semibold leading-[14px] ${getSubTextColor()}`}>
              {description && (
                <span className="text-center">{description}</span>
        )}
        {timeEstimate && (
                <span className="text-center mt-1">⏱️ {timeEstimate}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const StepperProgressBar = ({ currentStep = 2, totalSteps = 5 }: { currentStep?: number; totalSteps?: number }) => {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);
  
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-md overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-[#7856ff] to-[#8B6AFF] transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
};

export function AudienceContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get('type') || 'advertise';
  const { user } = useAuth();

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  console.log('AudienceContent: Component rendering', { campaignType, user: !!user });

  // Simple audience selection state
  const [audienceType, setAudienceType] = useState<'all' | 'custom' | 'ai_inactive' | 'ai_vip' | 'ai_cart'>('all');

  // Custom filter state
  const [customFilters, setCustomFilters] = useState({
    customerType: [] as string[],
    customerStatus: [] as string[],
    numberOfVisits: {
      min: 0,
      max: 100
    },
    category: [] as string[],
    customerBehaviour: {
      purchaseHistory: [] as string[],
      engagementLevel: '' as string,
      visitFrequency: '' as string,
      lastActivity: '' as string,
      lifetimeValue: '' as string
    }
  });

  const [expandedFilters, setExpandedFilters] = useState<string[]>(['customerType']);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Fetch data from Data Centre structure
  const filterOptions = {
    customerType: [
      { id: 'retained', label: 'Retained', description: 'Long-term customers' },
      { id: 'new', label: 'New', description: 'Recently acquired customers' }
    ],
    customerStatus: [
      { id: 'active', label: 'Active', description: 'Currently engaged customers' },
      { id: 'inactive', label: 'Inactive', description: 'Not recently engaged' }
    ],

    numberOfVisits: {
      ranges: [
        { id: '1', label: '1 visit', min: 1, max: 1 },
        { id: '2-5', label: '2-5 visits', min: 2, max: 5 },
        { id: '6-10', label: '6-10 visits', min: 6, max: 10 },
        { id: '11-20', label: '11-20 visits', min: 11, max: 20 },
        { id: '21-50', label: '21-50 visits', min: 21, max: 50 },
        { id: '50+', label: '50+ visits', min: 51, max: 999 }
      ]
    },
    category: [
      { id: 'electronics', label: 'Electronics', description: 'Tech products' },
      { id: 'clothing', label: 'Clothing', description: 'Apparel and fashion' },
      { id: 'home_garden', label: 'Home & Garden', description: 'Home improvement' },
      { id: 'automotive', label: 'Automotive', description: 'Vehicle related' },
      { id: 'health_beauty', label: 'Health & Beauty', description: 'Wellness products' },
      { id: 'sports', label: 'Sports', description: 'Athletic equipment' },
      { id: 'books', label: 'Books', description: 'Literature and education' },
      { id: 'movies', label: 'Movies', description: 'Entertainment media' },
      { id: 'music', label: 'Music', description: 'Audio content' },
      { id: 'food_drink', label: 'Food & Drink', description: 'Culinary products' }
    ],
    customerBehaviour: {
      purchaseHistory: [
        { id: 'last_30_days', label: 'Last 30 days', description: 'Recent purchases' },
        { id: 'last_3_months', label: 'Last 3 months', description: 'Quarterly activity' },
        { id: 'last_6_months', label: 'Last 6 months', description: 'Semi-annual activity' },
        { id: 'last_year', label: 'Last year', description: 'Annual activity' },
        { id: 'more_than_year', label: 'More than 1 year', description: 'Historical activity' }
      ],
      engagementLevel: [
        { id: 'high', label: 'High', description: 'Very engaged customers' },
        { id: 'medium', label: 'Medium', description: 'Moderately engaged' },
        { id: 'low', label: 'Low', description: 'Minimally engaged' }
      ],
      visitFrequency: [
        { id: 'daily', label: 'Daily', description: 'Visit every day' },
        { id: 'weekly', label: 'Weekly', description: 'Visit weekly' },
        { id: 'monthly', label: 'Monthly', description: 'Visit monthly' },
        { id: 'quarterly', label: 'Quarterly', description: 'Visit quarterly' },
        { id: 'yearly', label: 'Yearly', description: 'Visit yearly' }
      ],
      lastActivity: [
        { id: 'today', label: 'Today', description: 'Active today' },
        { id: 'this_week', label: 'This week', description: 'Active this week' },
        { id: 'this_month', label: 'This month', description: 'Active this month' },
        { id: 'last_month', label: 'Last month', description: 'Active last month' },
        { id: 'older', label: 'Older', description: 'Not recently active' }
      ],
      lifetimeValue: [
        { id: 'high_value', label: 'High Value', description: '₹500+ total spent' },
        { id: 'medium_value', label: 'Medium Value', description: '₹100-₹500 spent' },
        { id: 'low_value', label: 'Low Value', description: 'Under ₹100 spent' },
        { id: 'new_customer', label: 'New Customer', description: 'No purchase history' }
      ]
    }
  };

  const updateFilter = (section: keyof typeof customFilters, key: string, value: any) => {
    setCustomFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateArrayFilter = (section: keyof typeof customFilters, value: string) => {
    setCustomFilters(prev => ({
      ...prev,
      [section]: Array.isArray(prev[section]) 
        ? prev[section].includes(value)
          ? prev[section].filter(item => item !== value)
          : [...prev[section], value]
        : prev[section]
    }));
  };

  const updateRangeFilter = (section: keyof typeof customFilters, key: string, value: number) => {
    setCustomFilters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const toggleFilter = (section: string) => {
    setExpandedFilters(prev =>
      prev.includes(section) ? [] : [section] // Only allow one accordion open at a time
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    
    // Count customerType
    count += customFilters.customerType.length;
    
    // Count customerStatus
    count += customFilters.customerStatus.length;
    
    // Count category
    count += customFilters.category.length;
    
    // Count customerBehaviour
    count += customFilters.customerBehaviour.purchaseHistory.length;
    if (customFilters.customerBehaviour.engagementLevel) count += 1;
    if (customFilters.customerBehaviour.visitFrequency) count += 1;
    if (customFilters.customerBehaviour.lastActivity) count += 1;
    if (customFilters.customerBehaviour.lifetimeValue) count += 1;
    
    // Count numberOfVisits if range is set
    if (customFilters.numberOfVisits.min > 0 || customFilters.numberOfVisits.max < 100) count += 1;
    
    return count;
  };

  // Get customer count for specific filter sections
  const getFilterSectionCount = (section: string) => {
    switch (section) {
      case 'customerType':
        return customFilters.customerType.length;
      case 'customerStatus':
        return customFilters.customerStatus.length;
      case 'numberOfVisits':
        return (customFilters.numberOfVisits.min > 0 || customFilters.numberOfVisits.max < 100) ? 1 : 0;
      case 'category':
        return customFilters.category.length;
      case 'customerBehaviour':
        let behaviourCount = 0;
        behaviourCount += customFilters.customerBehaviour.purchaseHistory.length;
        if (customFilters.customerBehaviour.engagementLevel) behaviourCount += 1;
        if (customFilters.customerBehaviour.visitFrequency) behaviourCount += 1;
        if (customFilters.customerBehaviour.lastActivity) behaviourCount += 1;
        if (customFilters.customerBehaviour.lifetimeValue) behaviourCount += 1;
        return behaviourCount;
      default:
        return 0;
    }
  };

  // Mock data for simplicity
  const totalUsers = 2847;
  
  // Calculate custom audience size based on filters
  const customAudienceSize = Math.max(1, Math.floor(totalUsers * (0.3 + Math.random() * 0.4)));

  // Stepper data
  const stepperSteps = [
    { title: 'Choose campaign type', icon: <CampaignIcon />, isCompleted: true, timeEstimate: "2-3 min", description: "Choose campaign type" },
    { title: 'Choose audience', icon: <UsersIcon />, isCurrent: true, timeEstimate: "3-5 min", description: "Select target users" },
    { title: 'Platform & Budget', icon: <BagIcon />, isCompleted: false, timeEstimate: "2-4 min", description: "Set budget & platforms" },
    { title: 'Design your campaign', icon: <MoneyIcon />, isCompleted: false, timeEstimate: "5-8 min", description: "Design your campaign" },
    { title: 'Schedule', icon: <CalendarIcon />, isCompleted: false, timeEstimate: "1-2 min", description: "Schedule" }
  ];

  const handleProceed = () => {
    const audienceData = {
      type: audienceType,
      totalUsers: audienceType === 'all' ? totalUsers : 0
    };
    sessionStorage.setItem('campaignAudience', JSON.stringify(audienceData));
    router.push(`/new-campaign/platform-budget?type=${campaignType}`);
    };

  return (
    <main className={`flex-1 transition-sidebar ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full px-4 py-4 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32 bg-[#f6f6f6]">
        {/* Progress Indicator - Stepper */}
        <section className="mb-8 bg-white border border-[#e9e9e9] rounded-md p-2 overflow-x-auto relative">
          <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative rounded-md size-full">
            {stepperSteps.map((step, index) => (
              <StepperStep
                key={index}
                title={step.title}
                icon={step.icon}
                isCompleted={step.isCompleted}
                isCurrent={step.isCurrent}
                stepIndex={index + 1}
                totalSteps={5}
                timeEstimate={step.timeEstimate}
                description={step.description}
              />
            ))}
          </div>
          <StepperProgressBar currentStep={2} totalSteps={5} />
        </section>

        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-[#2a2a2f] text-[20px] font-bold tracking-[-0.1px] leading-[1.4]">
                  Choose Your Audience
                </h1>
          <p className="text-[#a1a1a1] text-[14px] mt-0.5">
            Select your target audience to maximize campaign impact
          </p>
        </div>

        {/* Audience Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
          {/* All Customers Card */}
          <div 
            className={`bg-white border rounded-lg p-4 cursor-pointer ${
              audienceType === 'all' 
                ? 'border-[#6E4EFF]' 
                : 'border-[#e9e9e9]'
            }`}
            onClick={() => setAudienceType('all')}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[16px] font-bold text-[#2a2a2f]">All Customers</h3>
              <div className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                audienceType === 'all' ? 'bg-[#7856ff] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {totalUsers.toLocaleString()} customers
              </div>
            </div>
            <p className="text-[14px] text-[#626266] leading-relaxed mb-3">
              Reach your entire customer base with maximum coverage and comprehensive impact across all segments.
            </p>
                  
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">2,420</div>
                <div className="text-[11px] text-[#626266]">Est. Reach</div>
              </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">85%</div>
                <div className="text-[11px] text-[#626266]">Coverage</div>
            </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">4.2x</div>
                <div className="text-[11px] text-[#626266]">Est. ROI</div>
          </div>
                </div>
              </div>

          {/* Custom Customers Card */}
          <div 
            className={`bg-white border rounded-lg p-4 cursor-pointer ${
              audienceType === 'custom' 
                ? 'border-[#6E4EFF]' 
                : 'border-[#e9e9e9]'
            }`}
            onClick={() => setAudienceType('custom')}
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[16px] font-bold text-[#2a2a2f]">Custom Customers</h3>
              <div className={`px-3 py-1 rounded-full text-[12px] font-medium ${
                audienceType === 'custom' ? 'bg-[#7856ff] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                Custom size
              </div>
            </div>
            <p className="text-[14px] text-[#626266] leading-relaxed mb-3">
              Create targeted audiences using advanced filters for precise campaign targeting and higher engagement rates.
            </p>
                  
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">Variable</div>
                <div className="text-[11px] text-[#626266]">Est. Reach</div>
                    </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">95%</div>
                <div className="text-[11px] text-[#626266]">Coverage</div>
                    </div>
                    <div className="text-center">
                <div className="text-[14px] font-semibold text-[#2a2a2f]">6.8x</div>
                <div className="text-[11px] text-[#626266]">Est. ROI</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {audienceType === 'all' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="text-[14px] font-semibold text-blue-800 mb-2">All Customers Campaign</h4>
            <p className="text-[12px] text-blue-700">
              You're targeting all {totalUsers.toLocaleString()} customers in your database. This provides maximum reach and is perfect for general announcements, promotions, or brand awareness campaigns.
            </p>
          </div>
        )}

        {audienceType === 'custom' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h4 className="text-[14px] font-semibold text-purple-800 mb-2">Custom Audience Campaign</h4>
            <p className="text-[12px] text-purple-700">
              You can create a custom audience using filters in the next step. This allows for more precise targeting and typically results in higher engagement rates.
            </p>
          </div>
        )}

        {/* Custom Filter Interface */}
        {audienceType === 'custom' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Filters Panel - Left Side */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#e9e9e9] rounded-lg p-4">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#2a2a2f]">Audience Filters</h3>
                    <p className="text-[#a1a1a1] text-[14px] mt-0.5">Define your target audience using advanced filters for precise campaign targeting</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-[#626266]">{getActiveFiltersCount()} filters active</span>
                <button
                      onClick={() => setCustomFilters({
                        customerType: [],
                        customerStatus: [],
                        numberOfVisits: { min: 0, max: 100 },
                        category: [],
                        customerBehaviour: {
                          purchaseHistory: [],
                          engagementLevel: '',
                          visitFrequency: '',
                          lastActivity: '',
                          lifetimeValue: ''
                        }
                      })}
                      className="text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {/* Customer Type Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('customerType')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#7856ff]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#7856ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Customer Type</h4>
                          {getFilterSectionCount('customerType') > 0 && (
                            <span className="px-2 py-0.5 bg-[#7856ff] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('customerType')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Retained, new, returning customers</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('customerType') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedFilters.includes('customerType') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {filterOptions.customerType.map(type => (
                          <label key={type.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div className="relative mt-0.5">
                              <CustomCheckbox
                                checked={customFilters.customerType.includes(type.id)}
                                onChange={() => updateArrayFilter('customerType', type.id)}
                              />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{type.label}</div>
                                <div className="text-[11px] text-[#626266]">{type.description}</div>
                              </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {type.id === 'retained' ? '1,847' : '1,000'} customers
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Status Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('customerStatus')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#04b440]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#04b440]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Customer Status</h4>
                          {getFilterSectionCount('customerStatus') > 0 && (
                            <span className="px-2 py-0.5 bg-[#04b440] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('customerStatus')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Active, inactive, suspended</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('customerStatus') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                  
                  {expandedFilters.includes('customerStatus') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {filterOptions.customerStatus.map(status => (
                          <label key={status.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div className="relative mt-0.5">
                              <CustomCheckbox
                                checked={customFilters.customerStatus.includes(status.id)}
                                onChange={() => updateArrayFilter('customerStatus', status.id)}
                              />
              </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{status.label}</div>
                                <div className="text-[11px] text-[#626266]">{status.description}</div>
                              </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {status.id === 'active' ? '2,420' : '427'} customers
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
            </div>



                {/* Number of Visits Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('numberOfVisits')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#ffd700]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#ffd700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Number of Visits</h4>
                          {getFilterSectionCount('numberOfVisits') > 0 && (
                            <span className="px-2 py-0.5 bg-[#ffd700] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('numberOfVisits')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Visit frequency ranges</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('numberOfVisits') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedFilters.includes('numberOfVisits') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-2">
                        {filterOptions.numberOfVisits.ranges.map(range => (
                          <label key={range.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <input
                              type="radio"
                              name="numberOfVisits"
                              checked={customFilters.numberOfVisits.min === range.min && customFilters.numberOfVisits.max === range.max}
                              onChange={() => {
                                updateRangeFilter('numberOfVisits', 'min', range.min);
                                updateRangeFilter('numberOfVisits', 'max', range.max);
                              }}
                              className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                            />
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{range.label}</div>
            </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {range.id === '1' ? '427' : 
                                 range.id === '2-5' ? '1,284' :
                                 range.id === '6-10' ? '856' :
                                 range.id === '11-20' ? '171' :
                                 range.id === '21-50' ? '85' : '28'} customers
                              </span>
          </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('category')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#9c27b0]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#9c27b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Category</h4>
                          {getFilterSectionCount('category') > 0 && (
                            <span className="px-2 py-0.5 bg-[#9c27b0] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('category')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Product categories</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('category') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedFilters.includes('category') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {filterOptions.category.map(cat => (
                          <label key={cat.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                            <div className="relative mt-0.5">
                              <CustomCheckbox
                                checked={customFilters.category.includes(cat.id)}
                                onChange={() => updateArrayFilter('category', cat.id)}
                              />
                            </div>
                            <div className="flex-1 flex items-center justify-between">
                              <div>
                                <div className="text-[13px] font-medium text-[#2a2a2f]">{cat.label}</div>
                                <div className="text-[11px] text-[#626266]">{cat.description}</div>
                              </div>
                              <span className="text-[11px] text-[#626266] font-medium">
                                {cat.id === 'electronics' ? '856' :
                                 cat.id === 'clothing' ? '1,284' :
                                 cat.id === 'home_garden' ? '427' :
                                 cat.id === 'automotive' ? '285' :
                                 cat.id === 'health_beauty' ? '571' :
                                 cat.id === 'sports' ? '342' :
                                 cat.id === 'books' ? '213' :
                                 cat.id === 'movies' ? '156' :
                                 cat.id === 'music' ? '98' : '85'} customers
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
            )}
          </div>

                {/* Customer Behaviour Filter */}
                <div className="mb-4">
                  <button
                    onClick={() => toggleFilter('customerBehaviour')}
                    className="w-full flex items-center justify-between p-3 bg-white border border-[#e9e9e9] rounded hover:bg-gray-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#2196f3]/10 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#2196f3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f]">Customer Behaviour</h4>
                          {getFilterSectionCount('customerBehaviour') > 0 && (
                            <span className="px-2 py-0.5 bg-[#2196f3] text-white text-[10px] font-medium rounded-full">
                              {getFilterSectionCount('customerBehaviour')}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#626266]">Purchase history, engagement, activity</p>
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-[#626266] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${expandedFilters.includes('customerBehaviour') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                                    {expandedFilters.includes('customerBehaviour') && (
                    <div className="mt-3 p-3 bg-white border border-[#e9e9e9] rounded transition-all duration-800 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top scale-100 opacity-100 animate-in slide-in-from-top-2">
                      <div className="space-y-6">
                        {/* Purchase History */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-2">Purchase History</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filterOptions.customerBehaviour.purchaseHistory.map(history => (
                              <label key={history.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <div className="relative mt-0.5">
                                  <CustomCheckbox
                                    checked={customFilters.customerBehaviour.purchaseHistory.includes(history.id)}
                                    onChange={() => {
                                      const newHistory = customFilters.customerBehaviour.purchaseHistory.includes(history.id)
                                        ? customFilters.customerBehaviour.purchaseHistory.filter(h => h !== history.id)
                                        : [...customFilters.customerBehaviour.purchaseHistory, history.id];
                                      updateFilter('customerBehaviour', 'purchaseHistory', newHistory);
                                    }}
                                  />
                                </div>
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{history.label}</div>
                                    <div className="text-[10px] text-[#626266]">{history.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {history.id === 'last_30_days' ? '1,284' :
                                     history.id === 'last_3_months' ? '1,847' :
                                     history.id === 'last_6_months' ? '2,284' :
                                     history.id === 'last_year' ? '2,847' : '1,000'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Engagement Level */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-2">Engagement Level</h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {filterOptions.customerBehaviour.engagementLevel.map(level => (
                              <label key={level.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="engagementLevel"
                                  checked={customFilters.customerBehaviour.engagementLevel === level.id}
                                  onChange={() => updateFilter('customerBehaviour', 'engagementLevel', level.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{level.label}</div>
                                    <div className="text-[10px] text-[#626266]">{level.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {level.id === 'high' ? '856' :
                                     level.id === 'medium' ? '1,284' : '707'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Visit Frequency */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-2">Visit Frequency</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filterOptions.customerBehaviour.visitFrequency.map(frequency => (
                              <label key={frequency.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="visitFrequency"
                                  checked={customFilters.customerBehaviour.visitFrequency === frequency.id}
                                  onChange={() => updateFilter('customerBehaviour', 'visitFrequency', frequency.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{frequency.label}</div>
                                    <div className="text-[10px] text-[#626266]">{frequency.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {frequency.id === 'daily' ? '285' :
                                     frequency.id === 'weekly' ? '856' :
                                     frequency.id === 'monthly' ? '1,284' :
                                     frequency.id === 'quarterly' ? '427' : '571'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Last Activity */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-3">Last Activity</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filterOptions.customerBehaviour.lastActivity.map(activity => (
                              <label key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="lastActivity"
                                  checked={customFilters.customerBehaviour.lastActivity === activity.id}
                                  onChange={() => updateFilter('customerBehaviour', 'lastActivity', activity.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{activity.label}</div>
                                    <div className="text-[10px] text-[#626266]">{activity.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {activity.id === 'today' ? '856' :
                                     activity.id === 'this_week' ? '1,284' :
                                     activity.id === 'this_month' ? '1,847' :
                                     activity.id === 'last_month' ? '427' : '71'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Separator */}
                        <div className="border-t border-gray-200"></div>

                        {/* Lifetime Value */}
                        <div>
                          <h5 className="text-[12px] font-semibold text-[#2a2a2f] mb-3">Lifetime Value</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                            {filterOptions.customerBehaviour.lifetimeValue.map(value => (
                              <label key={value.id} className="flex items-start gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name="lifetimeValue"
                                  checked={customFilters.customerBehaviour.lifetimeValue === value.id}
                                  onChange={() => updateFilter('customerBehaviour', 'lifetimeValue', value.id)}
                                  className="w-4 h-4 text-[#6E4EFF] border-gray-300 focus:ring-[#6E4EFF] mt-0.5"
                                />
                                <div className="flex-1 flex items-center justify-between">
                                  <div>
                                    <div className="text-[12px] font-medium text-[#2a2a2f]">{value.label}</div>
                                    <div className="text-[10px] text-[#626266]">{value.description}</div>
                                  </div>
                                  <span className="text-[10px] text-[#626266] font-medium">
                                    {value.id === 'high_value' ? '427' :
                                     value.id === 'medium_value' ? '1,284' :
                                     value.id === 'low_value' ? '1,847' : '285'} customers
                                  </span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Audience Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#e9e9e9] rounded-lg overflow-hidden h-full sticky top-6">
                                  <div className="p-6 border-b border-[#e9e9e9]">
                    <h2 className="text-[16px] font-bold text-[#2a2a2f] mb-0.5">Audience Summary</h2>
                    <p className="text-[#a1a1a1] text-[14px] font-normal">Review your audience configuration before proceeding</p>
                  </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {/* Filters Applied */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[14px] font-semibold text-[#2a2a2f]">Filters Applied</h3>
                        <button
                          onClick={() => setFiltersExpanded(!filtersExpanded)}
                          className="flex items-center gap-1 text-[12px] text-[#7856ff] hover:text-[#6a4fd8] font-medium transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:gap-2"
                        >
                          <span>{filtersExpanded ? 'Collapse' : 'Expand'}</span>
                          <svg 
                            className={`w-4 h-4 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${filtersExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      
                                             {/* No Filters Applied - Show when closed or no filters */}
                       {(!filtersExpanded || getActiveFiltersCount() === 0) && (
                         <div className="mb-3">
                           <p className="text-[14px] text-[#626266] font-normal transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                            {getActiveFiltersCount() === 0 ? 'No filters applied' : `${getActiveFiltersCount()} filters applied`}
                          </p>
                        </div>
                      )}
                      
                      {/* Separator */}
                      <div className="w-full h-px bg-[#e9e9e9] mb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"></div>
                      <div className="space-y-3">
                        {getActiveFiltersCount() === 0 ? null : (
                          <div className={`space-y-3 overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${filtersExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            {/* Customer Types */}
                            {customFilters.customerType.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Customer Types</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.customerType.map(typeId => {
                                    const type = filterOptions.customerType.find(t => t.id === typeId);
                                    return (
                                      <div key={typeId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {type ? type.label : typeId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.12).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Customer Status */}
                            {customFilters.customerStatus.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Status Types</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.customerStatus.map(statusId => {
                                    const status = filterOptions.customerStatus.find(s => s.id === statusId);
                                    return (
                                      <div key={statusId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {status ? status.label : statusId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.15).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Visit Range */}
                            {(customFilters.numberOfVisits.min > 0 || customFilters.numberOfVisits.max < 100) && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Visit Range</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• Between {customFilters.numberOfVisits.min} and {customFilters.numberOfVisits.max} visits</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.28).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Categories */}
                            {customFilters.category.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Categories</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.category.map(catId => {
                                    const category = filterOptions.category.find(c => c.id === catId);
                                    return (
                                      <div key={catId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {category ? category.label : catId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.08).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Purchase History */}
                            {customFilters.customerBehaviour.purchaseHistory.length > 0 && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Purchase Periods</div>
                                <div className="space-y-1 ml-2">
                                  {customFilters.customerBehaviour.purchaseHistory.map(periodId => {
                                    const period = filterOptions.customerBehaviour.purchaseHistory.find(p => p.id === periodId);
                                    return (
                                      <div key={periodId} className="flex justify-between items-center text-[14px]">
                                        <span className="text-[#626266]">• {period ? period.label : periodId}</span>
                                        <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.19).toLocaleString()}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Engagement Level */}
                            {customFilters.customerBehaviour.engagementLevel && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Engagement</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.engagementLevel}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.45).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Visit Frequency */}
                            {customFilters.customerBehaviour.visitFrequency && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Frequency</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.visitFrequency}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.33).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Last Activity */}
                            {customFilters.customerBehaviour.lastActivity && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Last Activity</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.lastActivity}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.41).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}

                            {/* Lifetime Value */}
                            {customFilters.customerBehaviour.lifetimeValue && (
                              <div className="transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] transform origin-top">
                                <div className="text-[14px] font-semibold text-[#a1a1a1] mb-2">Lifetime Value</div>
                                <div className="space-y-1 ml-2">
                                  <div className="flex justify-between items-center text-[14px]">
                                    <span className="text-[#626266]">• {customFilters.customerBehaviour.lifetimeValue}</span>
                                    <span className="font-medium text-[#2a2a2f]">{Math.round(customAudienceSize * 0.27).toLocaleString()}</span>
                                  </div>
                                </div>
                                <div className="w-full h-px bg-[#e9e9e9] mt-2"></div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                                         
  
                     {/* Total Customer */}
                     <div className="text-center">
                       <h3 className="text-[14px] font-normal text-[#2a2a2f] mb-3">Total Customer</h3>
                       <div className="text-[24px] font-bold text-[#2a2a2f]">
                         {customAudienceSize.toLocaleString()}
                       </div>
                     </div>

                     {/* Separator */}
                     <div className="w-full h-px bg-[#e9e9e9]"></div>

                                          {/* AI Insights and Performance Metrics */}
                     <div>
                       <h3 className="text-[14px] font-semibold text-[#2a2a2f] mb-3">AI Insights & Performance</h3>
                       <div className="space-y-3">
                         {/* Engagement Prediction */}
                         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                           <div className="flex items-start gap-2">
                             <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                               <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                               </svg>
                             </div>
                             <div>
                               <h4 className="text-[14px] font-semibold text-blue-800 mb-1">Engagement Prediction</h4>
                               <p className="text-[14px] text-blue-700">High engagement expected with 78% open rate and 2.4x higher click-through rates</p>
                             </div>
                           </div>
                         </div>

                         {/* Performance Metrics */}
                         <div className="grid grid-cols-2 gap-3">
                           <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
                             <div className="text-[16px] font-bold text-green-600">4.2x</div>
                             <div className="text-[14px] text-green-700">Avg. ROI</div>
                           </div>
                           <div className="text-center p-2 bg-purple-50 border border-purple-200 rounded">
                             <div className="text-[16px] font-bold text-purple-600">67%</div>
                             <div className="text-[14px] text-purple-700">Conversion Rate</div>
                           </div>
                         </div>


                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Suggested Audience Cards */}
        <div className="pt-6">
          <div className="bg-white border border-[#e9e9e9] rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[18px] font-semibold text-[#2a2a2f]">AI Suggested Audiences</h3>
            <div className="px-3 py-1 bg-[#7856ff]/10 text-[#7856ff] text-[12px] font-medium rounded-full">
              Recommended
            </div>
          </div>
          <p className="text-[#a1a1a1] text-[14px] mb-6">
            AI-powered audience recommendations based on your customer data and campaign goals
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Card 1: Inactive Users Reactivation */}
            <div 
              className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 group ${
                audienceType === 'ai_inactive' 
                  ? 'border-[#ff6b35] bg-gradient-to-br from-[#ff6b35]/5 to-[#ff8a65]/5' 
                  : 'border-gray-200 hover:border-[#ff6b35]/50 hover:bg-gradient-to-br hover:from-[#ff6b35]/2 hover:to-[#ff8a65]/2'
              }`}
              onClick={() => setAudienceType('ai_inactive')}
            >
              {/* Selection Indicator */}
              {audienceType === 'ai_inactive' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ff6b35] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-[#2a2a2f]">Inactive Users Reactivation</h4>
                    <span className="px-2 py-1 bg-[#ff6b35]/10 text-[#ff6b35] text-[10px] font-semibold rounded-full">
                      High Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626266]">Priority: Critical</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#626266] mb-4 leading-relaxed">
                Target users inactive for 30+ days with personalized reactivation campaigns.
              </p>

              {/* Key Metrics */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#ff6b35]">45K</div>
                  <div className="text-[10px] text-[#626266]">Target Users</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#04b440]">67%</div>
                  <div className="text-[10px] text-[#626266]">Conversion</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#2196f3]">2.8x</div>
                  <div className="text-[10px] text-[#626266]">ROI</div>
                </div>
              </div>



              {/* Action Button */}
              <div className={`w-full py-2 px-3 rounded text-center text-[12px] font-semibold transition-colors ${
                audienceType === 'ai_inactive'
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-gray-100 text-[#626266] group-hover:bg-[#ff6b35] group-hover:text-white'
              }`}>
                {audienceType === 'ai_inactive' ? 'Selected' : 'Select Audience'}
              </div>
            </div>

            {/* AI Card 2: VIP Customer Retention */}
            <div 
              className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 group ${
                audienceType === 'ai_vip' 
                  ? 'border-[#9c27b0] bg-gradient-to-br from-[#9c27b0]/5 to-[#ba68c8]/5' 
                  : 'border-gray-200 hover:border-[#9c27b0]/50 hover:bg-gradient-to-br hover:from-[#9c27b0]/2 hover:to-[#ba68c8]/2'
              }`}
              onClick={() => setAudienceType('ai_vip')}
            >
              {/* Selection Indicator */}
              {audienceType === 'ai_vip' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#9c27b0] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-[#2a2a2f]">VIP Customer Retention</h4>
                    <span className="px-2 py-1 bg-[#9c27b0]/10 text-[#9c27b0] text-[10px] font-semibold rounded-full">
                      Premium
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626266]">Priority: High</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#626266] mb-4 leading-relaxed">
                Re-engage high-value customers with exclusive offers and personalized experiences.
              </p>

              {/* Key Metrics */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#9c27b0]">8.5K</div>
                  <div className="text-[10px] text-[#626266]">VIP Users</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#04b440]">78%</div>
                  <div className="text-[10px] text-[#626266]">Conversion</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#2196f3]">3.2x</div>
                  <div className="text-[10px] text-[#626266]">ROI</div>
                </div>
              </div>



              {/* Action Button */}
              <div className={`w-full py-2 px-3 rounded text-center text-[12px] font-semibold transition-colors ${
                audienceType === 'ai_vip'
                  ? 'bg-[#9c27b0] text-white'
                  : 'bg-gray-100 text-[#626266] group-hover:bg-[#9c27b0] group-hover:text-white'
              }`}>
                {audienceType === 'ai_vip' ? 'Selected' : 'Select Audience'}
              </div>
            </div>

            {/* AI Card 3: New Customers */}
            <div 
              className={`relative bg-white border rounded-xl p-5 cursor-pointer transition-all duration-300 group ${
                audienceType === 'ai_cart' 
                  ? 'border-[#10b981] bg-gradient-to-br from-[#10b981]/5 to-[#34d399]/5' 
                  : 'border-gray-200 hover:border-[#10b981]/50 hover:bg-gradient-to-br hover:from-[#10b981]/2 hover:to-[#34d399]/2'
              }`}
              onClick={() => setAudienceType('ai_cart')}
            >
              {/* Selection Indicator */}
              {audienceType === 'ai_cart' && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10b981] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-[16px] font-bold text-[#2a2a2f]">New Customers</h4>
                    <span className="px-2 py-1 bg-[#10b981]/10 text-[#10b981] text-[10px] font-semibold rounded-full">
                      Growth
                    </span>
                  </div>
                  <p className="text-[11px] text-[#626266]">Priority: High</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[13px] text-[#626266] mb-4 leading-relaxed">
                Acquire new customers with targeted acquisition campaigns and welcome offers.
              </p>

              {/* Key Metrics */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#10b981]">15K</div>
                  <div className="text-[10px] text-[#626266]">Potential</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#04b440]">45%</div>
                  <div className="text-[10px] text-[#626266]">Conversion</div>
                </div>
                <div className="w-px h-8 bg-[#e9e9e9] mx-2"></div>
                <div className="text-center flex-1">
                  <div className="text-[18px] font-bold text-[#2196f3]">2.1x</div>
                  <div className="text-[10px] text-[#626266]">ROI</div>
                </div>
              </div>



              {/* Action Button */}
              <div className={`w-full py-2 px-3 rounded text-center text-[12px] font-semibold transition-colors ${
                audienceType === 'ai_cart'
                  ? 'bg-[#10b981] text-white'
                  : 'bg-gray-100 text-[#626266] group-hover:bg-[#10b981] group-hover:text-white'
              }`}>
                {audienceType === 'ai_cart' ? 'Selected' : 'Select Audience'}
              </div>
            </div>
          </div>

          {/* AI Insights Summary */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-blue-800 mb-2">Why These AI Suggestions?</h4>
                <ul className="text-[12px] text-blue-700 space-y-1">
                  <li>• <strong>Inactive Users:</strong> 67% return within 30 days of targeted campaigns, 2.8x higher ROI</li>
                  <li>• <strong>VIP Customers:</strong> 78% reactivation rate, 45% higher average order values</li>
                  <li>• <strong>Cart Abandonment:</strong> 82% recovery rate, 4.5x success with incentives</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Navigation Bar */}
        <div className={`fixed bottom-0 bg-white border-t border-[#e9e9e9] px-4 sm:px-6 lg:px-12 py-3 z-50 ${
          isMobile ? 'left-0 right-0' : actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={() => router.push('/campaigns')}
                className="h-9 px-3 sm:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Close
              </button>
              <div className="text-[#2a2a2f] text-[12px] sm:text-[14px] font-medium hidden sm:block">
                Audience: {
                  audienceType === 'all' ? `All ${totalUsers.toLocaleString()} customers` :
                  audienceType === 'custom' ? 'Custom audience' :
                  audienceType === 'ai_inactive' ? 'AI: Inactive Users Reactivation' :
                  audienceType === 'ai_vip' ? 'AI: VIP Customer Retention' :
                  audienceType === 'ai_cart' ? 'AI: Cart Abandonment Recovery' :
                  'Custom audience'
                }
              </div>
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={() => router.push(`/new-campaign?type=${campaignType}`)}
                className="h-9 px-3 sm:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleProceed}
                className="h-9 px-3 sm:px-4 py-1 rounded font-medium text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 bg-[#7856ff] text-white hover:bg-[#6a4fd8] shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">Proceed to next step</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
