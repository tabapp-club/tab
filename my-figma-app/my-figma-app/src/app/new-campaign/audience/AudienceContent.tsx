"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import { useAuth } from "@/contexts/AuthContext";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import DataCenterFilters from "@/components/DataCenterFilters";
import FilterDropdown from "@/components/FilterDropdown";



// Icons for the stepper
const CampaignIcon = () => (
  <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.0996 13.0009H19.0996C18.8163 13.0009 18.5789 12.9049 18.3876 12.7129C18.1963 12.5209 18.1003 12.2836 18.0996 12.0009C18.0989 11.7182 18.1949 11.4809 18.3876 11.2889C18.5803 11.0969 18.8176 11.0009 19.0996 11.0009H21.0996C21.3829 11.0009 21.6206 11.0969 21.8126 11.2889C22.0046 11.4809 22.1003 11.7182 22.0996 12.0009C22.0989 12.2836 22.0029 12.5212 21.8116 12.7139C21.6203 12.9066 21.3829 13.0022 21.0996 13.0009ZM16.6996 16.8009C16.8663 16.5676 17.0829 16.4342 17.3496 16.4009C17.6163 16.3676 17.8663 16.4342 18.0996 16.6009L19.6996 17.8009C19.9329 17.9676 20.0663 18.1842 20.0996 18.4509C20.1329 18.7176 20.0663 18.9676 19.8996 19.2009C19.7329 19.4342 19.5163 19.5676 19.2496 19.6009C18.9829 19.6342 18.7329 19.5676 18.4996 19.4009L16.8996 18.2009C16.6663 18.0342 16.5329 17.8176 16.4996 17.5509C16.4663 17.2842 16.5329 17.0342 16.6996 16.8009ZM19.6996 6.20091L18.0996 7.40091C17.8663 7.56758 17.6163 7.63424 17.3496 7.60091C17.0829 7.56758 16.8663 7.43424 16.6996 7.20091C16.5329 6.96758 16.4663 6.71758 16.4996 6.45091C16.5329 6.18424 16.6663 5.96758 16.8996 5.80091L18.4996 4.60091C18.7329 4.43424 18.9829 4.36758 19.2496 4.40091C19.5163 4.43424 19.7329 4.56758 19.8996 4.80091C20.0663 5.03424 20.1329 5.28424 20.0996 5.55091C20.0663 5.81758 19.9329 6.03424 19.6996 6.20091ZM5.09961 15.0009H4.09961C3.54961 15.0009 3.07894 14.8052 2.68761 14.4139C2.29628 14.0226 2.10028 13.5516 2.09961 13.0009V11.0009C2.09961 10.4509 2.29561 9.98024 2.68761 9.58891C3.07961 9.19758 3.55028 9.00158 4.09961 9.00091H8.09961L11.5746 6.90091C11.9079 6.70091 12.2456 6.70091 12.5876 6.90091C12.9296 7.10091 13.1003 7.39258 13.0996 7.77591V16.2259C13.0996 16.6092 12.9286 16.9009 12.5866 17.1009C12.2446 17.3009 11.9073 17.3009 11.5746 17.1009L8.09961 15.0009H7.09961V18.0009C7.09961 18.2842 7.00361 18.5219 6.81161 18.7139C6.61961 18.9059 6.38228 19.0016 6.09961 19.0009C5.81694 19.0002 5.57961 18.9042 5.38761 18.7129C5.19561 18.5216 5.09961 18.2842 5.09961 18.0009V15.0009ZM14.0996 15.3509V8.65091C14.5496 9.05091 14.9123 9.53858 15.1876 10.1139C15.4629 10.6892 15.6003 11.3182 15.5996 12.0009C15.5989 12.6836 15.4613 13.3129 15.1866 13.8889C14.9119 14.4649 14.5496 14.9522 14.0996 15.3509Z" fill="#04B440"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2002 4.5H10.2002C6.42896 4.5 4.54334 4.5 3.37177 5.67157C2.52823 6.51511 2.29204 7.72882 2.22591 9.75H22.1745C22.1083 7.72882 21.8722 6.51511 21.0286 5.67157C19.857 4.5 17.9714 4.5 14.2002 4.5Z" fill="#04B440"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2002 20.5H10.2002C6.42896 20.5 4.54334 20.5 3.37177 19.3284C2.2002 18.1569 2.2002 16.2712 2.2002 12.5C2.2002 12.0581 2.2002 11.642 2.20208 11.25H22.1983C22.2002 11.642 22.2002 12.0581 22.2002 12.5C22.2002 16.2712 22.2002 18.1569 21.0286 19.3284C19.857 20.5 17.9714 20.5 14.2002 20.5ZM16.2449 12.75C16.6778 12.7499 17.0746 12.7499 17.3974 12.7933C17.7529 12.8411 18.1286 12.9535 18.4376 13.2626C18.7467 13.5716 18.8591 13.9473 18.9069 14.3028C18.9503 14.6256 18.9502 15.0224 18.9502 15.4553V15.5447C18.9502 15.9776 18.9503 16.3744 18.9069 16.6972C18.8591 17.0527 18.7467 17.4284 18.4376 17.7374C18.1286 18.0465 17.7529 18.1589 17.3974 18.2067C17.0746 18.2501 16.6778 18.2501 16.2449 18.25L16.2002 18.25L16.1555 18.25C15.7226 18.2501 15.3258 18.2501 15.003 18.2067C14.6475 18.1589 14.2718 18.0465 13.9628 17.7374C13.6537 17.4284 13.5413 17.0527 13.4935 16.6972C13.4501 16.3744 13.4501 15.9776 13.4502 15.5447L13.4502 15.5L13.4502 15.4553C13.4501 15.0224 13.4501 14.6256 13.4935 14.3028C13.5413 13.9473 13.6537 13.5716 13.9628 13.2626C14.2718 12.9535 14.6475 12.8411 15.003 12.7933C15.3258 12.7499 15.7226 12.7499 16.1554 12.75H16.2449ZM5.4502 14C5.4502 13.5858 5.78598 13.25 6.2002 13.25H8.2002C8.61441 13.25 8.9502 13.5858 8.9502 14C8.9502 14.4142 8.61441 14.75 8.2002 14.75H6.2002C5.78598 14.75 5.4502 14.4142 5.4502 14ZM5.4502 17C5.4502 16.5858 5.78598 16.25 6.2002 16.25H10.2002C10.6144 16.25 10.9502 16.5858 10.9502 17C10.9502 17.4142 10.6144 17.75 10.2002 17.75H6.2002C5.78598 17.75 5.4502 17.4142 5.4502 17Z" fill="#04B440"/>
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
<g clip-path="url(#clip0_719_7542)">
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.8329 14.3459C19.8329 18.5916 15.9858 20.5002 10.6 20.5002C5.21433 20.5002 1.36719 18.5916 1.36719 14.3759C1.36719 9.76018 3.67576 7.42161 8.29147 5.08304L6.65719 2.03875C6.55968 1.88627 6.50538 1.71019 6.50008 1.52927C6.49478 1.34836 6.53868 1.1694 6.62711 1.01147C6.71553 0.853546 6.84515 0.72258 7.00215 0.632536C7.15916 0.542492 7.33766 0.496748 7.51862 0.50018H14.0429C14.2125 0.50452 14.3782 0.551947 14.5245 0.637997C14.6707 0.724047 14.7926 0.84589 14.8788 0.99206C14.965 1.13823 15.0125 1.30392 15.017 1.47353C15.0214 1.64315 14.9827 1.81111 14.9043 1.96161L12.9086 5.08304C17.5229 7.39018 19.8329 9.72875 19.8329 14.3459ZM7.68147 9.78589H10.0858C10.2858 9.84589 10.5372 9.95732 10.7386 10.143C10.8894 10.2798 11.0008 10.4544 11.0615 10.6488H7.6829C7.5891 10.6488 7.49622 10.6672 7.40956 10.7031C7.3229 10.739 7.24415 10.7916 7.17782 10.858C7.1115 10.9243 7.05888 11.003 7.02299 11.0897C6.98709 11.1764 6.96862 11.2692 6.96862 11.363C6.96862 11.4568 6.98709 11.5497 7.02299 11.6364C7.05888 11.723 7.1115 11.8018 7.17782 11.8681C7.24415 11.9344 7.3229 11.9871 7.40956 12.023C7.49622 12.0588 7.5891 12.0773 7.6829 12.0773H10.8358C10.5903 12.35 10.2789 12.5552 9.93147 12.673C9.48365 12.8366 9.01234 12.9268 8.53576 12.9402H8.51433C8.36893 12.9403 8.22703 12.9848 8.10759 13.0677C7.98815 13.1507 7.89686 13.2681 7.84593 13.4042C7.79499 13.5404 7.78684 13.6889 7.82254 13.8299C7.85825 13.9708 7.93612 14.0975 8.04576 14.193L8.04862 14.1959L8.05576 14.2002L8.07433 14.2173C8.17571 14.3033 8.28006 14.3857 8.38719 14.4645C9.61907 15.3844 11.02 16.0528 12.51 16.4316C12.6018 16.4568 12.6978 16.4634 12.7921 16.4509C12.8865 16.4385 12.9775 16.4074 13.0596 16.3593C13.1418 16.3112 13.2135 16.2472 13.2706 16.171C13.3277 16.0948 13.3689 16.008 13.392 15.9157C13.415 15.8233 13.4194 15.7273 13.4048 15.6332C13.3902 15.5391 13.3569 15.4489 13.307 15.3679C13.257 15.2869 13.1914 15.2166 13.1139 15.1613C13.0364 15.106 12.9486 15.0668 12.8558 15.0459C11.9819 14.8217 11.1414 14.4836 10.3558 14.0402L10.4329 14.0116C10.9158 13.8302 11.4472 13.5416 11.8615 13.0745C12.1115 12.7959 12.3072 12.463 12.4286 12.0773H13.5172C13.7066 12.0773 13.8883 12.0021 14.0223 11.8681C14.1562 11.7342 14.2315 11.5525 14.2315 11.363C14.2315 11.1736 14.1562 10.9919 14.0223 10.858C13.8883 10.724 13.7066 10.6488 13.5172 10.6488H12.5258C12.4806 10.3473 12.385 10.0556 12.2429 9.78589H13.5172C13.7066 9.78589 13.8883 9.71064 14.0223 9.57668C14.1562 9.44273 14.2315 9.26105 14.2315 9.07161C14.2315 8.88217 14.1562 8.70049 14.0223 8.56653C13.8883 8.43258 13.7066 8.35732 13.5172 8.35732H7.6829C7.49346 8.35732 7.31178 8.43258 7.17782 8.56653C7.04387 8.70049 6.96862 8.88217 6.96862 9.07161C6.96862 9.26105 7.04387 9.44273 7.17782 9.57668C7.31178 9.71064 7.49346 9.78589 7.6829 9.78589H7.68147Z" fill="#A1A1A1"/>
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
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.7998 12.5C2.7998 11.661 2.7998 10.915 2.8128 10.25H22.7868C22.7998 10.915 22.7998 11.661 22.7998 12.5V14.5C22.7998 18.271 22.7998 20.157 21.6278 21.328C20.4558 22.499 18.5708 22.5 14.7998 22.5H10.7998C7.0288 22.5 5.1428 22.5 3.9718 21.328C2.8008 20.156 2.7998 18.271 2.7998 14.5V12.5ZM17.7998 14.5C18.065 14.5 18.3194 14.3946 18.5069 14.2071C18.6944 14.0196 18.7998 13.7652 18.7998 13.5C18.7998 13.2348 18.6944 12.9804 18.5069 12.7929C18.3194 12.6054 18.065 12.5 17.7998 12.5C17.5346 12.5 17.2802 12.6054 17.0927 12.7929C16.9052 12.9804 16.7998 13.2348 16.7998 13.5C16.7998 13.7652 16.9052 14.0196 17.0927 14.2071C17.2802 14.3946 17.5346 14.5 17.7998 14.5ZM17.7998 18.5C18.065 18.5 18.3194 18.3946 18.5069 18.2071C18.6944 18.0196 18.7998 17.7652 18.7998 17.5C18.7998 17.2348 18.6944 16.9804 18.5069 16.7929C18.3194 16.6054 18.065 16.5 17.7998 16.5C17.5346 16.5 17.2802 16.6054 17.0927 16.7929C16.9052 16.9804 16.7998 17.2348 16.7998 17.5C16.7998 17.7652 16.9052 18.0196 17.0927 18.2071C17.2802 18.3946 17.5346 18.5 17.7998 18.5ZM13.7998 13.5C13.7998 13.7652 13.6944 14.0196 13.5069 14.2071C13.3194 14.3946 13.065 14.5 12.7998 14.5C12.5346 14.5 12.2802 14.3946 12.0927 14.2071C11.9052 14.0196 11.7998 13.7652 11.7998 13.5C11.7998 13.2348 11.9052 12.9804 12.0927 12.7929C12.2802 12.6054 12.5346 12.5 12.7998 12.5C13.065 12.5 13.3194 12.6054 13.5069 12.7929C13.6944 12.9804 13.7998 13.2348 13.7998 13.5ZM13.7998 17.5C13.7998 17.7652 13.6944 18.0196 13.5069 18.2071C13.3194 18.3946 13.065 18.5 12.7998 18.5C12.5346 18.5 12.2802 18.3946 12.0927 18.2071C11.9052 18.0196 11.7998 17.7652 11.7998 17.5C11.7998 17.2348 11.9052 16.9804 12.0927 16.7929C12.2802 16.6054 12.5346 16.5 12.7998 16.5C13.065 16.5 13.3194 16.6054 13.5069 16.7929C13.6944 16.9804 13.7998 17.2348 13.7998 17.5ZM7.7998 14.5C8.06502 14.5 8.31938 14.3946 8.50691 14.2071C8.69445 14.0196 8.7998 13.7652 8.7998 13.5C8.7998 13.2348 8.69445 12.9804 8.50691 12.7929C8.31938 12.6054 8.06502 12.5 7.7998 12.5C7.53459 12.5 7.28023 12.6054 7.0927 12.7929C6.90516 12.9804 6.7998 13.2348 6.7998 13.5C6.7998 13.7652 6.90516 14.0196 7.0927 14.2071C7.28023 14.3946 7.53459 14.5 7.7998 14.5ZM7.7998 18.5C8.06502 18.5 8.31938 18.3946 8.50691 18.2071C8.69445 18.0196 8.7998 17.7652 8.7998 17.5C8.7998 17.2348 8.69445 16.9804 8.50691 16.7929C8.31938 16.6054 8.06502 16.5 7.7998 16.5C7.53459 16.5 7.28023 16.6054 7.0927 16.7929C6.90516 16.9804 6.7998 17.2348 6.7998 17.5C6.7998 17.7652 6.90516 18.0196 7.0927 18.2071C7.28023 18.3946 7.53459 18.5 7.7998 18.5Z" fill="#A1A1A1"/>
</svg>

);


