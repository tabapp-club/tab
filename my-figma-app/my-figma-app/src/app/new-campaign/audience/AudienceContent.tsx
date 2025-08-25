"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import { useAuth } from "@/contexts/AuthContext";
import { useDataCenterData, mapApiDataToTable, UserData } from '@/hooks/useDataCenterData';

// Icons for the stepper
const CampaignIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.0996 13.0009H19.0996C18.8163 13.0009 18.5789 12.9049 18.3876 12.7129C18.1963 12.5209 18.1003 12.2836 18.0996 12.0009C18.0989 11.7182 18.1949 11.4809 18.3876 11.2889C18.5803 11.0969 18.8176 11.0009 19.0996 11.0009H21.0996C21.3829 11.0009 21.6206 11.0969 21.8126 11.2889C22.0046 11.4809 22.1003 11.7182 22.0996 12.0009C22.0989 12.2836 22.0029 12.5212 21.8116 12.7139C21.6203 12.9066 21.3829 13.0022 21.0996 13.0009ZM16.6996 16.8009C16.8663 16.5676 17.0829 16.4342 17.3496 16.4009C17.6163 16.3676 17.8663 16.4342 18.0996 16.6009L19.6996 17.8009C19.9329 17.9676 20.0663 18.1842 20.0996 18.4509C20.1329 18.7176 20.0663 18.9676 19.8996 19.2009C19.7329 19.4342 19.5163 19.5676 19.2496 19.6009C18.9829 19.6342 18.7329 19.5676 18.4996 19.4009L16.8996 18.2009C16.6663 18.0342 16.5329 17.8176 16.4996 17.5509C16.4663 17.2842 16.5329 17.0342 16.6996 16.8009ZM19.6996 6.20091L18.0996 7.40091C17.8663 7.56758 17.6163 7.63424 17.3496 7.60091C17.0829 7.56758 16.8663 7.43424 16.6996 7.20091C16.5329 6.96758 16.4663 6.71758 16.4996 6.45091C16.5329 6.18424 16.6663 5.96758 16.8996 5.80091L18.4996 4.60091C18.7329 4.43424 18.9829 4.36758 19.2496 4.40091C19.5163 4.43424 19.7329 4.56758 19.8996 4.80091C20.0663 5.03424 20.1329 5.28424 20.0996 5.55091C20.0663 5.81758 19.9329 6.03424 19.6996 6.20091ZM5.09961 15.0009H4.09961C3.54961 15.0009 3.07894 14.8052 2.68761 14.4139C2.29628 14.0226 2.10028 13.5516 2.09961 13.0009V11.0009C2.09961 10.4509 2.29561 9.98024 2.68761 9.58891C3.07961 9.19758 3.55028 9.00158 4.09961 9.00091H8.09961L11.5746 6.90091C11.9079 6.70091 12.2456 6.70091 12.5876 6.90091C12.9296 7.10091 13.1003 7.39258 13.0996 7.77591V16.2259C13.0996 16.6092 12.9286 16.9009 12.5866 17.1009C12.2446 17.3009 11.9073 17.3009 11.5746 17.1009L8.09961 15.0009H7.09961V18.0009C7.09961 18.2842 7.00361 18.5219 6.81161 18.7139C6.61961 18.9059 6.38228 19.0016 6.09961 19.0009C5.81694 19.0002 5.57961 18.9042 5.38761 18.7129C5.19561 18.5216 5.09961 18.2842 5.09961 18.0009V15.0009ZM14.0996 15.3509V8.65091C14.5496 9.05091 14.9123 9.53858 15.1876 10.1139C15.4629 10.6892 15.6003 11.3182 15.5996 12.0009C15.5989 12.6836 15.4613 13.3129 15.1866 13.8889C14.9119 14.4649 14.5496 14.9522 14.0996 15.3509Z" fill="#04B440"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2002 4.5H10.2002C6.42896 4.5 4.54334 4.5 3.37177 5.67157C2.52823 6.51511 2.29204 7.72882 2.22591 9.75H22.1745C22.1083 7.72882 21.8722 6.51511 21.0286 5.67157C19.857 4.5 17.9714 4.5 14.2002 4.5Z" fill="#04B440"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M14.2002 20.5H10.2002C6.42896 20.5 4.54334 20.5 3.37177 19.3284C2.2002 18.1569 2.2002 16.2712 2.2002 12.5C2.2002 12.0581 2.2002 11.642 2.20208 11.25H22.1983C22.2002 11.642 22.2002 12.0581 22.2002 12.5C22.2002 16.2712 22.2002 18.1569 21.0286 19.3284C19.857 20.5 17.9714 20.5 14.2002 20.5ZM16.2449 12.75C16.6778 12.7499 17.0746 12.7499 17.3974 12.7933C17.7529 12.8411 18.1286 12.9535 18.4376 13.2626C18.7467 13.5716 18.8591 13.9473 18.9069 14.3028C18.9503 14.6256 18.9502 15.0224 18.9502 15.4553V15.5447C18.9502 15.9776 18.9503 16.3744 18.9069 16.6972C18.8591 17.0527 18.7467 17.4284 18.4376 17.7374C18.1286 18.0465 17.7529 18.1589 17.3974 18.2067C17.0746 18.2501 16.6778 18.2501 16.2449 18.25L16.2002 18.25L16.1555 18.25C15.7226 18.2501 15.3258 18.2501 15.003 18.2067C14.6475 18.1589 14.2718 18.0465 13.9628 17.7374C13.6537 17.4284 13.5413 17.0527 13.4935 16.6972C13.4501 16.3744 13.4501 15.9776 13.4502 15.5447L13.4502 15.5L13.4502 15.4553C13.4501 15.0224 13.4501 14.6256 13.4935 14.3028C13.5413 13.9473 13.6537 13.5716 13.9628 13.2626C14.2718 12.9535 14.6475 12.8411 15.003 12.7933C15.3258 12.7499 15.7226 12.7499 16.1554 12.75H16.2449ZM5.4502 14C5.4502 13.5858 5.78598 13.25 6.2002 13.25H8.2002C8.61441 13.25 8.9502 13.5858 8.9502 14C8.9502 14.4142 8.61441 14.75 8.2002 14.75H6.2002C5.78598 14.75 5.4502 14.4142 5.4502 14ZM5.4502 17C5.4502 16.5858 5.78598 16.25 6.2002 16.25H10.2002C10.6144 16.25 10.9502 16.5858 10.9502 17C10.9502 17.4142 10.6144 17.75 10.2002 17.75H6.2002C5.78598 17.75 5.4502 17.4142 5.4502 17Z" fill="#04B440"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M17.1201 3.90039C17.7777 3.89668 18.4265 4.05279 19.0098 4.35645C19.5931 4.66014 20.0937 5.10171 20.4678 5.64258C20.8418 6.18349 21.078 6.80795 21.1562 7.46094C21.2345 8.11396 21.1527 8.7766 20.917 9.39062C20.6813 10.0046 20.2987 10.5514 19.8037 10.9844C19.3086 11.4174 18.7151 11.7232 18.0752 11.875C17.4354 12.0266 16.7684 12.0199 16.1318 11.8555C15.4952 11.6909 14.9081 11.3734 14.4219 10.9307C15.1713 10.0159 15.6589 8.91479 15.833 7.74512C16.0071 6.57547 15.8607 5.38045 15.4102 4.28711C15.9442 4.03298 16.5287 3.90107 17.1201 3.90039ZM9.20801 1.75C12.0221 1.75012 14.3037 4.0124 14.3037 6.80273C14.3036 9.59294 12.022 11.8544 9.20801 11.8545C6.39394 11.8545 4.11245 9.59302 4.1123 6.80273C4.1123 4.01233 6.39385 1.75 9.20801 1.75Z" fill="currentColor"/>
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
<path fillRule="evenodd" clipRule="evenodd" d="M2.7998 12.5C2.7998 11.661 2.7998 10.915 2.8128 10.25H22.7868C22.7998 10.915 22.7998 11.661 22.7998 12.5V14.5C22.7998 18.271 22.7998 20.157 21.6278 21.328C20.4558 22.499 18.5708 22.5 14.7998 22.5H10.7998C7.0288 22.5 5.1428 22.5 3.9718 21.328C2.8008 20.156 2.7998 18.271 2.7998 14.5V12.5ZM17.7998 14.5C18.065 14.5 18.3194 14.3946 18.5069 14.2071C18.6944 14.0196 18.7998 13.7652 18.7998 13.5C18.7998 13.2348 18.6944 12.9804 18.5069 12.7929C18.3194 12.6054 18.065 12.5 17.7998 12.5C17.5346 12.5 17.2802 12.6054 17.0927 12.7929C16.9052 12.9804 16.7998 13.2348 16.7998 13.5C16.7998 13.7652 16.9052 14.0196 17.0927 14.2071C17.2802 14.3946 17.5346 14.5 17.7998 14.5ZM17.7998 18.5C18.065 18.5 18.3194 18.3946 18.5069 18.2071C18.6944 18.0196 18.7998 17.7652 18.7998 17.5C18.7998 17.2348 18.6944 16.9804 18.5069 16.7929C18.3194 16.6054 18.065 16.5 17.7998 16.5C17.5346 16.5 17.2802 16.6054 17.0927 16.7929C16.9052 16.9804 16.7998 17.2348 16.7998 17.5C16.7998 17.7652 16.9052 18.0196 17.0927 18.2071C17.2802 18.3946 17.5346 18.5 17.7998 18.5ZM13.7998 13.5C13.7998 13.7652 13.6944 14.0196 13.5069 14.2071C13.3194 14.3946 13.065 14.5 12.7998 14.5C12.5346 14.5 12.2802 14.3946 12.0927 14.2071C11.9052 14.0196 11.7998 13.7652 11.7998 13.5C11.7998 13.2348 11.9052 12.9804 12.0927 12.7929C12.2802 12.6054 12.5346 12.5 12.7998 12.5C13.065 12.5 13.3194 12.6054 13.5069 12.7929C13.6944 12.9804 13.7998 13.2348 13.7998 13.5ZM13.7998 17.5C13.7998 17.7652 13.6944 18.0196 13.5069 18.2071C13.3194 18.3946 13.065 18.5 12.7998 18.5C12.5346 18.5 12.2802 18.3946 12.0927 18.2071C11.9052 18.0196 11.7998 17.7652 11.7998 17.5C11.7998 17.2348 11.9052 16.9804 12.0927 16.7929C12.2802 16.6054 12.5346 16.5 12.7998 16.5C13.065 16.5 13.3194 16.6054 13.5069 16.7929C13.6944 16.9804 13.7998 17.2348 13.7998 17.5ZM7.7998 14.5C8.06502 14.5 8.31938 14.3946 8.50691 14.2071C8.69445 14.0196 8.7998 13.7652 8.7998 13.5C8.7998 13.2348 8.69445 12.9804 8.50691 12.7929C8.31938 12.6054 8.06502 12.5 7.7998 12.5C7.53459 12.5 7.28023 12.6054 7.0927 12.7929C6.90516 12.9804 6.7998 13.2348 6.7998 13.5C6.7998 13.7652 6.90516 14.0196 7.0927 14.2071C7.28023 14.3946 7.53459 14.5 7.7998 14.5ZM7.7998 18.5C8.06502 18.5 8.31938 18.3946 8.50691 18.2071C8.69445 18.0196 8.7998 17.7652 8.7998 17.5C8.7998 17.2348 8.69445 16.9804 8.50691 16.7929C8.31938 16.6054 8.06502 16.5 7.7998 16.5C7.53459 16.5 7.28023 16.6054 7.0927 16.7929C6.90516 16.9804 6.7998 17.2348 6.7998 17.5C6.7998 17.7652 6.90516 18.0196 7.0927 18.2071C7.28023 18.3946 7.53459 18.5 7.7998 18.5Z" fill="#A1A1A1"/>
</svg>
);

