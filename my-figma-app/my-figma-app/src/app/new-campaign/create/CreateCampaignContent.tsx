"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { MobileMenuToggle } from "@/components/MobileMenuToggle";
import { useSidebar } from "@/components/SidebarContext";

interface FormData {
  campaignTitle: string;
  uploadImage: string;
  ctaText: string;
  headline?: string;
  description?: string;
  offerText?: string;
  surveyTitle?: string;
  surveyDescription?: string;
  incentive?: string;
  surveyQuestions?: SurveyQuestion[];
}

interface SurveyQuestion {
  id: string;
  type: 'text' | 'rating' | 'multiple_choice';
  question: string;
  options?: string[];
  required: boolean;
}

interface CampaignField {
  id: keyof FormData;
  label: string;
  placeholder: string;
  required: boolean;
  type: 'text' | 'file' | 'survey_questions';
}

// Icons for the stepper based on Figma design
const CampaignIcon = () => (
 <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.0996 13.0009H19.0996C18.8163 13.0009 18.5789 12.9049 18.3876 12.7129C18.1963 12.5209 18.1003 12.2836 18.0996 12.0009C18.0989 11.7182 18.1949 11.4809 18.3876 11.2889C18.5803 11.0969 18.8176 11.0009 19.0996 11.0009H21.0996C21.3829 11.0009 21.6206 11.0969 21.8126 11.2889C22.0046 11.4809 22.1003 11.7182 22.0996 12.0009C22.0989 12.2836 22.0029 12.5212 21.8116 12.7139C21.6203 12.9066 21.3829 13.0022 21.0996 13.0009ZM16.6996 16.8009C16.8663 16.5676 17.0829 16.4342 17.3496 16.4009C17.6163 16.3676 17.8663 16.4342 18.0996 16.6009L19.6996 17.8009C19.9329 17.9676 20.0663 18.1842 20.0996 18.4509C20.1329 18.7176 20.0663 18.9676 19.8996 19.2009C19.7329 19.4342 19.5163 19.5676 19.2496 19.6009C18.9829 19.6342 18.7329 19.5676 18.4996 19.4009L16.8996 18.2009C16.6663 18.0342 16.5329 17.8176 16.4996 17.5509C16.4663 17.2842 16.5329 17.0342 16.6996 16.8009ZM19.6996 6.20091L18.0996 7.40091C17.8663 7.56758 17.6163 7.63424 17.3496 7.60091C17.0829 7.56758 16.8663 7.43424 16.6996 7.20091C16.5329 6.96758 16.4663 6.71758 16.4996 6.45091C16.5329 6.18424 16.6663 5.96758 16.8996 5.80091L18.4996 4.60091C18.7329 4.43424 18.9829 4.36758 19.2496 4.40091C19.5163 4.43424 19.7329 4.56758 19.8996 4.80091C20.0663 5.03424 20.1329 5.28424 20.0996 5.55091C20.0663 5.81758 19.9329 6.03424 19.6996 6.20091ZM5.09961 15.0009H4.09961C3.54961 15.0009 3.07894 14.8052 2.68761 14.4139C2.29628 14.0226 2.10028 13.5516 2.09961 13.0009V11.0009C2.09961 10.4509 2.29561 9.98024 2.68761 9.58891C3.07961 9.19758 3.55028 9.00158 4.09961 9.00091H8.09961L11.5746 6.90091C11.9079 6.70091 12.2456 6.70091 12.5876 6.90091C12.9296 7.10091 13.1003 7.39258 13.0996 7.77591V16.2259C13.0996 16.6092 12.9286 16.9009 12.5866 17.1009C12.2446 17.3009 11.9073 17.3009 11.5746 17.1009L8.09961 15.0009H7.09961V18.0009C7.09961 18.2842 7.00361 18.5219 6.81161 18.7139C6.61961 18.9059 6.38228 19.0016 6.09961 19.0009C5.81694 19.0002 5.57961 18.9042 5.38761 18.7129C5.19561 18.5216 5.09961 18.2842 5.09961 18.0009V15.0009ZM14.0996 15.3509V8.65091C14.5496 9.05091 14.9123 9.53858 15.1876 10.1139C15.4629 10.6892 15.6003 11.3182 15.5996 12.0009C15.5989 12.6836 15.4613 13.3129 15.1866 13.8889C14.9119 14.4649 14.5496 14.9522 14.0996 15.3509Z" fill="#04B440"/>
</svg>

);

const MoneyIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.2002 4.5H10.2002C6.42896 4.5 4.54334 4.5 3.37177 5.67157C2.52823 6.51511 2.29204 7.72882 2.22591 9.75H22.1745C22.1083 7.72882 21.8722 6.51511 21.0286 5.67157C19.857 4.5 17.9714 4.5 14.2002 4.5Z" fill="#7856FF"/>
<path fillRule="evenodd" clipRule="evenodd" d="M14.2002 20.5H10.2002C6.42896 20.5 4.54334 20.5 3.37177 19.3284C2.2002 18.1569 2.2002 16.2712 2.2002 12.5C2.2002 12.0581 2.2002 11.642 2.20208 11.25H22.1983C22.2002 11.642 22.2002 12.0581 22.2002 12.5C22.2002 16.2712 22.2002 18.1569 21.0286 19.3284C19.857 20.5 17.9714 20.5 14.2002 20.5ZM16.2449 12.75C16.6778 12.7499 17.0746 12.7499 17.3974 12.7933C17.7529 12.8411 18.1286 12.9535 18.4376 13.2626C18.7467 13.5716 18.8591 13.9473 18.9069 14.3028C18.9503 14.6256 18.9502 15.0224 18.9502 15.4553V15.5447C18.9502 15.9776 18.9503 16.3744 18.9069 16.6972C18.8591 17.0527 18.7467 17.4284 18.4376 17.7374C18.1286 18.0465 17.7529 18.1589 17.3974 18.2067C17.0746 18.2501 16.6778 18.2501 16.2449 18.25L16.2002 18.25L16.1555 18.25C15.7226 18.2501 15.3258 18.2501 15.003 18.2067C14.6475 18.1589 14.2718 18.0465 13.9628 17.7374C13.6537 17.4284 13.5413 17.0527 13.4935 16.6972C13.4501 16.3744 13.4501 15.9776 13.4502 15.5447L13.4502 15.5L13.4502 15.4553C13.4501 15.0224 13.4501 14.6256 13.4935 14.3028C13.5413 13.9473 13.6537 13.5716 13.9628 13.2626C14.2718 12.9535 14.6475 12.8411 15.003 12.7933C15.3258 12.7499 15.7226 12.7499 16.1554 12.75H16.2449ZM5.4502 14C5.4502 13.5858 5.78598 13.25 6.2002 13.25H8.2002C8.61441 13.25 8.9502 13.5858 8.9502 14C8.9502 14.4142 8.61441 14.75 8.2002 14.75H6.2002C5.78598 14.75 5.4502 14.4142 5.4502 14ZM5.4502 17C5.4502 16.5858 5.78598 16.25 6.2002 16.25H10.2002C10.6144 16.25 10.9502 16.5858 10.9502 17C10.9502 17.4142 10.6144 17.75 10.2002 17.75H6.2002C5.78598 17.75 5.4502 17.4142 5.4502 17Z" fill="#7856FF"/>
<path d="M15.0235 14.3232L15.0259 14.3219C15.0278 14.3209 15.0311 14.3192 15.0362 14.3172C15.0579 14.3082 15.1063 14.2929 15.2029 14.2799C15.4136 14.2516 15.7076 14.25 16.2002 14.25C16.6928 14.25 16.9868 14.2516 17.1975 14.2799C17.2941 14.2929 17.3425 14.3082 17.3642 14.3172C17.3693 14.3192 17.3726 14.3209 17.3745 14.3219L17.377 14.3232L17.3783 14.3257C17.3793 14.3276 17.381 14.3309 17.383 14.336C17.392 14.3577 17.4073 14.4061 17.4203 14.5027C17.4486 14.7134 17.4502 15.0074 17.4502 15.5C17.4502 15.9926 17.4486 16.2866 17.4203 16.4973C17.4073 16.5939 17.392 16.6423 17.383 16.664C17.381 16.6691 17.3793 16.6724 17.3783 16.6743L17.377 16.6768L17.3745 16.6781C17.3726 16.6791 17.3693 16.6808 17.3642 16.6828C17.3425 16.6918 17.2941 16.7071 17.1975 16.7201C16.9868 16.7484 16.6928 16.75 16.2002 16.75C15.7076 16.75 15.4136 16.7484 15.2029 16.7201C15.1063 16.7071 15.0579 16.6918 15.0362 16.6828C15.0311 16.6808 15.0278 16.6791 15.0259 16.6781L15.0234 16.6768L15.0221 16.6743C15.021 16.6724 15.0194 16.6691 15.0174 16.664C15.0084 16.6423 14.9931 16.5939 14.9801 16.4973C14.9518 16.2866 14.9502 15.9926 14.9502 15.5C14.9502 15.0074 14.9518 14.7134 14.9801 14.5027C14.9931 14.4061 15.0084 14.3577 15.0174 14.336C15.0194 14.3309 15.021 14.3276 15.0221 14.3257L15.0235 14.3232Z" fill="#7856FF"/>
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

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

const getCampaignFields = (campaignType: string | null): CampaignField[] => {
  const baseFields: CampaignField[] = [
    {
      id: 'campaignTitle',
      label: 'Campaign title',
      placeholder: 'Enter campaign title',
      required: true,
      type: 'text'
    }
  ];

  switch (campaignType) {
    case 'advertise':
      return [
        ...baseFields,
        {
          id: 'headline',
          label: 'Ad headline',
        placeholder: 'Enter compelling headline',
          required: true,
          type: 'text'
        },
        {
          id: 'description',
          label: 'Ad description',
          placeholder: 'Enter ad description',
          required: true,
          type: 'text'
        },
        {
          id: 'uploadImage',
          label: 'Upload image',
          placeholder: 'Choose file',
          required: false,
          type: 'file'
        },
        {
          id: 'ctaText',
          label: 'CTA text',
        placeholder: 'e.g., Shop Now, Learn More',
          required: true,
          type: 'text'
        }
      ];
    case 'engagement':
      return [
        ...baseFields,
        {
          id: 'headline',
          label: 'Message headline',
          placeholder: 'Enter message headline',
          required: true,
          type: 'text'
        },
        {
          id: 'description',
          label: 'Personalized content',
          placeholder: 'Write personalized message',
          required: true,
          type: 'text'
        },
        {
          id: 'uploadImage',
          label: 'Upload image',
          placeholder: 'Choose file',
          required: false,
          type: 'file'
        },
        {
          id: 'ctaText',
          label: 'CTA text',
        placeholder: 'e.g., Reply, Share, Visit',
          required: true,
          type: 'text'
        }
      ];
    case 'retention':
      return [
        ...baseFields,
        {
          id: 'headline',
          label: 'Loyalty program',
          placeholder: 'Enter loyalty program title',
          required: true,
          type: 'text'
        },
        {
          id: 'description',
          label: 'Reward description',
        placeholder: 'Describe the reward or offer',
          required: true,
          type: 'text'
        },
        {
          id: 'offerText',
          label: 'Special offer',
          placeholder: 'Enter special offer details',
          required: false,
          type: 'text'
        },
        {
          id: 'uploadImage',
          label: 'Upload image',
          placeholder: 'Choose file',
          required: false,
          type: 'file'
        },
        {
          id: 'ctaText',
          label: 'CTA text',
          placeholder: 'e.g., Claim Reward, Redeem',
          required: true,
          type: 'text'
        }
      ];
    case 'feedback':
      return [
        ...baseFields,
        {
          id: 'surveyTitle',
          label: 'Survey title',
        placeholder: 'Enter survey title',
          required: true,
          type: 'text'
      },
      {
          id: 'surveyDescription',
          label: 'Survey description',
        placeholder: 'Describe what the survey is about',
          required: true,
          type: 'text'
      },
      {
        id: 'incentive',
          label: 'Survey incentive',
        placeholder: 'e.g., Get 10% off, Free shipping',
          required: false,
          type: 'text'
        },
        {
          id: 'uploadImage',
          label: 'Upload image',
          placeholder: 'Choose file',
          required: false,
          type: 'file'
        },
        {
          id: 'surveyQuestions',
          label: 'Survey questions',
          placeholder: 'Add survey questions',
          required: false,
          type: 'survey_questions'
        },
        {
          id: 'ctaText',
          label: 'CTA text',
          placeholder: 'e.g., Take Survey, Share Feedback',
          required: true,
          type: 'text'
        }
      ];
    default:
      return [
        ...baseFields,
        {
          id: 'uploadImage',
          label: 'Upload image',
          placeholder: 'Enter image URL',
          required: false,
          type: 'text'
        },
        {
          id: 'ctaText',
          label: 'CTA text',
          placeholder: 'Enter call to action',
          required: true,
          type: 'text'
        }
      ];
  }
};