const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 10.5C9.82843 10.5 10.5 9.82843 10.5 9C10.5 8.17157 9.82843 7.5 9 7.5C8.17157 7.5 7.5 8.17157 7.5 9C7.5 9.82843 8.17157 10.5 9 10.5Z" fill="currentColor"/>
    <path d="M15 10.5C15.8284 10.5 16.5 9.82843 16.5 9C16.5 8.17157 15.8284 7.5 15 7.5C14.1716 7.5 13.5 8.17157 13.5 9C13.5 9.82843 14.1716 10.5 15 10.5Z" fill="currentColor"/>
    <path d="M3 10.5C3.82843 10.5 4.5 9.82843 4.5 9C4.5 8.17157 3.82843 7.5 3 7.5C2.17157 7.5 1.5 8.17157 1.5 9C1.5 9.82843 2.17157 10.5 3 10.5Z" fill="currentColor"/>
  </svg>
);

interface UserData {
  id: string;
  mobile: string;
  categories: string[];
  userType: string;
  visits: number;
  status: string;
  addedOn: string;
}

interface CampaignMedium {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

const campaignMediums: CampaignMedium[] = [
  {
    id: 'sms',
    name: 'Text Message (SMS)',
    description: 'Send text messages to your customer',
    icon: '📱',
    enabled: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Send Whatsapp to your customer',
    icon: '💬',
    enabled: true
  },
  {
    id: 'tab',
    name: 'tab',
    description: 'Engage more with your users',
    icon: '📋',
    enabled: true
  }
];

const progressSteps = [
  { id: 1, title: 'Choose campaign type', completed: true },
  { id: 2, title: 'Create campaign', completed: true },
  { id: 3, title: 'Choose Audience', completed: true },
  { id: 4, title: 'Schedule Date & Time', completed: false }
];



// Stepper Component based on Figma design
const StepperStep = ({
  title,
  icon,
  isActive = false,
  isCompleted = false,
  isCurrent = false
}: {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCompleted?: boolean;
  isCurrent?: boolean;
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
            <div className={`flex flex-col font-['Manrope:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-center text-nowrap ${getTextColor()}`}>
              <p className="block leading-[20px] whitespace-pre">{title}</p>
            </div>
            {isCompleted && (
              <div className="relative shrink-0 size-[15px] bg-[#04b440] rounded-full flex items-center justify-center">
                <CheckIcon />
              </div>
            )}
            {isCurrent && (
              <div className="relative shrink-0 size-[15px]">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
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

  const [selectedMediums, setSelectedMediums] = useState<string[]>(['sms', 'whatsapp', 'tab']);
  const [userCount, setUserCount] = useState<number | null>(null); // Default to null to show '-'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [allUsersEnabled, setAllUsersEnabled] = useState(true);
  const [currentTableData, setCurrentTableData] = useState<UserData[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<Array<{name: string, label: string}>>([]);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filterState, setFilterState] = useState({
    category: [] as string[],
    userType: [] as string[],
    visits: [] as string[],
    status: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [clearFilters, setClearFilters] = useState(false);
  const [isDataLoadedFromStorage, setIsDataLoadedFromStorage] = useState(false);

  // Load data from session storage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('audienceData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log('Loading data from session storage:', data);
        setSelectedMediums(data.selectedMediums || ['sms', 'whatsapp', 'tab']);
        setUserCount(data.userCount || null);
        setFilters(data.filters || {});
        setAllUsersEnabled(data.allUsersEnabled !== undefined ? data.allUsersEnabled : true);
        setFilterState(data.filterState || {
          category: [],
          userType: [],
          visits: [],
          status: []
        });
        setIsDataLoadedFromStorage(true);
      } catch (error) {
        console.error('Error loading audience data from session storage:', error);
      }
    }

    // Also load platform budget data if coming back from platform budget page
    const platformBudgetData = sessionStorage.getItem('platformBudgetData');
    if (platformBudgetData) {
      try {
        const data = JSON.parse(platformBudgetData);
        console.log('Loading platform budget data in audience page:', data);
        // Store the platform budget data for use when proceeding to next step
        sessionStorage.setItem('platformBudgetData', JSON.stringify(data));
      } catch (error) {
        console.error('Error loading platform budget data from session storage:', error);
      }
    }
  }, []);

  // Save data to session storage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      selectedMediums,
      userCount,
      filters,
      allUsersEnabled,
      filterState
    };
    sessionStorage.setItem('audienceData', JSON.stringify(dataToSave));
  }, [selectedMediums, userCount, filters, allUsersEnabled, filterState]);

  // Stepper data based on Figma design
  const stepperSteps = [
    { title: 'campaign type', icon: <CampaignIcon />, isCompleted: true },
    { title: 'Create campaign', icon: <MoneyIcon />, isCompleted: true },
    { title: 'Choose audience', icon: <UsersIcon />, isCurrent: true },
    { title: 'Platform & Budget', icon: <BagIcon />, isCompleted: false },
    { title: 'Schedule', icon: <CalendarIcon />, isCompleted: false }
  ];

  // Helper to map API response to UserData[]
  const mapApiDataToTable = (apiData: any[]): UserData[] => {
    return apiData.map((r: any) => {
      let status: 'Active' | 'In Active' = 'In Active';
      if (typeof r.status === 'string' && r.status.toLowerCase() === 'active') status = 'Active';
      return {
        id: r.user_id,
        mobile: r.mobile_number,
        categories: Array.isArray(r.category) ? r.category : [r.category],
        userType: r.user_type,
        visits: r.no_of_visits,
        status,
        addedOn: r.added_on,
      };
    });
  };

  // Fetch data from API with debouncing
  const fetchData = useCallback(async () => {
    if (!user?.accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('page_size', String(pageSize));
      if (filters.category && filters.category.length > 0) {
        filters.category.forEach((cat: string) => params.append('category', cat));
      }
      if (filters.userType) params.append('user_type', filters.userType);
      if (filters.no_of_visits_from !== undefined) params.append('no_of_visits_from', String(filters.no_of_visits_from));
      if (filters.no_of_visits_to !== undefined) params.append('no_of_visits_to', String(filters.no_of_visits_to));
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      const url = `https://api.tabapp.club/v1/dashboard-data-centre?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch data center data');
      const result = await response.json();
      setCurrentTableData(mapApiDataToTable(result.data));
      setTotal(result.total);

      // Only update userCount if data wasn't loaded from session storage
      if (!isDataLoadedFromStorage) {
        console.log('Updating userCount from API:', result.total);
        setUserCount(result.total);
      } else {
        console.log('Preserving userCount from session storage:', userCount);
      }

      if (result.categories && Array.isArray(result.categories)) {
        setCategories(result.categories);
      }

      // Reset the flag after API call so future calls can update userCount
      setIsDataLoadedFromStorage(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setUserCount(null);
      setCurrentTableData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [user?.accessToken, page, pageSize, filters]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
    };
  }, [fetchData]);

  // Reset clearFilters flag after it's been used
  useEffect(() => {
    if (clearFilters) {
      const timer = setTimeout(() => {
        setClearFilters(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [clearFilters]);

  const handleMediumToggle = (mediumId: string) => {
    setSelectedMediums(prev =>
      prev.includes(mediumId)
        ? prev.filter(id => id !== mediumId)
        : [...prev, mediumId]
    );
  };

  const handleAllUsersToggle = () => {
    const newAllUsersEnabled = !allUsersEnabled;
    setAllUsersEnabled(newAllUsersEnabled);

    if (newAllUsersEnabled) {
      // Batch all filter clearing operations to prevent multiple API calls
      setFilters({});
      setFilterState({
        category: [],
        userType: [],
        visits: [],
        status: []
      });
      setSearchTerm(''); // Also clear search term
      setClearFilters(true); // Trigger filter clearing in DataCenterFilters
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

    setFilterState(prev => ({
      ...prev,
      [filterType]: selectedIds
    }));

    // Convert to API format and update filters
    const apiFilters: any = {};
    if (filterType === 'category') {
      apiFilters.category = selectedIds;
    } else if (filterType === 'userType') {
      apiFilters.userType = selectedIds[0];
    } else if (filterType === 'visits') {
      // Parse visit ranges
      const visitRanges = selectedIds.map(id => {
        if (id === '1') return { from: 1, to: 1 };
        if (id === '2-5') return { from: 2, to: 5 };
        if (id === '6-10') return { from: 6, to: 10 };
        if (id === '11-20') return { from: 11, to: 20 };
        if (id === '21+') return { from: 21, to: 999 };
        return null;
      }).filter(Boolean);

      if (visitRanges.length > 0) {
        apiFilters.no_of_visits_from = Math.min(...visitRanges.map(r => r!.from));
        apiFilters.no_of_visits_to = Math.max(...visitRanges.map(r => r!.to));
      }
    } else if (filterType === 'status') {
      apiFilters.status = selectedIds[0];
    }

    handleFiltersChange(apiFilters);
  };

  const getSelectedCount = (filterType: string) => {
    return filterState[filterType as keyof typeof filterState]?.length || 0;
  };

  const handleFiltersChange = (newFilters: any) => {
    // Check if any filter is being applied
    const hasActiveFilters = Object.keys(newFilters).some(key => {
      const value = newFilters[key];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== undefined && value !== null && value !== '';
    });

    // Turn off "All users" toggle if any filter is applied
    if (hasActiveFilters && allUsersEnabled) {
      setAllUsersEnabled(false);
    }

    setFilters((prev: any) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

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
      if (selectedMediums.length === 0) {
        showWarning(
          'No Campaign Medium Selected',
          'Please select at least one campaign medium before proceeding.'
        );
        return;
      }

      if (!allUsersEnabled && Object.keys(filters).length === 0) {
        showWarning(
          'No Audience Selected',
          'Please either enable "All users" or select specific filters for your audience.'
        );
        return;
      }

      setIsLoading(true);
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Preserve platform budget data if it exists
      const platformBudgetData = sessionStorage.getItem('platformBudgetData');
      if (platformBudgetData) {
        try {
          const data = JSON.parse(platformBudgetData);
          // Update the campaign type to match current selection
          data.campaignType = campaignType;
          sessionStorage.setItem('platformBudgetData', JSON.stringify(data));
        } catch (error) {
          console.error('Error preserving platform budget data:', error);
        }
      }

      router.push(`/new-campaign/platform-budget?type=${campaignType}&medium=${selectedMediums.join(',')}`);
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
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-[24px] font-medium text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
                Campaigns
              </h1>
            </div>
          </div>
        </header>

        {/* Progress Indicator - Stepper */}
        <section className="mb-8 bg-white border border-[#e9e9e9] rounded-md p-2 overflow-x-auto">
          <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative rounded-md size-full">
            {stepperSteps.map((step, index) => (
              <StepperStep
                key={index}
                title={step.title}
                icon={step.icon}
                isCompleted={step.isCompleted}
                isCurrent={step.isCurrent}
              />
            ))}
          </div>
        </section>

        {/* User Count Display */}
        <section className="mb-8">
          <div className="bg-white rounded-lg border border-[#f1f1f4] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)] p-8">
            <div className="text-center">
              <p className="text-[#2a2a2f] text-base mb-4">Sending campaign to</p>
              <div className="text-[#2a2a2f] text-[48px] font-extrabold tracking-[-0.96px] leading-[1.4]">
                {userCount === null ? '-' : `${formatUserCount(userCount)} users`}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="mb-8 bg-white sticky top-0 z-10 border border-[#e9e9e9] rounded-lg">
          <div className="flex flex-row items-center justify-between p-4 h-[60px]">
            {/* All Users Toggle */}
            <div className="flex flex-row gap-2.5 items-center">
              <div className="font-medium text-[#a1a1a1] text-[14px] leading-[16px] tracking-[-0.13px]">
                All users
              </div>
              <div className="h-[18px] w-[30px] relative">
                <button
                  onClick={handleAllUsersToggle}
                  className={`relative inline-flex h-[18px] w-[30px] items-center rounded-full transition-colors ${
                    allUsersEnabled ? 'bg-[#7856ff]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-[14px] w-[14px] transform rounded-full bg-white transition-transform ${
                      allUsersEnabled ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* DataCenterFilters Component */}
            <div className="flex-1">
              <DataCenterFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onFiltersChange={handleFiltersChange}
                totalUsers={total}
                visibleUsers={currentTableData.length}
                categories={categories}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        </section>

        {/* Data Table */}
        <section className="bg-white rounded-lg border border-[#e9e9e9] flex-1 flex flex-col min-h-0 mb-20">
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="text-center py-10 text-[#a1a1a1]">Loading data...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : (
              <DataTable
                searchTerm={searchTerm}
                data={currentTableData}
              />
            )}
          </div>
          <Pagination
            currentPage={page}
            itemsPerPage={pageSize}
            totalItems={total}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handlePageSizeChange}
          />
        </section>

        {/* Navigation Bar */}
        <div className={`fixed bottom-0 bg-white border-t border-[#e9e9e9] px-2 lg:px-12 py-2 z-50 ${
          actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
        }`}>
          <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 items-center justify-between">
            <div className="flex flex-row gap-2 lg:gap-4 items-center">
              <button
                onClick={() => router.push('/campaigns')}
                className="h-8 px-2 lg:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[11px] lg:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Close
              </button>

            </div>
            <div className="flex flex-row gap-2 lg:gap-4 items-center">
              <button
                onClick={() => router.push(`/new-campaign/create?type=${campaignType}`)}
                className="h-8 px-2 lg:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[11px] lg:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleProceed}
                disabled={isLoading}
                className={`h-8 px-2 lg:px-4 py-1 rounded font-medium text-[11px] lg:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
                  !isLoading
                    ? 'bg-[#7856ff] text-white hover:bg-[#6a4fd8] shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Processing...' : 'Proceed to next step'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
