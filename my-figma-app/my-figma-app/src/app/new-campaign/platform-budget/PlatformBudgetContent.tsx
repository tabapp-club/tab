"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";
import { usePopup } from "@/contexts/PopupContext";
import { useAuth } from "@/contexts/AuthContext";

// Icons for the stepper
const CampaignIcon = () => (
 <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.0996 13.0009H19.0996C18.8163 13.0009 18.5789 12.9049 18.3876 12.7129C18.1963 12.5209 18.1003 12.2836 18.0996 12.0009C18.0989 11.7182 18.1949 11.4809 18.3876 11.2889C18.5803 11.0969 18.8176 11.0009 19.0996 11.0009H21.0996C21.3829 11.0009 21.6206 11.0969 21.8126 11.2889C22.0046 11.4809 22.1003 11.7182 22.0996 12.0009C22.0989 12.2836 22.0029 12.5212 21.8116 12.7139C21.6203 12.9066 21.3829 13.0022 21.0996 13.0009ZM16.6996 16.8009C16.8663 16.5676 17.0829 16.4342 17.3496 16.4009C17.6163 16.3676 17.8663 16.4342 18.0996 16.6009L19.6996 17.8009C19.9329 17.9676 20.0663 18.1842 20.0996 18.4509C20.1329 18.7176 20.0663 18.9676 19.8996 19.2009C19.7329 19.4342 19.5163 19.5676 19.2496 19.6009C18.9829 19.6342 18.7329 19.5676 18.4996 19.4009L16.8996 18.2009C16.6663 18.0342 16.5329 17.8176 16.4996 17.5509C16.4663 17.2842 16.5329 17.0342 16.6996 16.8009ZM19.6996 6.20091L18.0996 7.40091C17.8663 7.56758 17.6163 7.63424 17.3496 7.60091C17.0829 7.56758 16.8663 7.43424 16.6996 7.20091C16.5329 6.96758 16.4663 6.71758 16.4996 6.45091C16.5329 6.18424 16.6663 5.96758 16.8996 5.80091L18.4996 4.60091C18.7329 4.43424 18.9829 4.36758 19.2496 4.40091C19.5163 4.43424 19.7329 4.56758 19.8996 4.80091C20.0663 5.03424 20.1329 5.28424 20.0996 5.55091C20.0663 5.81758 19.9329 6.03424 19.6996 6.20091ZM5.09961 15.0009H4.09961C3.54961 15.0009 3.07894 14.8052 2.68761 14.4139C2.29628 14.0226 2.10028 13.5516 2.09961 13.0009V11.0009C2.09961 10.4509 2.29561 9.98024 2.68761 9.58891C3.07961 9.19758 3.55028 9.00158 4.09961 9.00091H8.09961L11.5746 6.90091C11.9079 6.70091 12.2456 6.70091 12.5876 6.90091C12.9296 7.10091 13.1003 7.39258 13.0996 7.77591V16.2259C13.0996 16.6092 12.9286 16.9009 12.5866 17.1009C12.2446 17.3009 11.9073 17.3009 11.5746 17.1009L8.09961 15.0009H7.09961V18.0009C7.09961 18.2842 7.00361 18.5219 6.81161 18.7139C6.61961 18.9059 6.38228 19.0016 6.09961 19.0009C5.81694 19.0002 5.57961 18.9042 5.38761 18.7129C5.19561 18.5216 5.09961 18.2842 5.09961 18.0009V15.0009ZM14.0996 15.3509V8.65091C14.5496 9.05091 14.9123 9.53858 15.1876 10.1139C15.4629 10.6892 15.6003 11.3182 15.5996 12.0009C15.5989 12.6836 15.4613 13.3129 15.1866 13.8889C14.9119 14.4649 14.5496 14.9522 14.0996 15.3509Z" fill="#04B440"/>
</svg>

);

const MoneyIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.2002 4.5H10.2002C6.42896 4.5 4.54334 4.5 3.37177 5.67157C2.52823 6.51511 2.29204 7.72882 2.22591 9.75H22.1745C22.1083 7.72882 21.8722 6.51511 21.0286 5.67157C19.857 4.5 17.9714 4.5 14.2002 4.5Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.2002 20.5H10.2002C6.42896 20.5 4.54334 20.5 3.37177 19.3284C2.2002 18.1569 2.2002 16.2712 2.2002 12.5C2.2002 12.0581 2.2002 11.642 2.20208 11.25H22.1983C22.2002 11.642 22.2002 12.0581 22.2002 12.5C22.2002 16.2712 22.2002 18.1569 21.0286 19.3284C19.857 20.5 17.9714 20.5 14.2002 20.5ZM16.2449 12.75C16.6778 12.7499 17.0746 12.7499 17.3974 12.7933C17.7529 12.8411 18.1286 12.9535 18.4376 13.2626C18.7467 13.5716 18.8591 13.9473 18.9069 14.3028C18.9503 14.6256 18.9502 15.0224 18.9502 15.4553V15.5447C18.9502 15.9776 18.9503 16.3744 18.9069 16.6972C18.8591 17.0527 18.7467 17.4284 18.4376 17.7374C18.1286 18.0465 17.7529 18.1589 17.3974 18.2067C17.0746 18.2501 16.6778 18.2501 16.2449 18.25L16.2002 18.25L16.1555 18.25C15.7226 18.2501 15.3258 18.2501 15.003 18.2067C14.6475 18.1589 14.2718 18.0465 13.9628 17.7374C13.6537 17.4284 13.5413 17.0527 13.4935 16.6972C13.4501 16.3744 13.4501 15.9776 13.4502 15.5447L13.4502 15.5L13.4502 15.4553C13.4501 15.0224 13.4501 14.6256 13.4935 14.3028C13.5413 13.9473 13.6537 13.5716 13.9628 13.2626C14.2718 12.9535 14.6475 12.8411 15.003 12.7933C15.3258 12.7499 15.7226 12.7499 16.1554 12.75H16.2449ZM5.4502 14C5.4502 13.5858 5.78598 13.25 6.2002 13.25H8.2002C8.61441 13.25 8.9502 13.5858 8.9502 14C8.9502 14.4142 8.61441 14.75 8.2002 14.75H6.2002C5.78598 14.75 5.4502 14.4142 5.4502 14ZM5.4502 17C5.4502 16.5858 5.78598 16.25 6.2002 16.25H10.2002C10.6144 16.25 10.9502 16.5858 10.9502 17C10.9502 17.4142 10.6144 17.75 10.2002 17.75H6.2002C5.78598 17.75 5.4502 17.4142 5.4502 17Z" fill="currentColor"/>
<path d="M15.0235 14.3232L15.0259 14.3219C15.0278 14.3209 15.0311 14.3192 15.0362 14.3172C15.0579 14.3082 15.1063 14.2929 15.2029 14.2799C15.4136 14.2516 15.7076 14.25 16.2002 14.25C16.6928 14.25 16.9868 14.2516 17.1975 14.2799C17.2941 14.2929 17.3425 14.3082 17.3642 14.3172C17.3693 14.3192 17.3726 14.3209 17.3745 14.3219L17.377 14.3232L17.3783 14.3257C17.3793 14.3276 17.381 14.3309 17.383 14.336C17.392 14.3577 17.4073 14.4061 17.4203 14.5027C17.4486 14.7134 17.4502 15.0074 17.4502 15.5C17.4502 15.9926 17.4486 16.2866 17.4203 16.4973C17.4073 16.5939 17.392 16.6423 17.383 16.664C17.381 16.6691 17.3793 16.6724 17.3783 16.6743L17.377 16.6768L17.3745 16.6781C17.3726 16.6791 17.3693 16.6808 17.3642 16.6828C17.3425 16.6918 17.2941 16.7071 17.1975 16.7201C16.9868 16.7484 16.6928 16.75 16.2002 16.75C15.7076 16.75 15.4136 16.7484 15.2029 16.7201C15.1063 16.7071 15.0579 16.6918 15.0362 16.6828C15.0311 16.6808 15.0278 16.6791 15.0259 16.6781L15.0234 16.6768L15.0221 16.6743C15.021 16.6724 15.0194 16.6691 15.0174 16.664C15.0084 16.6423 14.9931 16.5939 14.9801 16.4973C14.9518 16.2866 14.9502 15.9926 14.9502 15.5C14.9502 15.0074 14.9518 14.7134 14.9801 14.5027C14.9931 14.4061 15.0084 14.3577 15.0174 14.336C15.0194 14.3309 15.021 14.3276 15.0221 14.3257L15.0235 14.3232Z" fill="currentColor"/>
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
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.8329 14.3459C19.8329 18.5916 15.9858 20.5002 10.6 20.5002C5.21433 20.5002 1.36719 18.5916 1.36719 14.3759C1.36719 9.76018 3.67576 7.42161 8.29147 5.08304L6.65719 2.03875C6.55968 1.88627 6.50538 1.71019 6.50008 1.52927C6.49478 1.34836 6.53868 1.1694 6.62711 1.01147C6.71553 0.853546 6.84515 0.72258 7.00215 0.632536C7.15916 0.542492 7.33766 0.496748 7.51862 0.50018H14.0429C14.2125 0.50452 14.3782 0.551947 14.5245 0.637997C14.6707 0.724047 14.7926 0.84589 14.8788 0.99206C14.965 1.13823 15.0125 1.30392 15.017 1.47353C15.0214 1.64315 14.9827 1.81111 14.9043 1.96161L12.9086 5.08304C17.5229 7.39018 19.8329 9.72875 19.8329 14.3459ZM7.68147 9.78589H10.0858C10.2858 9.84589 10.5372 9.95732 10.7386 10.143C10.8894 10.2798 11.0008 10.4544 11.0615 10.6488H7.6829C7.5891 10.6488 7.49622 10.6672 7.40956 10.7031C7.3229 10.739 7.24415 10.7916 7.17782 10.858C7.1115 10.9243 7.05888 11.003 7.02299 11.0897C6.98709 11.1764 6.96862 11.2692 6.96862 11.363C6.96862 11.4568 6.98709 11.5497 7.02299 11.6364C7.05888 11.723 7.1115 11.8018 7.17782 11.8681C7.24415 11.9344 7.3229 11.9871 7.40956 12.023C7.49622 12.0588 7.5891 12.0773 7.6829 12.0773H10.8358C10.5903 12.35 10.2789 12.5552 9.93147 12.673C9.48365 12.8366 9.01234 12.9268 8.53576 12.9402H8.51433C8.36893 12.9403 8.22703 12.9848 8.10759 13.0677C7.98815 13.1507 7.89686 13.2681 7.84593 13.4042C7.79499 13.5404 7.78684 13.6889 7.82254 13.8299C7.85825 13.9708 7.93612 14.0975 8.04576 14.193L8.04862 14.1959L8.05576 14.2002L8.07433 14.2173C8.17571 14.3033 8.28006 14.3857 8.38719 14.4645C9.61907 15.3844 11.02 16.0528 12.51 16.4316C12.6018 16.4568 12.6978 16.4634 12.7921 16.4509C12.8865 16.4385 12.9775 16.4074 13.0596 16.3593C13.1418 16.3112 13.2135 16.2472 13.2706 16.171C13.3277 16.0948 13.3689 16.008 13.392 15.9157C13.415 15.8233 13.4194 15.7273 13.4048 15.6332C13.3902 15.5391 13.3569 15.4489 13.307 15.3679C13.257 15.2869 13.1914 15.2166 13.1139 15.1613C13.0364 15.106 12.9486 15.0668 12.8558 15.0459C11.9819 14.8217 11.1414 14.4836 10.3558 14.0402L10.4329 14.0116C10.9158 13.8302 11.4472 13.5416 11.8615 13.0745C12.1115 12.7959 12.3072 12.463 12.4286 12.0773H13.5172C13.7066 12.0773 13.8883 12.0021 14.0223 11.8681C14.1562 11.7342 14.2315 11.5525 14.2315 11.363C14.2315 11.1736 14.1562 10.9919 14.0223 10.858C13.8883 10.724 13.7066 10.6488 13.5172 10.6488H12.5258C12.4806 10.3473 12.385 10.0556 12.2429 9.78589H13.5172C13.7066 9.78589 13.8883 9.71064 14.0223 9.57668C14.1562 9.44273 14.2315 9.26105 14.2315 9.07161C14.2315 8.88217 14.1562 8.70049 14.0223 8.56653C13.8883 8.43258 13.7066 8.35732 13.5172 8.35732H7.6829C7.49346 8.35732 7.31178 8.43258 7.17782 8.56653C7.04387 8.70049 6.96862 8.88217 6.96862 9.07161C6.96862 9.26105 7.04387 9.44273 7.17782 9.57668C7.31178 9.71064 7.49346 9.78589 7.6829 9.78589H7.68147Z" fill="currentColor"/>
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

const TemplateIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 15H11V8.99999H9V15ZM9.99999 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28266 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 9.99999 5C9.71666 5 9.47933 5.096 9.288 5.288C9.09666 5.48 9.00066 5.71733 9 6C8.99933 6.28266 9.09533 6.52033 9.288 6.713C9.48066 6.90566 9.71799 7.00133 9.99999 7ZM9.99999 20C8.61666 20 7.31666 19.7373 6.1 19.212C4.88333 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667932 11.3827 1.26582e-06 9.99999C-0.0006654 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88266 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 9.99999 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88266 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 9.99999C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 9.99999 20Z" fill="#D8D8D8" />
  </svg>
);

const RocketIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#7856FF" fill-opacity="0.1"/>
<path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#7856FF" stroke-opacity="0.2"/>
<path opacity="0.3" d="M30.8084 11.0238L26.9186 11.7271C24.9485 12.2533 23.1568 13.301 21.7322 14.7598C19.4576 17.1333 16.9193 22.2208 15.9084 24.3415C15.7789 24.6216 15.74 24.9352 15.7971 25.2385C15.8542 25.5419 16.0045 25.8198 16.2271 26.0337L18.4907 28.2313C18.7108 28.4456 18.9932 28.5845 19.2973 28.6279C19.6015 28.6714 19.9115 28.6171 20.1828 28.473C23.4639 26.8145 26.5426 24.7829 29.3579 22.4186C30.8432 20.9147 31.8456 19.0016 32.2368 16.9245L32.9401 13.2215C32.9969 12.9264 32.9818 12.622 32.8959 12.334C32.81 12.0461 32.6559 11.7831 32.4467 11.5674C32.2374 11.3517 31.9793 11.1897 31.6941 11.095C31.4089 11.0004 31.105 10.976 30.8084 11.0238ZM28.2152 18.9243C27.9156 19.2409 27.5287 19.4612 27.1036 19.5574C26.6785 19.6535 26.2345 19.6211 25.8279 19.4642C25.4212 19.3073 25.0705 19.0331 24.8201 18.6764C24.5697 18.3196 24.4311 17.8965 24.4218 17.4608C24.4125 17.0251 24.5329 16.5964 24.7678 16.2293C25.0028 15.8622 25.3415 15.5733 25.7411 15.3992C26.1406 15.2251 26.5829 15.1737 27.0117 15.2516C27.4405 15.3295 27.8365 15.5332 28.1492 15.8366C28.5641 16.2392 28.8037 16.789 28.816 17.367C28.8284 17.9449 28.6125 18.5044 28.2152 18.9243Z" fill="#7856FF"/>
<path d="M19.1176 18.3421L16.0628 24.0669L11.0303 23.946C11.0303 23.946 15.2387 17.518 19.1176 18.3421ZM26.5016 24.6493L21.0075 28.0116L21.3482 33.0003C21.3482 33.0003 27.5125 28.4731 26.5016 24.6493ZM26.6115 15.2324C26.1768 15.2324 25.7519 15.3613 25.3905 15.6028C25.0291 15.8443 24.7475 16.1875 24.5811 16.5891C24.4148 16.9906 24.3713 17.4325 24.4561 17.8588C24.5409 18.2851 24.7502 18.6767 25.0575 18.984C25.3649 19.2914 25.7564 19.5007 26.1827 19.5855C26.609 19.6703 27.0509 19.6267 27.4525 19.4604C27.854 19.2941 28.1973 19.0124 28.4387 18.651C28.6802 18.2896 28.8091 17.8647 28.8091 17.4301C28.8091 16.8472 28.5776 16.2882 28.1654 15.8761C27.7533 15.464 27.1943 15.2324 26.6115 15.2324Z" fill="#7856FF"/>
</svg>

);

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
    <div className="flex flex-col gap-2 grow items-center justify-center p-2">
      <div className={`flex flex-row gap-4 items-start justify-start relative shrink-0 w-full`}>
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
            {(isCompleted || isCurrent) && (
              <div className="overflow-clip relative shrink-0 size-[15px]">
                <CheckIcon />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlatformCard {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  features: string[];
  usedBy: string;
  enabled: boolean;
  isRecommended?: boolean;
}

const platforms: PlatformCard[] = [
  {
    id: 'tab',
    name: 'tab - campaigns',
    subtitle: 'Recommend for transaction',
    description: 'Tab Campaigns are AI-driven, hyper-personalized campaigns based on real-time invoice data from your business. Instead of sending mass messages, Tab knows what to sell, to whom, and when.',
    features: [
      '✅ Data-driven: Based on actual buying behaviour, not guesswork.',
      '✅ High ROI: Targets only relevant customers with the right product.',
      '✅ Fully automated: No need to manually create or manage lists.',
      '✅ Hyper-personalised per customer',
      '✅ Works without relying on external platforms'
    ],
    usedBy: '✅ Used by 5,000+ businesses',
    enabled: true,
    isRecommended: true
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    subtitle: 'Recommend for transaction',
    description: 'A bulk messaging tool that lets you send promotional messages via WhatsApp to a customer list.',
    features: [
      '❌ Requires template approvals from WhatsApp',
      '❌ Customers must have WhatsApp and opt-in',
      '❌ Expensive per message (₹0.30 to ₹0.80 per message)',
      '❌ Needs constant manual creation or integration setup'
    ],
    usedBy: '✅ Used by 5,000+ businesses',
    enabled: true
  },
  {
    id: 'sms',
    name: 'SMS',
    subtitle: 'Recommend for transaction',
    description: 'A bulk messaging tool that lets you send promotional messages via WhatsApp to a customer list.',
    features: [
      '❌ Low visibility (many users ignore or block promotional SMS)',
      '❌ Cannot include rich content or dynamic actions',
      '❌ High spam filtering',
      '❌ Per-message cost (₹0.10 to ₹0.30)'
    ],
    usedBy: '✅ Used by 5,000+ businesses',
    enabled: false
  }
];

export function PlatformBudgetContent() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { showPopup } = usePopup();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tab']);
  const [campaignBudget, setCampaignBudget] = useState(295700);

  // Load data from session storage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('platformBudgetData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setSelectedPlatforms(data.selectedPlatforms || ['tab']);
        setCampaignBudget(data.campaignBudget || 295700);
      } catch (error) {
        console.error('Error loading platform budget data from session storage:', error);
      }
    }
  }, []);

  // Initialize selected platforms from URL parameters (after session storage load)
  useEffect(() => {
    const platformsParam = searchParams.get('platforms');
    if (platformsParam) {
      const platforms = platformsParam.split(',').filter(p => p.trim() !== '');
      if (platforms.length > 0) {
        setSelectedPlatforms(platforms);
      }
    }
  }, [searchParams]);

  // Save data to session storage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      selectedPlatforms,
      campaignBudget
    };
    sessionStorage.setItem('platformBudgetData', JSON.stringify(dataToSave));
  }, [selectedPlatforms, campaignBudget]);

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  const handleBack = () => {
    // Preserve query parameters when going back
    const campaignType = searchParams.get('type') || 'advertise';
    const selectedMedium = searchParams.get('medium') || '';

    const newSearchParams = new URLSearchParams();
    newSearchParams.set('type', campaignType);
    if (selectedMedium) {
      newSearchParams.set('medium', selectedMedium);
    }

    router.push(`/new-campaign/audience?${newSearchParams.toString()}`);
  };

  const handleNext = () => {
    // Get existing query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const campaignType = searchParams.get('type') || 'advertise';
    const selectedMedium = searchParams.get('medium') || '';

    // Add selected platforms to the URL
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('type', campaignType);
    if (selectedMedium) {
      newSearchParams.set('medium', selectedMedium);
    }
    if (selectedPlatforms.length > 0) {
      newSearchParams.set('platforms', selectedPlatforms.join(','));
    }

    router.push(`/new-campaign/schedule?${newSearchParams.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getBudgetForPlatform = (platformId: string) => {
    if (platformId === 'tab') return 295700;
    if (platformId === 'whatsapp') return 295700;
    return 0;
  };

  const totalBudget = selectedPlatforms.reduce((total, platformId) => {
    return total + getBudgetForPlatform(platformId);
  }, 0);

  return (
    <main className={`flex-1 transition-sidebar ${
      isCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-8 h-screen pb-20">
                  {/* Header */}
          <header className="mb-4 sm:mb-6 lg:mb-8 pt-8 lg:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-[24px] font-medium text-[#2a2a2f] leading-tight tracking-[-0.1px]">
                Campaigns
              </h1>
            </div>
          </div>
        </header>

        {/* Stepper */}
        <section className="mb-4 sm:mb-6 lg:mb-8 rounded-md bg-white border border-[#e9e9e9] box-border overflow-hidden">
          <div className="p-2">
            <div className="flex flex-col sm:flex-row gap-2 items-center justify-between overflow-x-auto">
              <StepperStep
                title="campaign type"
                icon={<CampaignIcon />}
                isCompleted={true}
              />
              <StepperStep
                title="Create campaign"
                icon={<MoneyIcon />}
                isCompleted={true}
              />
              <StepperStep
                title="Choose audience"
                icon={<UsersIcon />}
                isCompleted={true}
              />
              <StepperStep
                title="Platform & Budget"
                icon={<BagIcon />}
                isCurrent={true}
              />
              <StepperStep
                title="Schedule"
                icon={<CalendarIcon />}
              />
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {/* Platform Selection Cards */}
          <div className="flex flex-row gap-3 items-center justify-start p-0 relative shrink-0 w-full">
            {/* Tab Campaigns Card */}
            <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative rounded-lg shrink-0 w-[436px]">
              <div
                aria-hidden="true"
                className="absolute border-[#e9e9e9] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)]"
              />
              <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[16px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full">
                <div
                  aria-hidden="true"
                  className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px]"
                />
                <div className="basis-0 box-border content-stretch flex flex-row gap-2.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                  <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0">
                    <RocketIcon />
                  </div>
                  <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
                    <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center p-0 relative shrink-0 w-[204.75px]">
                      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center leading-[0] p-0 relative shrink-0 text-left text-nowrap">
                        <div className="font-['Manrope:Bold',_sans-serif] font-bold relative shrink-0 text-[#2a2a2f] text-[16px]">
                          <p className="block leading-[16px] text-nowrap whitespace-pre">
                            tab - campaigns
                          </p>
                        </div>
                        <div className="font-['Manrope:Light',_sans-serif] font-light relative shrink-0 text-[#626266] text-[12px]">
                          <p className="block leading-[16px] text-nowrap whitespace-pre">
                            Recommend for transcation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 size-5">
                  <TemplateIcon />
                </div>
              </div>
              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full">
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative shrink-0 w-full">
                  <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#9a9a9a] text-[12px] text-left">
                    <p className="block leading-[1.4]">
                      Tab Campaigns are AI-driven, hyper-personalized campaigns
                      based on real-time invoice data from your business. Instead
                      of sending mass messages, Tab knows what to sell, to whom,
                      and when.
                    </p>
                  </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative shrink-0 w-full">
                  <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[1.8] min-h-px min-w-px relative shrink-0 text-[#9a9a9a] text-[12px] text-left whitespace-pre-wrap">
                    <p className="block mb-0">{`✅  Data-driven: Based on actual buying behaviour, not guesswork.`}</p>
                    <p className="block mb-0">{`✅  High ROI: Targets only relevant customers with the right product.`}</p>
                    <p className="block mb-0">{`✅  Fully automated: No need to manually create or manage lists.`}</p>
                    <p className="block mb-0">{`✅  Hyper-personalised per customer`}</p>
                    <p className="block">{`✅  Works without relying on external platforms`}</p>
                  </div>
                </div>
              </div>
              <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-[16px] relative shrink-0 w-full">
                <div
                  aria-hidden="true"
                  className="absolute border-[#e9e9e9] border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                />
                <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#2a2a2f] text-[12px] text-left">
                  <p className="block leading-[1.4]">
                    ✅ Used by 5,000+ businesses
                  </p>
                </div>
                <div className="box-border content-stretch flex flex-col gap-2.5 h-[18px] items-center justify-start pl-[30px] pr-0 py-0 relative shrink-0">
                  <div className="h-[18px] relative shrink-0 w-[30px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={selectedPlatforms.includes('tab')}
                        onChange={() => handlePlatformToggle('tab')}
                      />
                      <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7856ff]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
              <div className="basis-0 bg-[#ffffff] box-border content-stretch flex flex-col gap-4 grow h-full items-start justify-start min-h-px min-w-px p-0 relative rounded-lg shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute border-[#e9e9e9] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)]"
                />
                <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[16px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full">
                  <div
                    aria-hidden="true"
                    className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px]"
                  />
                  <div className="basis-0 box-border content-stretch flex flex-row gap-2.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0">
                     <RocketIcon />
                    </div>
                    <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
                      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center p-0 relative shrink-0 w-[204.75px]">
                        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center leading-[0] p-0 relative shrink-0 text-left text-nowrap">
                          <div className="font-['Manrope:Bold',_sans-serif] font-bold relative shrink-0 text-[#2a2a2f] text-[16px]">
                            <p className="block leading-[16px] text-nowrap whitespace-pre">
                              WhatsApp
                            </p>
                          </div>
                          <div className="font-['Manrope:Light',_sans-serif] font-light relative shrink-0 text-[#626266] text-[12px]">
                            <p className="block leading-[16px] text-nowrap whitespace-pre">
                              Recommend for transcation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-5">
                    <TemplateIcon/>
                  </div>
                </div>
                <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative shrink-0 w-full">
                    <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#9a9a9a] text-[12px] text-left">
                      <p className="block leading-[1.4]">
                        A bulk messaging tool that lets you send promotional
                        messages via WhatsApp to a customer list.
                      </p>
                    </div>
                  </div>
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative shrink-0 w-full">
                    <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[1.8] min-h-px min-w-px relative shrink-0 text-[#9a9a9a] text-[12px] text-left whitespace-pre-wrap">
                      <p className="block mb-0">{`❌  Requires template approvals from WhatsApp`}</p>
                      <p className="block mb-0">{`❌  Customers must have WhatsApp and opt-in`}</p>
                      <p className="block mb-0">{`❌  Expensive per message (₹0.30 to ₹0.80 per message)`}</p>
                      <p className="block">{`❌  Needs constant manual creation or integration setup`}</p>
                    </div>
                  </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-[16px] relative shrink-0 w-full">
                  <div
                    aria-hidden="true"
                    className="absolute border-[#e9e9e9] border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                  />
                  <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#2a2a2f] text-[12px] text-left">
                    <p className="block leading-[1.4]">
                      ✅ Used by 5,000+ businesses
                    </p>
                  </div>
                  <div className="box-border content-stretch flex flex-col gap-2.5 h-[18px] items-center justify-start pl-[30px] pr-0 py-0 relative shrink-0">
                    <div className="h-[18px] relative shrink-0 w-[30px]">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={selectedPlatforms.includes('whatsapp')}
                          onChange={() => handlePlatformToggle('whatsapp')}
                        />
                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7856ff]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SMS Card */}
            <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
              <div className="basis-0 bg-[#ffffff] box-border content-stretch flex flex-col gap-4 grow h-full items-start justify-start min-h-px min-w-px p-0 relative rounded-lg shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute border-[#e9e9e9] border-[0.5px] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)]"
                />
                <div className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[16px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-full">
                  <div
                    aria-hidden="true"
                    className="absolute border border-neutral-100 border-solid inset-0 pointer-events-none rounded-tl-[8px] rounded-tr-[8px]"
                  />
                  <div className="basis-0 box-border content-stretch flex flex-row gap-2.5 grow items-center justify-start min-h-px min-w-px p-0 relative shrink-0">
                    <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0">
                     <RocketIcon />
                    </div>
                    <div className="basis-0 box-border content-stretch flex flex-col gap-1 grow items-start justify-center min-h-px min-w-px p-0 relative shrink-0">
                      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center p-0 relative shrink-0 w-[204.75px]">
                        <div className="box-border content-stretch flex flex-col gap-1 items-start justify-center leading-[0] p-0 relative shrink-0 text-left text-nowrap">
                          <div className="font-['Manrope:Bold',_sans-serif] font-bold relative shrink-0 text-[#2a2a2f] text-[16px]">
                            <p className="block leading-[16px] text-nowrap whitespace-pre">
                              SMS
                            </p>
                          </div>
                          <div className="font-['Manrope:Light',_sans-serif] font-light relative shrink-0 text-[#626266] text-[12px]">
                            <p className="block leading-[16px] text-nowrap whitespace-pre">
                              Recommend for transcation
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative shrink-0 size-5">
                    <TemplateIcon/>
                  </div>
                </div>
                <div className="basis-0 box-border content-stretch flex flex-col gap-2 grow items-start justify-start min-h-px min-w-px p-0 relative shrink-0 w-full">
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative shrink-0 w-full">
                    <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#9a9a9a] text-[12px] text-left">
                      <p className="block leading-[1.4]">
                        A bulk messaging tool that lets you send promotional
                        messages via WhatsApp to a customer list.
                      </p>
                    </div>
                  </div>
                  <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative shrink-0 w-full">
                    <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[1.8] min-h-px min-w-px relative shrink-0 text-[#9a9a9a] text-[12px] text-left">
                      <p className="block mb-0">
                        ❌ Low visibility (many users ignore or block promotional
                        SMS)
                      </p>
                      <p className="block mb-0">
                        ❌ Cannot include rich content or dynamic actions
                      </p>
                      <p className="block mb-0">❌ High spam filtering</p>
                      <p className="block">
                        ❌ Per-message cost (₹0.10 to ₹0.30)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-[16px] relative shrink-0 w-full">
                  <div
                    aria-hidden="true"
                    className="absolute border-[#e9e9e9] border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
                  />
                  <div className="basis-0 font-['Manrope:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[#2a2a2f] text-[12px] text-left">
                    <p className="block leading-[1.4]">
                      ✅ Used by 5,000+ businesses
                    </p>
                  </div>
                  <div className="box-border content-stretch flex flex-col gap-2.5 h-[18px] items-center justify-start pl-[30px] pr-0 py-0 relative shrink-0">
                    <div className="h-[18px] relative shrink-0 w-[30px]">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={selectedPlatforms.includes('sms')}
                          onChange={() => handlePlatformToggle('sms')}
                        />
                        <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[0px] after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#7856ff]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-row h-40 items-start justify-start pl-0 pr-px py-0 relative rounded-lg shrink-0 w-full mb-16">
            <div
              aria-hidden="true"
              className="absolute border border-[#e9e9e9] border-solid inset-0 pointer-events-none rounded-lg shadow-[0px_3px_4px_0px_rgba(0,0,0,0.03)]"
            />
            <div className="basis-0 box-border content-stretch flex flex-col grow items-center justify-start min-h-px min-w-px mr-[-1px] p-0 relative shrink-0">
              <div
                aria-hidden="true"
                className="absolute border-[#e9e9e9] border-[0px_1px_0px_0px] border-solid bottom-0 left-0 pointer-events-none right-[-1px] top-0"
              />
              <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative shrink-0 w-full">
                <div className="basis-0 grow min-h-px min-w-px relative rounded-bl-[8px] rounded-tl-[8px] shrink-0">
                  <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative w-full">
                    <div className="bg-[#f6f6f6] box-border content-stretch flex flex-row gap-1 h-10 items-center justify-start px-5 py-0 relative shrink-0 w-full">
                      <div
                        aria-hidden="true"
                        className="absolute border-[#e9e9e9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none"
                      />
                      <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#626266] text-[13px] text-left text-nowrap">
                        <p className="block leading-[14px] whitespace-pre">
                          Mode
                        </p>
                      </div>
                    </div>
                                         {platforms.map((platform) => (
                       <div key={platform.id} className="box-border content-stretch flex flex-row gap-2.5 h-10 items-center justify-start px-5 py-0 relative shrink-0 w-full">
                         <div
                           aria-hidden="true"
                           className="absolute border-[#e9e9e9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none"
                         />
                         <div className="overflow-clip relative shrink-0 size-[15px]">
                           {selectedPlatforms.includes(platform.id) ? (
                             <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0ZM6.5 11.5L2.5 7.5L3.5 6.5L6.5 9.5L11.5 4.5L12.5 5.5L6.5 11.5Z" fill="#04b440"/>
                             </svg>
                           ) : (
                             <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                               <path d="M7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0ZM7.5 13.5C4.18629 13.5 1.5 10.8137 1.5 7.5C1.5 4.18629 4.18629 1.5 7.5 1.5C10.8137 1.5 13.5 4.18629 13.5 7.5C13.5 10.8137 10.8137 13.5 7.5 13.5ZM7.5 4.5C7.91421 4.5 8.25 4.83579 8.25 5.25V7.5C8.25 7.91421 7.91421 8.25 7.5 8.25C7.08579 8.25 6.75 7.91421 6.75 7.5V5.25C6.75 4.83579 7.08579 4.5 7.5 4.5ZM7.5 9.75C7.91421 9.75 8.25 10.0858 8.25 10.5C8.25 10.9142 7.91421 11.25 7.5 11.25C7.08579 11.25 6.75 10.9142 6.75 10.5C6.75 10.0858 7.08579 9.75 7.5 9.75Z" fill="#ff6b35"/>
                             </svg>
                           )}
                         </div>
                         <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#2a2a2f] text-[14px] text-left text-nowrap">
                           <p className="block leading-[1.4] whitespace-pre">
                             {platform.name}
                           </p>
                         </div>
                       </div>
                     ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute border-[#e9e9e9] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none rounded-bl-[8px] rounded-tl-[8px]"
                  />
                </div>
                <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
                  <div className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative w-full">
                    <div className="bg-[#f6f6f6] box-border content-stretch flex flex-row gap-1 h-10 items-center justify-start px-5 py-0 relative shrink-0 w-full">
                      <div
                        aria-hidden="true"
                        className="absolute border-[#e9e9e9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none"
                      />
                      <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#626266] text-[13px] text-left text-nowrap">
                        <p className="block leading-[14px] whitespace-pre">
                          Budget
                        </p>
                      </div>
                    </div>
                                         {platforms.map((platform) => (
                       <div key={platform.id} className="box-border content-stretch flex flex-row gap-2.5 h-10 items-center justify-start px-5 py-0 relative shrink-0 w-full">
                         <div
                           aria-hidden="true"
                           className="absolute border-[#e9e9e9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none"
                         />
                         <div className="font-['Manrope:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#2a2a2f] text-[14px] text-left text-nowrap">
                           <p className="block leading-[1.4] whitespace-pre">
                             {selectedPlatforms.includes(platform.id)
                               ? formatCurrency(getBudgetForPlatform(platform.id))
                               : '-'
                             }
                           </p>
                         </div>
                       </div>
                     ))}
                  </div>
                  <div
                    aria-hidden="true"
                    className="absolute border-[#e9e9e9] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <div className="basis-0 box-border content-stretch flex flex-col gap-5 grow h-full items-center justify-center min-h-px min-w-px mr-[-1px] pb-[30px] pt-5 px-[30px] relative shrink-0">
              <div
                aria-hidden="true"
                className="absolute border-[#e9e9e9] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none"
              />
              <div className="box-border content-stretch flex flex-col gap-5 items-center justify-center p-0 relative shrink-0">
                <div className="box-border content-stretch flex flex-col gap-4 items-center justify-center p-0 relative shrink-0">
                  <div className="font-['Manrope:Regular',_sans-serif] font-normal h-[18px] leading-[0] relative shrink-0 text-[#2a2a2f] text-[16px] text-left w-40">
                    <p className="block leading-[14px]">Campaign budget</p>
                  </div>
                  <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-0 relative shrink-0">
                                         <div className="font-['Manrope:ExtraBold',_sans-serif] font-extrabold leading-[0] relative shrink-0 text-[#2a2a2f] text-[48px] text-left text-nowrap tracking-[-0.96px]">
                       <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">{formatCurrency(totalBudget)}</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className={`fixed bottom-0 bg-white border-t border-[#e9e9e9] px-4 sm:px-12 py-2 z-50 ${
          isCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-row gap-4 items-center">
              <button
                onClick={() => router.push('/campaigns')}
                className="h-8 px-4 py-1 border border-[#e9e9e9] rounded text-[#2a2a2f] text-[14px] font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <button
                onClick={handleBack}
                className="h-8 px-4 py-1 border border-[#e9e9e9] rounded text-[#2a2a2f] text-[14px] font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="h-8 px-4 py-1 bg-[#7856ff] text-white text-[14px] font-medium rounded hover:bg-[#6a4de8] transition-colors"
              >
                Proceed to next step
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