// Feedback and Survey Form Component based on Figma design
const FeedbackSurveyForm = ({
  campaignType,
  formData,
  onFormDataChange,
  onSurveyQuestionsChange,
  onTypeSelect,
  selectedFeedbackType
}: {
  campaignType: string | null;
  formData: FormData;
  onFormDataChange: (field: keyof FormData, value: string) => void;
  onSurveyQuestionsChange: (questions: SurveyQuestion[]) => void;
  onTypeSelect: (type: 'feedback' | 'survey') => void;
  selectedFeedbackType?: 'feedback' | 'survey' | null;
}) => {
  const [selectedType, setSelectedType] = useState<'feedback' | 'survey' | null>(selectedFeedbackType || null);
  const [surveyQuestions, setSurveyQuestions] = useState<string[]>(['', '']);

  // Update selectedType when selectedFeedbackType prop changes
  React.useEffect(() => {
    if (selectedFeedbackType) {
      setSelectedType(selectedFeedbackType);
    }
  }, [selectedFeedbackType]);

  // Load saved survey questions from form data when component mounts
  React.useEffect(() => {
    if (formData.surveyQuestions && formData.surveyQuestions.length > 0) {
      const savedQuestions = formData.surveyQuestions.map(q => q.question);
      setSurveyQuestions(savedQuestions.length > 0 ? savedQuestions : ['', '']);
    }
  }, [formData.surveyQuestions]);

  const handleTypeSelect = (type: 'feedback' | 'survey') => {
    setSelectedType(type);
    // Update campaign type in form data
    onFormDataChange('campaignTitle', type === 'feedback' ? 'Feedback Campaign' : 'Survey Campaign');
    // Notify parent component about type selection
    onTypeSelect(type);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...surveyQuestions];
    newQuestions[index] = value;
    setSurveyQuestions(newQuestions);

    // Convert to SurveyQuestion objects and update form data
    const surveyQuestionObjects: SurveyQuestion[] = newQuestions
      .filter(q => q.trim() !== '')
      .map((question, idx) => ({
        id: `question-${idx}`,
        type: 'text' as const,
        question: question,
        required: true
      }));

    // Update form data with survey questions
    if (selectedType === 'survey') {
      onSurveyQuestionsChange(surveyQuestionObjects);
    }
  };

  const addQuestion = () => {
    const newQuestions = [...surveyQuestions, ''];
    setSurveyQuestions(newQuestions);

    // Convert to SurveyQuestion objects and update form data
    const surveyQuestionObjects: SurveyQuestion[] = newQuestions
      .filter(q => q.trim() !== '')
      .map((question, idx) => ({
        id: `question-${idx}`,
        type: 'text' as const,
        question: question,
        required: true
      }));

    // Update form data with survey questions
    if (selectedType === 'survey') {
      onSurveyQuestionsChange(surveyQuestionObjects);
    }
  };

  const removeQuestion = (index: number) => {
    if (surveyQuestions.length > 1) {
      const newQuestions = surveyQuestions.filter((_, i) => i !== index);
      setSurveyQuestions(newQuestions);

      // Convert to SurveyQuestion objects and update form data
      const surveyQuestionObjects: SurveyQuestion[] = newQuestions
        .filter(q => q.trim() !== '')
        .map((question, idx) => ({
          id: `question-${idx}`,
          type: 'text' as const,
          question: question,
          required: true
        }));

      // Update form data with survey questions
      if (selectedType === 'survey') {
        onSurveyQuestionsChange(surveyQuestionObjects);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 items-start justify-start w-full">
      <div className="font-bold text-[#2a2a2f] text-[16px] leading-[1.4] tracking-[-0.1px]">
        Creating survey template
      </div>

      {/* Type Selection Cards */}
      <div className="flex flex-row gap-2 items-start justify-start w-full">
        <div
          className={`bg-white box-border flex flex-row items-center justify-between p-4 rounded w-[331px] border cursor-pointer transition-all duration-200 ${
            selectedType === 'feedback' ? 'border-[#7856ff]' : 'border-[#e9e9e9]'
          }`}
          onClick={() => handleTypeSelect('feedback')}
        >
          <div className="flex flex-row gap-3.5 items-center justify-start">
            <div className="flex flex-row gap-2.5 items-start justify-start relative">
              <div className="relative shrink-0 size-[50px]">
                <div className="absolute bottom-[3.71%] left-[6.7%] right-[6.7%] top-[3.71%]">
                </div>
              </div>
              <div className="absolute left-1/2 overflow-clip size-[22px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" d="M11.0043 21.3082C10.6623 21.3062 10.3257 21.2227 10.0223 21.0647C9.71897 20.9067 9.45762 20.6787 9.25991 20.3996L8.27866 18.955C8.22655 18.8802 8.15732 18.8189 8.07672 18.7762C7.99612 18.7335 7.90649 18.7107 7.81529 18.7097H6.33434C4.98252 18.7097 3.68607 18.1727 2.73019 17.2168C1.77431 16.2609 1.2373 14.9645 1.2373 13.6127V6.88024C1.2373 5.52842 1.77431 4.23197 2.73019 3.27609C3.68607 2.32021 4.98252 1.7832 6.33434 1.7832H15.6744C16.3437 1.7832 17.0065 1.91504 17.6249 2.17119C18.2433 2.42734 18.8052 2.80279 19.2785 3.27609C19.7518 3.74939 20.1273 4.31129 20.3834 4.92969C20.6396 5.54809 20.7714 6.21088 20.7714 6.88024V13.6127C20.7714 14.282 20.6396 14.9448 20.3834 15.5632C20.1273 16.1816 19.7518 16.7435 19.2785 17.2168C18.8052 17.6901 18.2433 18.0656 17.6249 18.3217C17.0065 18.5779 16.3437 18.7097 15.6744 18.7097H14.2297C14.1386 18.7107 14.0489 18.7335 13.9683 18.7762C13.8877 18.8189 13.8185 18.8802 13.7664 18.955L12.7488 20.3996C12.5511 20.6787 12.2897 20.9067 11.9864 21.0647C11.683 21.2227 11.3464 21.3062 11.0043 21.3082Z" fill="#A1A1A1"/>
<path d="M10.9997 21.3456C10.6546 21.3436 10.315 21.2594 10.0089 21.1C9.70283 20.9406 9.43915 20.7106 9.23967 20.429L8.24967 18.9715C8.1971 18.896 8.12725 18.8341 8.04593 18.7911C7.96461 18.748 7.87418 18.725 7.78217 18.724H6.28801C4.92413 18.724 3.61612 18.1822 2.65171 17.2178C1.68731 16.2534 1.14551 14.9454 1.14551 13.5815V6.78898C1.14551 5.42511 1.68731 4.11709 2.65171 3.15269C3.61612 2.18828 4.92413 1.64648 6.28801 1.64648H15.7113C16.3867 1.64648 17.0554 1.7795 17.6793 2.03793C18.3032 2.29637 18.8701 2.67516 19.3476 3.15269C19.8252 3.63021 20.204 4.19712 20.4624 4.82103C20.7208 5.44495 20.8538 6.11366 20.8538 6.78898V13.5815C20.8538 14.2568 20.7208 14.9255 20.4624 15.5494C20.204 16.1733 19.8252 16.7403 19.3476 17.2178C18.8701 17.6953 18.3032 18.0741 17.6793 18.3325C17.0554 18.591 16.3867 18.724 15.7113 18.724H14.2538C14.1618 18.725 14.0714 18.748 13.9901 18.7911C13.9088 18.8341 13.8389 18.896 13.7863 18.9715L12.7597 20.429C12.5602 20.7106 12.2965 20.9406 11.9905 21.1C11.6844 21.2594 11.3448 21.3436 10.9997 21.3456ZM6.28801 3.01232C5.79248 3.01232 5.30182 3.11007 4.84413 3.29998C4.38643 3.48988 3.9707 3.76822 3.62074 4.11903C3.27077 4.46985 2.99345 4.88626 2.80466 5.34441C2.61586 5.80256 2.5193 6.29346 2.52051 6.78898V13.5815C2.52051 14.5807 2.91744 15.539 3.62398 16.2455C4.33053 16.9521 5.2888 17.349 6.28801 17.349H7.74551C8.05879 17.3499 8.36726 17.4261 8.64486 17.5713C8.92247 17.7165 9.16107 17.9263 9.34051 18.1831L10.358 19.6315C10.4333 19.7303 10.5303 19.8104 10.6416 19.8655C10.7529 19.9206 10.8755 19.9493 10.9997 19.9493C11.1239 19.9493 11.2464 19.9206 11.3577 19.8655C11.469 19.8104 11.5661 19.7303 11.6413 19.6315L12.6588 18.1831C12.8383 17.9263 13.0769 17.7165 13.3545 17.5713C13.6321 17.4261 13.9406 17.3499 14.2538 17.349H15.7113C16.7105 17.349 17.6688 16.9521 18.3754 16.2455C19.0819 15.539 19.4788 14.5807 19.4788 13.5815V6.78898C19.48 6.29346 19.3835 5.80256 19.1947 5.34441C19.0059 4.88626 18.7286 4.46985 18.3786 4.11903C18.0286 3.76822 17.6129 3.48988 17.1552 3.29998C16.6975 3.11007 16.2069 3.01232 15.7113 3.01232H6.28801ZM16.0505 8.40232C16.0481 8.22072 15.9749 8.04723 15.8465 7.91881C15.7181 7.79039 15.5446 7.71719 15.363 7.71482H6.63634C6.454 7.71482 6.27914 7.78725 6.15021 7.91618C6.02127 8.04511 5.94884 8.21998 5.94884 8.40232C5.94884 8.58465 6.02127 8.75952 6.15021 8.88845C6.27914 9.01738 6.454 9.08982 6.63634 9.08982H15.363C15.5446 9.08744 15.7181 9.01425 15.8465 8.88583C15.9749 8.75741 16.0481 8.58392 16.0505 8.40232ZM14.593 12.9857C14.593 12.8033 14.5206 12.6284 14.3916 12.4995C14.2627 12.3706 14.0878 12.2982 13.9055 12.2982H8.09384C7.9115 12.2982 7.73664 12.3706 7.60771 12.4995C7.47877 12.6284 7.40634 12.8033 7.40634 12.9857C7.40634 13.168 7.47877 13.3429 7.60771 13.4718C7.73664 13.6007 7.9115 13.6732 8.09384 13.6732H13.9055C14.0878 13.6732 14.2627 13.6007 14.3916 13.4718C14.5206 13.3429 14.593 13.168 14.593 12.9857Z" fill="#A1A1A1"/>
</svg>

              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-center">
              <div className="font-medium text-[#2a2a2f] text-[14px]">
                Feedback
              </div>
              <div className="font-normal text-[#a1a1a1] text-[13px]">
                Check product service rating
              </div>
            </div>
          </div>
          <div className="h-[18px] relative shrink-0 w-[30px] flex items-center">
            <div className={`h-[18px] w-[30px] rounded-full transition-all duration-200 relative ${
              selectedType === 'feedback' ? 'bg-[#7856ff]' : 'bg-[#e9e9e9]'
            }`}>
              <div className={`absolute top-0.5 h-[14px] w-[14px] rounded-full bg-white transition-all duration-200 ${
                selectedType === 'feedback' ? 'left-[14px]' : 'left-0.5'
              }`} />
            </div>
          </div>
        </div>

        <div
          className={`bg-white box-border flex flex-row grow items-center justify-between p-4 rounded border cursor-pointer transition-all duration-200 ${
            selectedType === 'survey' ? 'border-[#7856ff]' : 'border-[#e9e9e9]'
          }`}
          onClick={() => handleTypeSelect('survey')}
        >
          <div className="flex flex-row gap-3.5 items-center justify-start">
            <div className="flex flex-row gap-2.5 items-start justify-start relative">
              <div className="relative shrink-0 size-[50px]">
                <div className="absolute bottom-[3.71%] left-[6.7%] right-[6.7%] top-[3.71%]">
                </div>
              </div>
              <div className="absolute left-1/2 overflow-clip size-[22px] top-1/2 translate-x-[-50%] translate-y-[-50%]">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" d="M11.0043 21.3082C10.6623 21.3062 10.3257 21.2227 10.0223 21.0647C9.71897 20.9067 9.45762 20.6787 9.25991 20.3996L8.27866 18.955C8.22655 18.8802 8.15732 18.8189 8.07672 18.7762C7.99612 18.7335 7.90649 18.7107 7.81529 18.7097H6.33434C4.98252 18.7097 3.68607 18.1727 2.73019 17.2168C1.77431 16.2609 1.2373 14.9645 1.2373 13.6127V6.88024C1.2373 5.52842 1.77431 4.23197 2.73019 3.27609C3.68607 2.32021 4.98252 1.7832 6.33434 1.7832H15.6744C16.3437 1.7832 17.0065 1.91504 17.6249 2.17119C18.2433 2.42734 18.8052 2.80279 19.2785 3.27609C19.7518 3.74939 20.1273 4.31129 20.3834 4.92969C20.6396 5.54809 20.7714 6.21088 20.7714 6.88024V13.6127C20.7714 14.282 20.6396 14.9448 20.3834 15.5632C20.1273 16.1816 19.7518 16.7435 19.2785 17.2168C18.8052 17.6901 18.2433 18.0656 17.6249 18.3217C17.0065 18.5779 16.3437 18.7097 15.6744 18.7097H14.2297C14.1386 18.7107 14.0489 18.7335 13.9683 18.7762C13.8877 18.8189 13.8185 18.8802 13.7664 18.955L12.7488 20.3996C12.5511 20.6787 12.2897 20.9067 11.9864 21.0647C11.683 21.2227 11.3464 21.3062 11.0043 21.3082Z" fill="#A1A1A1"/>
<path d="M10.9997 21.3456C10.6546 21.3436 10.315 21.2594 10.0089 21.1C9.70283 20.9406 9.43915 20.7106 9.23967 20.429L8.24967 18.9715C8.1971 18.896 8.12725 18.8341 8.04593 18.7911C7.96461 18.748 7.87418 18.725 7.78217 18.724H6.28801C4.92413 18.724 3.61612 18.1822 2.65171 17.2178C1.68731 16.2534 1.14551 14.9454 1.14551 13.5815V6.78898C1.14551 5.42511 1.68731 4.11709 2.65171 3.15269C3.61612 2.18828 4.92413 1.64648 6.28801 1.64648H15.7113C16.3867 1.64648 17.0554 1.7795 17.6793 2.03793C18.3032 2.29637 18.8701 2.67516 19.3476 3.15269C19.8252 3.63021 20.204 4.19712 20.4624 4.82103C20.7208 5.44495 20.8538 6.11366 20.8538 6.78898V13.5815C20.8538 14.2568 20.7208 14.9255 20.4624 15.5494C20.204 16.1733 19.8252 16.7403 19.3476 17.2178C18.8701 17.6953 18.3032 18.0741 17.6793 18.3325C17.0554 18.591 16.3867 18.724 15.7113 18.724H14.2538C14.1618 18.725 14.0714 18.748 13.9901 18.7911C13.9088 18.8341 13.8389 18.896 13.7863 18.9715L12.7597 20.429C12.5602 20.7106 12.2965 20.9406 11.9905 21.1C11.6844 21.2594 11.3448 21.3436 10.9997 21.3456ZM6.28801 3.01232C5.79248 3.01232 5.30182 3.11007 4.84413 3.29998C4.38643 3.48988 3.9707 3.76822 3.62074 4.11903C3.27077 4.46985 2.99345 4.88626 2.80466 5.34441C2.61586 5.80256 2.5193 6.29346 2.52051 6.78898V13.5815C2.52051 14.5807 2.91744 15.539 3.62398 16.2455C4.33053 16.9521 5.2888 17.349 6.28801 17.349H7.74551C8.05879 17.3499 8.36726 17.4261 8.64486 17.5713C8.92247 17.7165 9.16107 17.9263 9.34051 18.1831L10.358 19.6315C10.4333 19.7303 10.5303 19.8104 10.6416 19.8655C10.7529 19.9206 10.8755 19.9493 10.9997 19.9493C11.1239 19.9493 11.2464 19.9206 11.3577 19.8655C11.469 19.8104 11.5661 19.7303 11.6413 19.6315L12.6588 18.1831C12.8383 17.9263 13.0769 17.7165 13.3545 17.5713C13.6321 17.4261 13.9406 17.3499 14.2538 17.349H15.7113C16.7105 17.349 17.6688 16.9521 18.3754 16.2455C19.0819 15.539 19.4788 14.5807 19.4788 13.5815V6.78898C19.48 6.29346 19.3835 5.80256 19.1947 5.34441C19.0059 4.88626 18.7286 4.46985 18.3786 4.11903C18.0286 3.76822 17.6129 3.48988 17.1552 3.29998C16.6975 3.11007 16.2069 3.01232 15.7113 3.01232H6.28801ZM16.0505 8.40232C16.0481 8.22072 15.9749 8.04723 15.8465 7.91881C15.7181 7.79039 15.5446 7.71719 15.363 7.71482H6.63634C6.454 7.71482 6.27914 7.78725 6.15021 7.91618C6.02127 8.04511 5.94884 8.21998 5.94884 8.40232C5.94884 8.58465 6.02127 8.75952 6.15021 8.88845C6.27914 9.01738 6.454 9.08982 6.63634 9.08982H15.363C15.5446 9.08744 15.7181 9.01425 15.8465 8.88583C15.9749 8.75741 16.0481 8.58392 16.0505 8.40232ZM14.593 12.9857C14.593 12.8033 14.5206 12.6284 14.3916 12.4995C14.2627 12.3706 14.0878 12.2982 13.9055 12.2982H8.09384C7.9115 12.2982 7.73664 12.3706 7.60771 12.4995C7.47877 12.6284 7.40634 12.8033 7.40634 12.9857C7.40634 13.168 7.47877 13.3429 7.60771 13.4718C7.73664 13.6007 7.9115 13.6732 8.09384 13.6732H13.9055C14.0878 13.6732 14.2627 13.6007 14.3916 13.4718C14.5206 13.3429 14.593 13.168 14.593 12.9857Z" fill="#A1A1A1"/>
</svg>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-center">
              <div className="font-medium text-[#2a2a2f] text-[14px]">
                Survey
              </div>
              <div className="font-normal text-[#a1a1a1] text-[13px]">
                Run survey to understand user
              </div>
            </div>
          </div>
          <div className="h-[18px] relative shrink-0 w-[30px] flex items-center">
            <div className={`h-[18px] w-[30px] rounded-full transition-all duration-200 relative ${
              selectedType === 'survey' ? 'bg-[#7856ff]' : 'bg-[#e9e9e9]'
            }`}>
              <div className={`absolute top-0.5 h-[14px] w-[14px] rounded-full bg-white transition-all duration-200 ${
                selectedType === 'survey' ? 'left-[14px]' : 'left-0.5'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      {selectedType && (
        <div className="flex flex-col gap-4 items-start justify-start w-full">
          <div className="bg-white box-border flex flex-col gap-2 items-start justify-center w-full border border-[#e9e9e9] rounded shadow-[0px_2.402px_3.203px_0px_rgba(0,0,0,0.03)]">
            <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
              <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                  Campaign title
                </div>
              </div>
              <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                <input
                  type="text"
                  value={formData.campaignTitle}
                  onChange={(e) => onFormDataChange('campaignTitle', e.target.value)}
                  placeholder="type here"
                  className="font-normal text-[#2a2a2f] text-[12px] leading-[11.211px] bg-transparent border-none outline-none w-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-white box-border flex flex-col gap-4 items-start justify-start w-full border border-[#e9e9e9] rounded shadow-[0px_2.402px_3.203px_0px_rgba(0,0,0,0.03)]">
            <div className="flex flex-row h-11 items-center justify-between px-6 py-4 w-full border-b border-[#e9e9e9]">
              <div className="font-semibold text-[#2a2a2f] text-[14px] leading-[16px]">
                {selectedType === 'feedback' ? 'Feedback template' : 'Survey template'}
              </div>
              {selectedType === 'survey' && (
                <button
                  onClick={addQuestion}
                  className="text-[#7856ff] text-[12px] font-medium hover:text-[#6a4fd8] transition-colors"
                >
                  + Add Question
                </button>
              )}
            </div>

            {selectedType === 'feedback' ? (
              <div className="flex flex-col items-start justify-start pb-3 pt-0 px-0 w-full">
                <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                    <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                      Upload cover image
                    </div>
                  </div>
                  <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const result = event.target?.result as string;
                            onFormDataChange('uploadImage', result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="font-normal text-[#2a2a2f] text-[12px] leading-[11.211px] bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                    <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                      Rating context
                    </div>
                  </div>
                  <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                    <input
                      type="text"
                      value={formData.headline || ''}
                      onChange={(e) => onFormDataChange('headline', e.target.value)}
                      placeholder="e.g., Rate your experience with our product"
                      className="font-normal text-[#2a2a2f] text-[12px] leading-[11.211px] bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                    <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                      Rating scale
                    </div>
                  </div>
                  <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#2a2a2f] text-[12px] font-medium">1</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className="text-yellow-400 text-lg">★</div>
                        ))}
                      </div>
                      <span className="text-[#2a2a2f] text-[12px] font-medium">5</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                    <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                      CTA Button
                    </div>
                  </div>
                  <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                    <input
                      type="text"
                      value={formData.ctaText || ''}
                      onChange={(e) => onFormDataChange('ctaText', e.target.value)}
                      placeholder="e.g., Rate Now"
                      className="font-normal text-[#2a2a2f] text-[12px] leading-[11.211px] bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-start justify-start w-full">
                {surveyQuestions.map((question, index) => (
                  <div key={index} className="flex flex-col items-start justify-start pb-3 pt-0 px-0 w-full">
                    <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                      <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                        <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                          Question {index + 1}
                        </div>
                      </div>
                      <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          placeholder="type here"
                          className="font-normal text-[#2a2a2f] text-[12px] leading-[11.211px] bg-transparent border-none outline-none w-full"
                        />
                      </div>
                      {surveyQuestions.length > 1 && (
                        <button
                          onClick={() => removeQuestion(index)}
                          className="text-red-500 text-[12px] font-medium hover:text-red-700 transition-colors ml-2"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                  <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                    <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                      CTA Button
                    </div>
                  </div>
                  <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                    <input
                      type="text"
                      value={formData.ctaText || ''}
                      onChange={(e) => onFormDataChange('ctaText', e.target.value)}
                      placeholder="e.g., Complete Survey"
                      className="font-normal text-[#2a2a2f] text-[12px] leading-[11.211px] bg-transparent border-none outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const SurveyQuestionBuilder = ({
  questions,
  onQuestionsChange
}: {
  questions: SurveyQuestion[];
  onQuestionsChange: (questions: SurveyQuestion[]) => void;
}) => {
  const addQuestion = (type: 'text' | 'rating' | 'multiple_choice') => {
    const newQuestion: SurveyQuestion = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'multiple_choice' ? [''] : undefined,
      required: true
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    onQuestionsChange(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    onQuestionsChange(questions.filter(q => q.id !== id));
  };

  const addOption = (questionId: string) => {
    onQuestionsChange(questions.map(q =>
      q.id === questionId
        ? { ...q, options: [...(q.options || []), ''] }
        : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    onQuestionsChange(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    onQuestionsChange(questions.map(q =>
      q.id === questionId
        ? { ...q, options: q.options?.filter((_, idx) => idx !== optionIndex) }
        : q
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => addQuestion('text')}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
        >
          + Text Question
        </button>
        <button
          onClick={() => addQuestion('rating')}
          className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
        >
          + Rating Question
        </button>
        <button
          onClick={() => addQuestion('multiple_choice')}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          + Multiple Choice
        </button>
      </div>

      {questions.map((question, index) => (
        <div key={question.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <select
                value={question.type}
                onChange={(e) => updateQuestion(question.id, { type: e.target.value as any })}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="text">Text</option>
                <option value="rating">Rating</option>
                <option value="multiple_choice">Multiple Choice</option>
              </select>
            </div>
            <button
              onClick={() => removeQuestion(question.id)}
              className="text-red-500 text-xs hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <input
            type="text"
            value={question.question}
            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
            placeholder="Enter your question"
            className="w-full text-xs border border-gray-300 rounded px-3 py-2 mb-3"
          />

          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => removeOption(question.id, optionIndex)}
                    className="text-red-500 text-xs hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(question.id)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={question.required}
                onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                className="text-blue-600"
              />
              Required
            </label>
          </div>
        </div>
      ))}
    </div>
  );
};

const MobilePreview = ({ formData, campaignType, selectedFeedbackType }: { formData: FormData; campaignType: string | null; selectedFeedbackType?: 'feedback' | 'survey' | null }) => {
  const getPreviewContent = () => {
    if (!formData.campaignTitle) {
      return (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-xs text-gray-500">Start filling out the form to see your campaign preview</p>
        </div>
      );
    }

    return (
      <div className="p-4 space-y-3">
        {/* Header - Removed icon and subheading */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 text-sm break-words whitespace-normal">{formData.campaignTitle}</h4>
        </div>

        {/* Content based on campaign type */}
        {campaignType === 'advertise' && (
          <>
            {formData.headline && (
              <div className="bg-blue-50 rounded-lg p-3">
                <h5 className="font-semibold text-blue-900 text-sm mb-1 break-words whitespace-normal">{formData.headline}</h5>
                {formData.description && (
                  <p className="text-xs text-blue-700 break-words whitespace-normal">{formData.description}</p>
                )}
              </div>
            )}
          </>
        )}

        {campaignType === 'engagement' && (
          <>
            {formData.headline && (
              <div className="bg-green-50 rounded-lg p-3">
                <h5 className="font-semibold text-green-900 text-sm mb-1 break-words whitespace-normal">{formData.headline}</h5>
                {formData.description && (
                  <p className="text-xs text-green-700 break-words whitespace-normal">{formData.description}</p>
                )}
              </div>
            )}
          </>
        )}

        {campaignType === 'retention' && (
          <>
            {formData.headline && (
              <div className="bg-purple-50 rounded-lg p-3">
                <h5 className="font-semibold text-purple-900 text-sm mb-1 break-words whitespace-normal">🎁 {formData.headline}</h5>
                {formData.description && (
                  <p className="text-xs text-purple-700 break-words whitespace-normal">{formData.description}</p>
                )}
                {formData.offerText && (
                  <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                    <p className="text-xs text-yellow-800 font-medium break-words whitespace-normal">{formData.offerText}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {(campaignType === 'feedback' || campaignType === 'survey') && (
          <>
            {/* Show feedback preview only when feedback is selected */}
            {selectedFeedbackType === 'feedback' && formData.headline && (
              <>
                {/* Rating Context */}
                <div className="bg-orange-50 rounded-lg p-3">
                  <h5 className="font-semibold text-orange-900 text-sm mb-2 break-words whitespace-normal">{formData.headline}</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-orange-700">1</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F59E0B" stroke="#D97706"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-orange-700">5</span>
                  </div>
                </div>


              </>
            )}

            {/* Show survey preview only when survey is selected */}
            {selectedFeedbackType === 'survey' && (
              <>
                {/* Survey Description */}
                {formData.surveyDescription && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700 break-words whitespace-normal">{formData.surveyDescription}</p>
                  </div>
                )}
              </>
            )}

            {/* Survey Questions Preview - Show only when survey is selected */}
            {selectedFeedbackType === 'survey' && formData.surveyQuestions && formData.surveyQuestions.length > 0 && (
              <>
                <div className="space-y-3">
                  {formData.surveyQuestions.map((question, index) => (
                    <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs text-gray-800 break-words whitespace-normal">{question.question || 'Question text'}</p>
                        {question.required && <span className="text-red-500 text-xs">*</span>}
                      </div>

                      {question.type === 'text' && (
                        <input
                          type="text"
                          placeholder="Type your answer"
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                          disabled
                        />
                      )}

                      {question.type === 'rating' && (
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#E5E7EB" stroke="#D1D5DB"/>
                            </svg>
                          ))}
                        </div>
                      )}

                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-1">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center gap-2">
                              <input type="radio" name={`question-${question.id}`} className="text-blue-600" disabled />
                              <span className="text-xs text-gray-700">{option || `Option ${optionIndex + 1}`}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>


              </>
            )}
          </>
        )}

        {/* Image preview */}
        {formData.uploadImage && (
          <div className="bg-gray-200 h-32 rounded-lg overflow-hidden">
            <Image
              src={formData.uploadImage}
              alt="Uploaded image"
              width={256}
              height={128}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback placeholder */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
              <span className="text-xs text-gray-500">Image Preview</span>
            </div>
          </div>
        )}

        {/* CTA Buttons - Positioned after image */}
        {formData.ctaText && (
          <button className="w-full py-2 px-4 rounded-lg text-white font-semibold bg-[#7856FF] text-sm hover:bg-[#6a4fd8] transition-colors">
            {formData.ctaText}
          </button>
        )}


      </div>
    );
  };

  return (
    <div className="relative w-64 h-[500px] bg-black rounded-[2rem] p-2 shadow-2xl">
      {/* Phone Screen */}
      <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
        {/* Status Bar */}
        <div className="bg-black text-white text-xs px-4 py-1 flex justify-between items-center">
          <span className="font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>

        {/* App Content - Fixed position, no scroll */}
        <div className="h-full overflow-hidden">
          {getPreviewContent()}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export function CreateCampaignContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get('type');

  // Initialize selectedFeedbackType from session storage if available
  const getInitialSelectedFeedbackType = (): 'feedback' | 'survey' | null => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('createCampaignData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.selectedFeedbackType) {
            console.log('Initializing selectedFeedbackType from session storage:', data.selectedFeedbackType);
            return data.selectedFeedbackType;
          }
        } catch (error) {
          console.error('Error parsing session storage data:', error);
        }
      }
    }
    return null;
  };

  const [selectedFeedbackType, setSelectedFeedbackType] = useState<'feedback' | 'survey' | null>(getInitialSelectedFeedbackType);
  // Initialize form data from session storage if available
  const getInitialFormData = (): FormData => {
    if (typeof window !== 'undefined') {
      const savedData = sessionStorage.getItem('createCampaignData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.formData) {
            console.log('Initializing form data from session storage:', data.formData);
            return data.formData;
          }
        } catch (error) {
          console.error('Error parsing session storage data:', error);
        }
      }
    }
    return {
      campaignTitle: '',
      uploadImage: '',
      ctaText: '',
      headline: '',
      description: '',
      offerText: '',
      surveyTitle: '',
      surveyDescription: '',
      incentive: '',
      surveyQuestions: []
    };
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData);

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Load data from session storage on component mount
  React.useEffect(() => {
    console.log('Loading data from session storage, campaignType:', campaignType);
    const savedData = sessionStorage.getItem('createCampaignData');
    console.log('Saved data from session storage:', savedData);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log('Parsed data:', data);
        // Restore form data if it exists, regardless of campaign type
        if (data.formData) {
          console.log('Restoring form data:', data.formData);
          setFormData(data.formData);
        }
        // Restore selectedFeedbackType if it exists
        if (data.selectedFeedbackType) {
          console.log('Restoring selectedFeedbackType:', data.selectedFeedbackType);
          setSelectedFeedbackType(data.selectedFeedbackType);
        }
      } catch (error) {
        console.error('Error loading create campaign data from session storage:', error);
      }
    } else {
      console.log('No saved data found in session storage');
    }
  }, [campaignType]);

  // Save data to session storage whenever form data changes
  React.useEffect(() => {
    // Always save data, even if it's empty, to ensure we don't lose data
    const dataToSave = {
      campaignType,
      formData,
      selectedFeedbackType
    };
    console.log('Saving data to session storage:', dataToSave);
    sessionStorage.setItem('createCampaignData', JSON.stringify(dataToSave));
  }, [campaignType, formData, selectedFeedbackType]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: keyof FormData, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          [field]: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSurveyQuestionsChange = (questions: SurveyQuestion[]) => {
    setFormData(prev => ({
      ...prev,
      surveyQuestions: questions
    }));
  };

  // Cleanup object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      if (formData.uploadImage && formData.uploadImage.startsWith('blob:')) {
        URL.revokeObjectURL(formData.uploadImage);
      }
    };
  }, [formData.uploadImage]);

  // Save data when component unmounts
  React.useEffect(() => {
    return () => {
      const dataToSave = {
        campaignType,
        formData,
        selectedFeedbackType
      };
      console.log('Saving data on unmount:', dataToSave);
      sessionStorage.setItem('createCampaignData', JSON.stringify(dataToSave));
    };
  }, [campaignType, formData, selectedFeedbackType]);

  const handleProceedToNextStep = async () => {
    // Special validation for feedback/survey campaigns
    if (campaignType === 'feedback' || campaignType === 'survey') {
      if (!formData.campaignTitle?.trim()) {
        alert('Please fill in the Campaign title');
        return;
      }
      if (!formData.ctaText?.trim()) {
        alert('Please fill in the CTA Button text');
        return;
      }
    } else {
      // Validate required fields for other campaign types
      const requiredFields = getCampaignFields(campaignType).filter(field => field.required);
      const missingFields = requiredFields.filter(field => !formData[field.id]);

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }
    }

    router.push(`/new-campaign/audience?type=${campaignType}`);
  };

  const handleBack = () => {
    router.push('/new-campaign');
  };

  const handleClose = () => {
    router.push('/campaigns');
  };

  // Debug function to check session storage
  const debugSessionStorage = () => {
    const savedData = sessionStorage.getItem('createCampaignData');
    console.log('Current session storage data:', savedData);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        console.log('Parsed session storage data:', data);
      } catch (error) {
        console.error('Error parsing session storage:', error);
      }
    }
  };

  const getCampaignTypeTitle = () => {
    switch (campaignType) {
      case 'advertise':
        return 'Creating Ad template';
      case 'engagement':
        return 'Creating Engagement template';
      case 'retention':
        return 'Creating Retention template';
      case 'feedback':
        return 'Creating Survey template';
      default:
        return 'Creating Campaign template';
    }
  };

  const campaignFields = getCampaignFields(campaignType);

  const renderField = (field: CampaignField) => {
    if (field.type === 'file') {
        return (
        <div className="bg-[#f9f9f9] box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
          <input
            type="file"
            onChange={(e) => handleFileChange(field.id, e.target.files?.[0] || null)}
            className="font-normal text-[12px] leading-[11px] text-[#a1a1a1] bg-transparent w-full outline-none"
            accept="image/*"
          />
        </div>
      );
    }

    if (field.type === 'survey_questions') {
        return (
        <div className="w-full lg:w-[360px]">
          <SurveyQuestionBuilder
            questions={formData.surveyQuestions || []}
            onQuestionsChange={handleSurveyQuestionsChange}
          />
        </div>
      );
    }

        return (
          <input
        type="text"
        value={typeof formData[field.id] === 'string' ? formData[field.id] as string : ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className="font-normal text-[12px] leading-[11px] text-[#a1a1a1] bg-transparent w-full outline-none"
      />
    );
  };

  return (
      <main className={`flex-1 transition-sidebar h-full ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <MobileMenuToggle />
      </div>

      <div className="w-full max-w-full overflow-x-hidden h-full flex flex-col">
        {/* Navigation Bar */}
        <div className={`fixed bottom-0 bg-white border-t border-[#e9e9e9] px-4 sm:px-6 lg:px-12 py-3 z-50 ${
          isMobile ? 'left-0 right-0' : actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
        }`}>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={handleClose}
                className="h-9 px-3 sm:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={handleBack}
                className="h-9 px-3 sm:px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={handleProceedToNextStep}
                disabled={!formData.campaignTitle.trim()}
                className={`h-9 px-3 sm:px-4 py-1 rounded font-medium text-[12px] sm:text-[14px] transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95 ${
                  formData.campaignTitle.trim()
                    ? 'bg-[#7856ff] text-white hover:bg-[#6a4fd8] shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="hidden sm:inline">Proceed to next step</span>
                <span className="sm:hidden">Next</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-4 lg:px-8 lg:py-8 pb-64 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[24px] font-medium text-[#2a2a2f] leading-[1.4] tracking-[-0.1px]">
              Campaigns
            </h1>
          </div>

          {/* Stepper */}
          <div className="mb-8 bg-white border border-[#e9e9e9] rounded-md p-2 overflow-x-auto">
            <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative rounded-md size-full">
              <StepperStep
                title="campaign type"
                icon={<CampaignIcon />}
                isCompleted={true}
              />
              <StepperStep
                title="Create campaign"
                icon={<MoneyIcon />}
                isCurrent={true}
              />
              <StepperStep
                title="Choose audience"
                icon={<UsersIcon />}
              />
              <StepperStep
                title="Platform & Budget"
                icon={<BagIcon />}
              />
              <StepperStep
                title="Schedule"
                icon={<CalendarIcon />}
              />
            </div>
          </div>

          {/* Content Layout */}
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-start">
            {/* Form Section */}
            <div className="flex flex-col gap-6 items-start justify-start w-full lg:w-[685px]">
              {campaignType === 'feedback' || campaignType === 'survey' ? (
                                  <FeedbackSurveyForm
                    campaignType={campaignType}
                    formData={formData}
                    onFormDataChange={handleInputChange}
                    onSurveyQuestionsChange={handleSurveyQuestionsChange}
                    onTypeSelect={setSelectedFeedbackType}
                    selectedFeedbackType={selectedFeedbackType}
                  />
              ) : (
                <>
                  <div className="font-bold text-[#2a2a2f] text-[16px] leading-[1.4] tracking-[-0.1px]">
                    {getCampaignTypeTitle()}
                  </div>

                  <div className="flex flex-col gap-4 items-start justify-start w-full pb-12">
                    {campaignFields.map((field) => (
                      <div key={field.id} className="bg-white box-border flex flex-col gap-2 items-start justify-center w-full border border-[#e9e9e9] rounded shadow-[0px_2.402px_3.203px_0px_rgba(0,0,0,0.03)]">
                        <div className="flex flex-row gap-2 items-center justify-start px-6 py-2 w-full">
                          <div className="flex flex-row gap-2 items-center justify-start w-[144.936px]">
                            <div className="font-normal text-[#2a2a2f] text-[12px] leading-[14px]">
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </div>
                          </div>
                          <div className="bg-white box-border flex flex-row gap-2 items-center justify-start px-2.5 py-2.5 rounded w-full lg:w-[360px] border border-[#e9e9e9]">
                            {renderField(field)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Live Preview Section */}
            <div className="bg-white box-border flex flex-col h-[605px] items-center justify-start w-full lg:w-[480px] border border-[#e9e9e9] rounded-tl-[8px] rounded-tr-[8px]">
              <div className="flex flex-row gap-2.5 h-14 items-center justify-start p-4 w-full border-b border-[#e9e9e9]">
                <div className="font-semibold text-[#a1a1a1] text-[14px] leading-[16px]">
                  Live preview
                </div>
              </div>
              <div className="flex-1 w-full flex items-center justify-center p-4">
                <MobilePreview formData={formData} campaignType={campaignType} selectedFeedbackType={selectedFeedbackType} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