// Icons for the filter options
const ChevronDownIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SwitchIcon = () => (
  <svg width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="18" rx="9" fill="#7856FF"/>
    <circle cx="21" cy="9" r="6" fill="white"/>
  </svg>
);

const SwitchOffIcon = () => (
  <svg width="30" height="18" viewBox="0 0 30 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="30" height="18" rx="9" fill="#E5E5E5"/>
    <circle cx="9" cy="9" r="6" fill="white"/>
  </svg>
);

// Filter Dropdown Component
const FilterDropdown = ({
  isOpen,
  onToggle,
  title,
  options,
  selectedItems,
  onSelectionChange,
  selectedCount = 0
}: {
  isOpen: boolean;
  onToggle: () => void;
  title: string;
  options: Array<{id?: string, name?: string, label?: string, value?: string}>;
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  selectedCount?: number;
}) => {
  const handleItemToggle = (itemId: string) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    onSelectionChange(newSelection);
  };

  const getDisplayName = (option: any) => {
    return option.name || option.label || option.value || option.id || '';
  };

  const getItemId = (option: any) => {
    return option.id || option.value || option.name || option.label || '';
  };

  return (
    <div className="relative filter-dropdown">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors border border-[#e9e9e9] rounded"
      >
        <div className="flex items-center gap-2">
          <span className="text-[#2a2a2f] text-[16px] font-normal">
            {title}
          </span>
          {selectedCount > 0 && (
            <span className="bg-[#7856ff] text-white text-xs px-2 py-1 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <div className={`rotate-[270deg] transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          <ChevronDownIcon />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e9e9e9] rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            {options.map((option, index) => {
              const itemId = getItemId(option);
              const displayName = getDisplayName(option);
              const isSelected = selectedItems.includes(itemId);
              
              return (
                <label
                  key={index}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleItemToggle(itemId)}
                    className="rounded border-[#e9e9e9] text-[#7856ff] focus:ring-[#7856ff]"
                  />
                  <span className="text-[#2a2a2f] text-[14px]">
                    {displayName}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Stepper Component based on Figma design
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

  const getTextColor = () => {
    if (isCurrent) {
      return "text-[#7856ff]";
    }
    if (isCompleted) {
      return "text-[#04b440]";
    }
    return "text-[#a1a1a1]";
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
const StepperProgressBar = ({ currentStep = 3, totalSteps = 5 }: { currentStep?: number; totalSteps?: number }) => {
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
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showWarning } = usePopup();
  const campaignType = searchParams.get('type') || 'advertise';

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  const [userCount, setUserCount] = useState<number | null>(null);
  const [allUsersEnabled, setAllUsersEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states - using proper data center structure
  const [filters, setFilters] = useState<any>({});
  const [categories, setCategories] = useState<Array<{name: string, label: string}>>([]);
  const [userTypes, setUserTypes] = useState<string[]>([]);
  const [visitRanges, setVisitRanges] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [cohorts, setCohorts] = useState<Array<{id: string, name: string}>>([]);
  
  // Filter dropdown states
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState({
    cohorts: [] as string[],
    categories: [] as string[],
    userTypes: [] as string[],
    visitRanges: [] as string[],
    statuses: [] as string[]
  });

  // Convert selected filters to data center API format
  const convertFiltersToApiFormat = useCallback(() => {
    const apiFilters: any = {};
    
    // Convert categories
    if (selectedFilters.categories.length > 0) {
      apiFilters.category = selectedFilters.categories;
    }
    
    // Convert user types (take first one as data center API expects single value)
    if (selectedFilters.userTypes.length > 0) {
      apiFilters.userType = selectedFilters.userTypes[0];
    }
    
    // Convert visit ranges
    if (selectedFilters.visitRanges.length > 0) {
      const visitRanges = selectedFilters.visitRanges.map(range => {
        if (range === '1') return { from: 1, to: 1 };
        if (range === '2-5') return { from: 2, to: 5 };
        if (range === '6-10') return { from: 6, to: 10 };
        if (range === '11-20') return { from: 11, to: 20 };
        if (range === '21+') return { from: 21, to: 999 };
        return null;
      }).filter(Boolean);

      if (visitRanges.length > 0) {
        apiFilters.no_of_visits_from = Math.min(...visitRanges.map(r => r!.from));
        apiFilters.no_of_visits_to = Math.max(...visitRanges.map(r => r!.to));
      }
    }
    
    // Convert status (take first one as data center API expects single value)
    if (selectedFilters.statuses.length > 0) {
      apiFilters.status = selectedFilters.statuses[0];
    }
    
    return apiFilters;
  }, [selectedFilters]);

  // Use React Query to fetch data center data
  const { data: dataCenterResponse, isLoading: dataLoading, error: dataError } = useDataCenterData({
    page: 1,
    pageSize: 1, // We only need the count, not the actual data
    filters: convertFiltersToApiFormat()
  });

  // Stepper data based on Figma design
  const stepperSteps = [
    { title: 'campaign type', icon: <CampaignIcon />, isCompleted: true, timeEstimate: "2-3 min", description: "Choose campaign type" },
    { title: 'Create campaign', icon: <MoneyIcon />, isCompleted: true, timeEstimate: "5-8 min", description: "Design your campaign" },
    { title: 'Choose audience', icon: <UsersIcon />, isCurrent: true, timeEstimate: "3-5 min", description: "Select target users" },
    { title: 'Platform & Budget', icon: <BagIcon />, isCompleted: false, timeEstimate: "2-4 min", description: "Set budget & platforms" },
    { title: 'Schedule', icon: <CalendarIcon />, isCompleted: false, timeEstimate: "1-2 min", description: "Set timing" }
  ];

  // Load data from session storage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('audienceData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log('Loading data from session storage:', data);
        setUserCount(data.userCount || null);
        setAllUsersEnabled(data.allUsersEnabled !== undefined ? data.allUsersEnabled : true);
        setSelectedFilters(data.selectedFilters || {
          cohorts: [],
          categories: [],
          userTypes: [],
          visitRanges: [],
          statuses: []
        });
      } catch (error) {
        console.error('Error loading audience data from session storage:', error);
      }
    }
  }, []);

  // Update user count when data center response changes
  useEffect(() => {
    if (dataCenterResponse) {
      setUserCount(dataCenterResponse.total || 0);
      if (dataCenterResponse.categories && Array.isArray(dataCenterResponse.categories)) {
        setCategories(dataCenterResponse.categories);
      }
    }
  }, [dataCenterResponse]);

  // Save data to session storage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      userCount,
      allUsersEnabled,
      selectedFilters
    };
    sessionStorage.setItem('audienceData', JSON.stringify(dataToSave));
  }, [userCount, allUsersEnabled, selectedFilters]);

  // Set filter options from data center response
  useEffect(() => {
    if (dataCenterResponse) {
      // Set filter options from API response
      if (dataCenterResponse.categories && Array.isArray(dataCenterResponse.categories)) {
        setCategories(dataCenterResponse.categories);
      }
      
      // Set other filter options (these would come from your API)
      setUserTypes(['retained', 'new']);
      setVisitRanges(['1', '2-5', '6-10', '11-20', '21+']);
      setStatuses(['active', 'inactive']);
      setCohorts([
        { id: '1', name: 'High Value Customers' },
        { id: '2', name: 'Recent Purchasers' },
        { id: '3', name: 'Abandoned Cart Users' },
        { id: '4', name: 'First Time Buyers' }
      ]);
    }
  }, [dataCenterResponse]);

  const handleAllUsersToggle = () => {
    const newAllUsersEnabled = !allUsersEnabled;
    setAllUsersEnabled(newAllUsersEnabled);
    
    if (newAllUsersEnabled) {
      // Clear all filters when "All users" is enabled
      setSelectedFilters({
        cohorts: [],
        categories: [],
        userTypes: [],
        visitRanges: [],
        statuses: []
      });
    }
  };

  const handleFilterToggle = (filterType: string) => {
    setOpenFilter(openFilter === filterType ? null : filterType);
  };

  const handleFilterSelection = (filterType: string, selectedIds: string[]) => {
    // Turn off "All users" toggle when any filter is selected
    if (selectedIds.length > 0) {
      setAllUsersEnabled(false);
    }

    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: selectedIds
    }));
  };

  const getSelectedCount = (filterType: string) => {
    return selectedFilters[filterType as keyof typeof selectedFilters]?.length || 0;
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      cohorts: [],
      categories: [],
      userTypes: [],
      visitRanges: [],
      statuses: []
    });
    setAllUsersEnabled(true);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openFilter && !(event.target as Element).closest('.filter-dropdown')) {
        setOpenFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openFilter]);

  const formatUserCount = (count: number | null) => {
    if (count === null) {
      return '-';
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleProceed = async () => {
    if (!allUsersEnabled && Object.values(selectedFilters).every(arr => arr.length === 0)) {
      showWarning(
        'No Audience Selected',
        'Please either enable "All users" or select specific filters for your audience.'
      );
      return;
    }

    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save the selected filters to session storage for the next step
    const audienceData = {
      allUsersEnabled,
      selectedFilters,
      userCount
    };
    sessionStorage.setItem('audienceData', JSON.stringify(audienceData));

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

      <div className="w-full max-w-full px-4 py-4 lg:px-8 lg:py-8 overflow-x-hidden min-h-screen pb-32">
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
          <StepperProgressBar currentStep={3} totalSteps={5} />
        </section>

        {/* Main Title */}
        <div className="mb-6">
          <h1 className="text-[#2a2a2f] text-[20px] font-bold tracking-[-0.1px] leading-[1.4]">
            Select users for campaign
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white border border-[#e9e9e9] rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Filter Options */}
            <div className="flex-1">
              <div className="flex flex-col gap-4">
                {/* All Users Toggle */}
                <div className="bg-white border border-[#e9e9e9] rounded p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a1a1a1] text-[16px] font-normal tracking-[-0.16px]">
                      All users
                    </span>
                    <button
                      onClick={handleAllUsersToggle}
                      className="h-[18px] w-[30px] relative"
                    >
                      {allUsersEnabled ? <SwitchIcon /> : <SwitchOffIcon />}
                    </button>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="flex flex-col gap-4">
                  {/* Cohorts */}
                  <FilterDropdown
                    isOpen={openFilter === 'cohorts'}
                    onToggle={() => handleFilterToggle('cohorts')}
                    title="Cohorts"
                    options={cohorts}
                    selectedItems={selectedFilters.cohorts}
                    onSelectionChange={(items) => handleFilterSelection('cohorts', items)}
                    selectedCount={getSelectedCount('cohorts')}
                  />

                  {/* Category */}
                  <FilterDropdown
                    isOpen={openFilter === 'categories'}
                    onToggle={() => handleFilterToggle('categories')}
                    title="Category"
                    options={categories}
                    selectedItems={selectedFilters.categories}
                    onSelectionChange={(items) => handleFilterSelection('categories', items)}
                    selectedCount={getSelectedCount('categories')}
                  />

                  {/* User type */}
                  <FilterDropdown
                    isOpen={openFilter === 'userTypes'}
                    onToggle={() => handleFilterToggle('userTypes')}
                    title="User type"
                    options={userTypes.map(type => ({ 
                      id: type, 
                      name: type === 'retained' ? 'Retained' : type === 'new' ? 'New' : type 
                    }))}
                    selectedItems={selectedFilters.userTypes}
                    onSelectionChange={(items) => handleFilterSelection('userTypes', items)}
                    selectedCount={getSelectedCount('userTypes')}
                  />

                  {/* No of visits */}
                  <FilterDropdown
                    isOpen={openFilter === 'visitRanges'}
                    onToggle={() => handleFilterToggle('visitRanges')}
                    title="No of visits"
                    options={visitRanges.map(range => ({ id: range, name: range }))}
                    selectedItems={selectedFilters.visitRanges}
                    onSelectionChange={(items) => handleFilterSelection('visitRanges', items)}
                    selectedCount={getSelectedCount('visitRanges')}
                  />

                  {/* Status */}
                  <FilterDropdown
                    isOpen={openFilter === 'statuses'}
                    onToggle={() => handleFilterToggle('statuses')}
                    title="Status"
                    options={statuses.map(status => ({ 
                      id: status, 
                      name: status === 'active' ? 'Active' : status === 'inactive' ? 'Inactive' : status 
                    }))}
                    selectedItems={selectedFilters.statuses}
                    onSelectionChange={(items) => handleFilterSelection('statuses', items)}
                    selectedCount={getSelectedCount('statuses')}
                  />
                </div>

                {/* Clear Filters Button */}
                {Object.values(selectedFilters).some(arr => arr.length > 0) && (
                  <div className="mt-4">
                    <button
                      onClick={clearAllFilters}
                      className="text-[#7856ff] text-[14px] font-medium hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - User Count */}
            <div className="lg:w-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#2a2a2f] text-[16px] font-normal mb-4">
                  Sending campaign to
                </p>
                <div className="text-[#2a2a2f] text-[48px] font-extrabold tracking-[-0.96px] leading-[1.4]">
                  {dataLoading ? '...' : dataError ? 'Error' : `${formatUserCount(userCount)} users`}
                </div>
                {dataError && (
                  <p className="text-red-500 text-sm mt-2">
                    Failed to load user count
                  </p>
                )}
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
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={() => router.push(`/new-campaign/create?type=${campaignType}`)}
                className="h-9 px-3 sm:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleProceed}
                disabled={isLoading}
                className={`h-9 px-3 sm:px-4 py-1 rounded font-medium text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
                  !isLoading
                    ? 'bg-[#7856ff] text-white hover:bg-[#6a4fd8] shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">{isLoading ? 'Processing...' : 'Proceed to next step'}</span>
                <span className="sm:hidden">{isLoading ? 'Processing...' : 'Next'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
