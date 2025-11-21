"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { BusinessFeatures } from "@/lib/api/types";
import { useEffect, useState } from 'react';
import ConfirmationDialog from "./ui/ConfirmationDialog";
import { ShoppingCart, Zap, Settings, Bug, LogOut, Lock, Filter, Pencil } from "lucide-react";

// Add custom styles for animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-slideUp {
    animation: slideUp 0.4s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// SVG Icons as React components
const DashboardIcon = ({colorCode}: {colorCode: string}) => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M2 1.33333C2.36819 1.33333 2.66667 1.63181 2.66667 1.99999V12.6667C2.66667 12.8435 2.73691 13.013 2.86193 13.1381C2.98696 13.2631 3.15653 13.3333 3.33334 13.3333H14C14.3682 13.3333 14.6667 13.6318 14.6667 14C14.6667 14.3682 14.3682 14.6667 14 14.6667H3.33334C2.8029 14.6667 2.29419 14.4559 1.91912 14.0809C1.54405 13.7058 1.33334 13.1971 1.33334 12.6667V1.99999C1.33334 1.63181 1.63181 1.33333 2 1.33333Z" fill={ colorCode} />
<path fillRule="evenodd" clipRule="evenodd" d="M12.1953 5.52859C12.4556 5.26824 12.8777 5.26824 13.1381 5.52859C13.3984 5.78894 13.3984 6.21105 13.1381 6.4714L9.80474 9.80473C9.54439 10.0651 9.12228 10.0651 8.86193 9.80473L6.66667 7.60947L5.13807 9.13807C4.87772 9.39842 4.45561 9.39842 4.19526 9.13807C3.93491 8.87772 3.93491 8.45561 4.19526 8.19526L6.19526 6.19526C6.45561 5.93491 6.87772 5.93491 7.13807 6.19526L9.33333 8.39052L12.1953 5.52859Z" fill={ colorCode} />
</svg>

);

const DataCenterIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M2.66667 3.3333L2.66667 3.33334C2.66667 3.33382 2.6666 3.33663 2.66871 3.34353C2.67097 3.35096 2.67655 3.36564 2.69005 3.38763C2.71835 3.43372 2.77606 3.50302 2.88416 3.58822C3.10428 3.76169 3.46411 3.94707 3.96818 4.1151C4.96935 4.44882 6.39486 4.66667 8 4.66667C9.60514 4.66667 11.0307 4.44882 12.0318 4.1151C12.5359 3.94707 12.8957 3.76169 13.1158 3.58822C13.224 3.50302 13.2817 3.43372 13.31 3.38763C13.3235 3.36564 13.329 3.35096 13.3313 3.34353C13.3334 3.33663 13.3333 3.33382 13.3333 3.33334V3.3333C13.3333 3.3327 13.3333 3.32986 13.3313 3.32314C13.329 3.31571 13.3235 3.30104 13.31 3.27905C13.2817 3.23296 13.224 3.16365 13.1158 3.07846C12.8957 2.90498 12.5359 2.7196 12.0318 2.55158C11.0307 2.21786 9.60514 2.00001 8 2.00001C6.39486 2.00001 4.96935 2.21786 3.96818 2.55158C3.46411 2.7196 3.10428 2.90498 2.88416 3.07846C2.77606 3.16365 2.71835 3.23296 2.69005 3.27905C2.67655 3.30104 2.67097 3.31571 2.66871 3.32314C2.66666 3.32986 2.66667 3.3327 2.66667 3.3333ZM3.54654 1.28667C4.71694 0.896536 6.29143 0.666672 8 0.666672C9.70857 0.666672 11.2831 0.896536 12.4535 1.28667C13.0352 1.48057 13.554 1.72616 13.9411 2.03124C14.3207 2.3304 14.6667 2.76537 14.6667 3.33334C14.6667 3.9013 14.3207 4.33628 13.9411 4.63544C13.554 4.94052 13.0352 5.1861 12.4535 5.38001C11.2831 5.77014 9.70857 6.00001 8 6.00001C6.29143 6.00001 4.71694 5.77014 3.54654 5.38001C2.96483 5.1861 2.44598 4.94052 2.05886 4.63544C1.67926 4.33628 1.33334 3.9013 1.33334 3.33334C1.33334 2.76537 1.67926 2.3304 2.05886 2.03124C2.44598 1.72616 2.96483 1.48057 3.54654 1.28667Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M2 2.66667C2.36819 2.66667 2.66667 2.96515 2.66667 3.33334V12.6667C2.66667 12.6667 2.66667 12.6667 2.66668 12.6668C2.66669 12.667 2.66671 12.6672 2.66678 12.6677C2.66691 12.6686 2.66727 12.6706 2.66829 12.674C2.67029 12.6807 2.67541 12.6947 2.6881 12.7158C2.71461 12.76 2.7696 12.8281 2.87469 12.9127C3.08874 13.0849 3.44674 13.2746 3.96818 13.4484C5.00667 13.7946 6.45749 14 8 14C9.54252 14 10.9933 13.7946 12.0318 13.4484C12.5533 13.2746 12.9113 13.0849 13.1253 12.9127C13.2304 12.8281 13.2854 12.76 13.3119 12.7158C13.3246 12.6947 13.3297 12.6807 13.3317 12.674C13.3327 12.6706 13.3331 12.6686 13.3332 12.6677C13.3333 12.6672 13.3333 12.667 13.3333 12.6668C13.3333 12.6667 13.3333 12.6667 13.3333 12.6667V3.33334C13.3333 2.96515 13.6318 2.66667 14 2.66667C14.3682 2.66667 14.6667 2.96515 14.6667 3.33334V12.6667C14.6667 13.2168 14.3384 13.6479 13.9612 13.9514C13.5779 14.2599 13.0572 14.5121 12.4535 14.7133C11.2415 15.1173 9.64009 15.3333 8 15.3333C6.35992 15.3333 4.75849 15.1173 3.54654 14.7133C2.94277 14.5121 2.42209 14.2599 2.03876 13.9514C1.6616 13.6479 1.33334 13.2168 1.33334 12.6667V3.33334C1.33334 2.96515 1.63181 2.66667 2 2.66667Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M2 7.33333C2.36819 7.33333 2.66667 7.63181 2.66667 7.99999V8C2.66667 8.00001 2.66667 8.00005 2.66668 8.00017C2.66669 8.00029 2.66671 8.00057 2.66678 8.00103C2.66691 8.0019 2.66727 8.00395 2.66829 8.00735C2.67029 8.01406 2.67541 8.02798 2.6881 8.04914C2.71461 8.09335 2.7696 8.16142 2.87469 8.24599C3.08874 8.41824 3.44674 8.60794 3.96818 8.78175C5.00667 9.12792 6.45749 9.33333 8 9.33333C9.54252 9.33333 10.9933 9.12792 12.0318 8.78175C12.5533 8.60794 12.9113 8.41824 13.1253 8.24599C13.2304 8.16142 13.2854 8.09335 13.3119 8.04914C13.3246 8.02798 13.3297 8.01406 13.3317 8.00735C13.3327 8.00395 13.3331 8.0019 13.3332 8.00103C13.3333 8.00057 13.3333 8.00029 13.3333 8.00017C13.3333 8.00005 13.3333 8 13.3333 7.99999C13.3333 7.63181 13.6318 7.33333 14 7.33333C14.3682 7.33333 14.6667 7.63181 14.6667 7.99999C14.6667 8.55016 14.3384 8.98122 13.9612 9.28474C13.5779 9.59321 13.0572 9.84541 12.4535 10.0467C11.2415 10.4506 9.64009 10.6667 8 10.6667C6.35992 10.6667 4.75849 10.4506 3.54654 10.0467C2.94277 9.84541 2.42209 9.59321 2.03876 9.28474C1.6616 8.98122 1.33334 8.55016 1.33334 7.99999C1.33334 7.63181 1.63181 7.33333 2 7.33333Z" fill={colorCode}/>
</svg>

);

const CohortsIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M2.42402 9.75736C3.54924 8.63214 5.07537 8 6.66666 8C8.25796 8 9.78409 8.63214 10.9093 9.75736C12.0345 10.8826 12.6667 12.4087 12.6667 14C12.6667 14.3682 12.3682 14.6667 12 14.6667C11.6318 14.6667 11.3333 14.3682 11.3333 14C11.3333 12.7623 10.8417 11.5753 9.9665 10.7002C9.09133 9.825 7.90434 9.33333 6.66666 9.33333C5.42899 9.33333 4.242 9.825 3.36683 10.7002C2.49166 11.5753 2 12.7623 2 14C2 14.3682 1.70152 14.6667 1.33333 14.6667C0.965141 14.6667 0.666664 14.3682 0.666664 14C0.666664 12.4087 1.29881 10.8826 2.42402 9.75736Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M6.66666 2.66668C5.1939 2.66668 4 3.86058 4 5.33334C4 6.8061 5.1939 8.00001 6.66666 8.00001C8.13942 8.00001 9.33333 6.8061 9.33333 5.33334C9.33333 3.86058 8.13942 2.66668 6.66666 2.66668ZM2.66666 5.33334C2.66666 3.1242 4.45753 1.33334 6.66666 1.33334C8.8758 1.33334 10.6667 3.1242 10.6667 5.33334C10.6667 7.54248 8.8758 9.33334 6.66666 9.33334C4.45753 9.33334 2.66666 7.54248 2.66666 5.33334Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M11.1266 2.12652C11.3144 1.80984 11.7234 1.70538 12.0401 1.89321C12.6056 2.22862 13.0797 2.69826 13.4205 3.26057C13.7612 3.82288 13.9581 4.46051 13.9937 5.11705C14.0293 5.77358 13.9025 6.42877 13.6245 7.02462C13.462 7.37307 13.2507 7.69494 12.998 7.98107C14.2457 9.19646 15.3333 11.1855 15.3333 13.3333C15.3333 13.7015 15.0349 13.9999 14.6667 13.9999C14.2985 13.9999 14 13.7015 14 13.3333C14 11.3261 12.7907 9.42628 11.6 8.53327C11.4321 8.40738 11.3333 8.20981 11.3333 7.99999C11.3333 7.79017 11.4321 7.59259 11.5999 7.46667C11.9505 7.20362 12.2309 6.85818 12.4162 6.46095C12.6015 6.06371 12.686 5.62692 12.6623 5.18923C12.6386 4.75154 12.5073 4.32645 12.2802 3.95158C12.053 3.57671 11.7369 3.26361 11.3599 3.04C11.0432 2.85218 10.9388 2.4432 11.1266 2.12652Z" fill={colorCode}/>
</svg>

);

const CampaignsIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M14.4034 3.46926C14.5693 3.59533 14.6667 3.79168 14.6667 4.00002V12C14.6667 12.2022 14.5749 12.3935 14.4172 12.52C14.2594 12.6466 14.0528 12.6947 13.8554 12.6508L1.85538 9.98414C1.55036 9.91636 1.33334 9.64582 1.33334 9.33335V7.33335C1.33334 7.03388 1.53303 6.77116 1.82157 6.691L13.8216 3.35767C14.0223 3.30191 14.2376 3.3432 14.4034 3.46926ZM2.66667 7.84007V8.79857L13.3333 11.1689V4.87711L2.66667 7.84007Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M4.04393 9.49067C4.39886 9.58858 4.60722 9.95568 4.5093 10.3106C4.46255 10.4801 4.44963 10.6571 4.4713 10.8316C4.49296 11.0061 4.54878 11.1746 4.63557 11.3275C4.72236 11.4805 4.83841 11.6148 4.97711 11.7228C5.11581 11.8309 5.27443 11.9106 5.44393 11.9573C5.61342 12.0041 5.79047 12.017 5.96495 11.9953C6.13943 11.9737 6.30794 11.9179 6.46086 11.8311C6.61377 11.7443 6.74809 11.6282 6.85615 11.4895C6.96421 11.3508 7.04389 11.1922 7.09065 11.0227C7.18856 10.6678 7.55566 10.4594 7.9106 10.5573C8.26553 10.6552 8.47388 11.0223 8.37597 11.3773C8.28265 11.7156 8.12362 12.0322 7.90794 12.309C7.69227 12.5858 7.42419 12.8174 7.119 12.9906C6.81381 13.1639 6.47749 13.2753 6.12924 13.3185C5.78099 13.3618 5.42764 13.336 5.08936 13.2427C4.75107 13.1493 4.43448 12.9903 4.15766 12.7746C3.88084 12.559 3.64921 12.2909 3.47599 11.9857C3.30277 11.6805 3.19136 11.3442 3.14813 10.9959C3.10489 10.6477 3.13066 10.2943 3.22398 9.95604C3.32189 9.60111 3.689 9.39275 4.04393 9.49067Z" fill={colorCode}/>
</svg>

);

const TemplatesIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M3.33334 2.66668C3.15652 2.66668 2.98696 2.73691 2.86193 2.86194C2.73691 2.98696 2.66667 3.15653 2.66667 3.33334V11.3333C2.66667 11.8638 2.87738 12.3725 3.25246 12.7476C3.62753 13.1226 4.13624 13.3333 4.66667 13.3333C5.1971 13.3333 5.70581 13.1226 6.08088 12.7476C6.45596 12.3725 6.66667 11.8638 6.66667 11.3333V3.33334C6.66667 3.15653 6.59643 2.98696 6.47141 2.86194C6.34638 2.73691 6.17681 2.66668 6 2.66668H3.33334ZM1.91912 1.91913C2.2942 1.54406 2.8029 1.33334 3.33334 1.33334H6C6.53044 1.33334 7.03914 1.54406 7.41422 1.91913C7.78929 2.2942 8 2.80291 8 3.33334V11.3333C8 12.2174 7.64881 13.0652 7.02369 13.6904C6.39857 14.3155 5.55072 14.6667 4.66667 14.6667C3.78261 14.6667 2.93477 14.3155 2.30965 13.6904C1.68453 13.0652 1.33334 12.2174 1.33334 11.3333V3.33334C1.33334 2.80291 1.54405 2.2942 1.91912 1.91913Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M10.4667 8.66667C10.4667 8.29848 10.7651 8 11.1333 8H12.6667C13.1971 8 13.7058 8.21071 14.0809 8.58579C14.456 8.96086 14.6667 9.46957 14.6667 10V12.6667C14.6667 13.1971 14.456 13.7058 14.0809 14.0809C13.7058 14.456 13.1971 14.6667 12.6667 14.6667H4.66667C4.29848 14.6667 4 14.3682 4 14C4 13.6318 4.29848 13.3333 4.66667 13.3333H12.6667C12.8435 13.3333 13.013 13.2631 13.1381 13.1381C13.2631 13.013 13.3333 12.8435 13.3333 12.6667V10C13.3333 9.82319 13.2631 9.65362 13.1381 9.5286C13.013 9.40357 12.8435 9.33333 12.6667 9.33333H11.1333C10.7651 9.33333 10.4667 9.03486 10.4667 8.66667Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M4 11.3333C4 10.9651 4.29848 10.6667 4.66667 10.6667H4.67333C5.04152 10.6667 5.34 10.9651 5.34 11.3333C5.34 11.7015 5.04152 12 4.67333 12H4.66667C4.29848 12 4 11.7015 4 11.3333Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M10.0011 3.99605C9.87808 3.99591 9.75624 4.02009 9.64259 4.0672C9.52895 4.11431 9.42573 4.18343 9.33889 4.27057L7.80474 5.80473C7.54439 6.06508 7.12228 6.06508 6.86193 5.80473C6.60158 5.54438 6.60158 5.12227 6.86193 4.86192L8.39444 3.32941C8.39459 3.32926 8.39474 3.32911 8.39489 3.32895C8.6057 3.11753 8.8562 2.94984 9.132 2.83551C9.408 2.72109 9.7039 2.66237 10.0027 2.66272C10.3014 2.66307 10.5972 2.72249 10.8729 2.83755C11.1482 2.95242 11.3981 3.12049 11.6083 3.33212C11.6086 3.33247 11.609 3.33283 11.6093 3.33318L12.8672 4.59107C13.0826 4.79957 13.2546 5.04875 13.373 5.32419C13.4924 5.60178 13.5551 5.90045 13.5574 6.20262C13.5597 6.5048 13.5015 6.80438 13.3864 7.08375C13.2715 7.36241 13.1022 7.61535 12.8884 7.82777L7.07248 13.6703C6.81273 13.9313 6.39062 13.9322 6.12968 13.6725C5.86873 13.4127 5.86777 12.9906 6.12752 12.7297L11.9449 6.88566C11.9459 6.88463 11.9469 6.8836 11.948 6.88257C12.0363 6.79496 12.1063 6.69057 12.1537 6.57554C12.2011 6.4605 12.2251 6.33714 12.2241 6.21272C12.2232 6.0883 12.1974 5.96531 12.1482 5.85101C12.099 5.7367 12.0275 5.63339 11.9378 5.54713C11.9347 5.54413 11.9316 5.54111 11.9286 5.53806L10.6646 4.27406C10.664 4.27342 10.6633 4.27277 10.6627 4.27213C10.576 4.18478 10.473 4.11542 10.3595 4.06804C10.2459 4.02066 10.1241 3.9962 10.0011 3.99605Z" fill={colorCode}/>
</svg>

);

const AIServicesIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_104_2108)">
<path fillRule="evenodd" clipRule="evenodd" d="M4 3.33333C3.63181 3.33333 3.33333 3.63181 3.33333 4V12C3.33333 12.3682 3.63181 12.6667 4 12.6667H12C12.3682 12.6667 12.6667 12.3682 12.6667 12V4C12.6667 3.63181 12.3682 3.33333 12 3.33333H4ZM2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M6.66667 6.66668V9.33334H9.33334V6.66668H6.66667ZM5.33334 6.66668C5.33334 5.9303 5.93029 5.33334 6.66667 5.33334H9.33334C10.0697 5.33334 10.6667 5.9303 10.6667 6.66668V9.33334C10.6667 10.0697 10.0697 10.6667 9.33334 10.6667H6.66667C5.93029 10.6667 5.33334 10.0697 5.33334 9.33334V6.66668Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M10 0.666656C10.3682 0.666656 10.6667 0.965133 10.6667 1.33332V2.66666C10.6667 3.03485 10.3682 3.33332 10 3.33332C9.63181 3.33332 9.33334 3.03485 9.33334 2.66666V1.33332C9.33334 0.965133 9.63181 0.666656 10 0.666656Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M10 12.6667C10.3682 12.6667 10.6667 12.9651 10.6667 13.3333V14.6667C10.6667 15.0348 10.3682 15.3333 10 15.3333C9.63181 15.3333 9.33334 15.0348 9.33334 14.6667V13.3333C9.33334 12.9651 9.63181 12.6667 10 12.6667Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M0.666664 10C0.666664 9.63182 0.965141 9.33334 1.33333 9.33334H2.66666C3.03485 9.33334 3.33333 9.63182 3.33333 10C3.33333 10.3682 3.03485 10.6667 2.66666 10.6667H1.33333C0.965141 10.6667 0.666664 10.3682 0.666664 10Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M0.666664 6.00001C0.666664 5.63182 0.965141 5.33334 1.33333 5.33334H2.66666C3.03485 5.33334 3.33333 5.63182 3.33333 6.00001C3.33333 6.3682 3.03485 6.66668 2.66666 6.66668H1.33333C0.965141 6.66668 0.666664 6.3682 0.666664 6.00001Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M12.6667 10C12.6667 9.63182 12.9651 9.33334 13.3333 9.33334H14.6667C15.0349 9.33334 15.3333 9.63182 15.3333 10C15.3333 10.3682 15.0349 10.6667 14.6667 10.6667H13.3333C12.9651 10.6667 12.6667 10.3682 12.6667 10Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M12.6667 6.00001C12.6667 5.63182 12.9651 5.33334 13.3333 5.33334H14.6667C15.0349 5.33334 15.3333 5.63182 15.3333 6.00001C15.3333 6.3682 15.0349 6.66668 14.6667 6.66668H13.3333C12.9651 6.66668 12.6667 6.3682 12.6667 6.00001Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M6 0.666656C6.36819 0.666656 6.66667 0.965133 6.66667 1.33332V2.66666C6.66667 3.03485 6.36819 3.33332 6 3.33332C5.63181 3.33332 5.33334 3.03485 5.33334 2.66666V1.33332C5.33334 0.965133 5.63181 0.666656 6 0.666656Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M6 12.6667C6.36819 12.6667 6.66667 12.9651 6.66667 13.3333V14.6667C6.66667 15.0348 6.36819 15.3333 6 15.3333C5.63181 15.3333 5.33334 15.0348 5.33334 14.6667V13.3333C5.33334 12.9651 5.63181 12.6667 6 12.6667Z" fill={colorCode}/>
</g>
<defs>
<clipPath id="clip0_104_2108">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>

);

const BusinessServicesIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M7.33334 8.00001C7.33334 7.63182 7.63181 7.33334 8 7.33334H8.00667C8.37486 7.33334 8.67334 7.63182 8.67334 8.00001C8.67334 8.3682 8.37486 8.66668 8.00667 8.66668H8C7.63181 8.66668 7.33334 8.3682 7.33334 8.00001Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M5.25245 1.25244C5.62752 0.87737 6.13623 0.666656 6.66666 0.666656H9.33333C9.86376 0.666656 10.3725 0.87737 10.7475 1.25244C11.1226 1.62752 11.3333 2.13622 11.3333 2.66666V3.99999C11.3333 4.36818 11.0349 4.66666 10.6667 4.66666C10.2985 4.66666 10 4.36818 10 3.99999V2.66666C10 2.48985 9.92976 2.32028 9.80473 2.19525C9.67971 2.07023 9.51014 1.99999 9.33333 1.99999H6.66666C6.48985 1.99999 6.32028 2.07023 6.19526 2.19525C6.07024 2.32028 6 2.48985 6 2.66666V3.99999C6 4.36818 5.70152 4.66666 5.33333 4.66666C4.96514 4.66666 4.66666 4.36818 4.66666 3.99999V2.66666C4.66666 2.13622 4.87738 1.62752 5.25245 1.25244Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M0.776983 8.29937C0.979843 7.9921 1.39338 7.90747 1.70065 8.11033C3.5698 9.34436 5.76024 10.0022 8 10.0022C10.2398 10.0022 12.4302 9.34436 14.2994 8.11033C14.6066 7.90747 15.0202 7.9921 15.223 8.29937C15.4259 8.60663 15.3412 9.02017 15.034 9.22303C12.9469 10.601 10.501 11.3355 8 11.3355C5.49904 11.3355 3.05315 10.601 0.966026 9.22303C0.658761 9.02017 0.574124 8.60663 0.776983 8.29937Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M2.66666 4.66668C2.29847 4.66668 2 4.96515 2 5.33334V12C2 12.3682 2.29847 12.6667 2.66666 12.6667H13.3333C13.7015 12.6667 14 12.3682 14 12V5.33334C14 4.96515 13.7015 4.66668 13.3333 4.66668H2.66666ZM0.666664 5.33334C0.666664 4.22877 1.56209 3.33334 2.66666 3.33334H13.3333C14.4379 3.33334 15.3333 4.22877 15.3333 5.33334V12C15.3333 13.1046 14.4379 14 13.3333 14H2.66666C1.56209 14 0.666664 13.1046 0.666664 12V5.33334Z" fill={colorCode}/>
</svg>

);

const AchievementsIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_104_2134)">
<path fillRule="evenodd" clipRule="evenodd" d="M3 3.33333C2.73478 3.33333 2.48043 3.43869 2.29289 3.62623C2.10535 3.81376 2 4.06812 2 4.33333C2 4.59855 2.10535 4.8529 2.29289 5.04044C2.48043 5.22798 2.73478 5.33333 3 5.33333H4C4.36819 5.33333 4.66666 5.63181 4.66666 6C4.66666 6.36819 4.36819 6.66667 4 6.66667H3C2.38116 6.66667 1.78767 6.42083 1.35008 5.98325C0.912497 5.54566 0.666664 4.95217 0.666664 4.33333C0.666664 3.71449 0.912497 3.121 1.35008 2.68342C1.78767 2.24583 2.38116 2 3 2H4C4.36819 2 4.66666 2.29848 4.66666 2.66667C4.66666 3.03486 4.36819 3.33333 4 3.33333H3Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M11.3333 2.66667C11.3333 2.29848 11.6318 2 12 2H13C13.6188 2 14.2123 2.24583 14.6499 2.68342C15.0875 3.121 15.3333 3.71449 15.3333 4.33333C15.3333 4.95217 15.0875 5.54566 14.6499 5.98325C14.2123 6.42083 13.6188 6.66667 13 6.66667H12C11.6318 6.66667 11.3333 6.36819 11.3333 6C11.3333 5.63181 11.6318 5.33333 12 5.33333H13C13.2652 5.33333 13.5196 5.22798 13.7071 5.04044C13.8946 4.8529 14 4.59855 14 4.33333C14 4.06812 13.8946 3.81376 13.7071 3.62623C13.5196 3.43869 13.2652 3.33333 13 3.33333H12C11.6318 3.33333 11.3333 3.03486 11.3333 2.66667Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M2 14.6667C2 14.2985 2.29848 14 2.66667 14H13.3333C13.7015 14 14 14.2985 14 14.6667C14 15.0349 13.7015 15.3333 13.3333 15.3333H2.66667C2.29848 15.3333 2 15.0349 2 14.6667Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M6.66667 9.10669C7.03486 9.10669 7.33333 9.40517 7.33333 9.77336V11.3334C7.33333 12.1002 6.70747 12.5576 6.2986 12.7457L6.29742 12.7462C5.81268 12.9681 5.33333 13.6745 5.33333 14.6667C5.33333 15.0349 5.03486 15.3334 4.66667 15.3334C4.29848 15.3334 4 15.0349 4 14.6667C4 13.3125 4.65372 12.0325 5.74189 11.5341C5.84344 11.4873 5.92218 11.4283 5.96737 11.3768C5.98972 11.3514 5.99757 11.3357 6 11.3292V9.77336C6 9.40517 6.29848 9.10669 6.66667 9.10669ZM6.00094 11.3257C6.00103 11.3257 6.00091 11.3266 6.0003 11.3284C6.00054 11.3266 6.00084 11.3257 6.00094 11.3257Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M9.33333 9.10669C9.70152 9.10669 10 9.40517 10 9.77336V11.3292C10.0024 11.3357 10.0103 11.3514 10.0326 11.3768C10.0778 11.4283 10.1566 11.4873 10.2581 11.5341C11.3463 12.0325 12 13.3125 12 14.6667C12 15.0349 11.7015 15.3334 11.3333 15.3334C10.9651 15.3334 10.6667 15.0349 10.6667 14.6667C10.6667 13.6745 10.1873 12.9681 9.70258 12.7462L9.70139 12.7457C9.29253 12.5576 8.66666 12.1002 8.66666 11.3334V9.77336C8.66666 9.40517 8.96514 9.10669 9.33333 9.10669ZM9.99906 11.3257C9.99915 11.3257 9.99946 11.3266 9.9997 11.3284C9.99908 11.3266 9.99897 11.3257 9.99906 11.3257Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M3.33334 1.33335C3.33334 0.965164 3.63181 0.666687 4 0.666687H12C12.3682 0.666687 12.6667 0.965164 12.6667 1.33335V6.00002C12.6667 7.2377 12.175 8.42468 11.2998 9.29985C10.4247 10.175 9.23768 10.6667 8 10.6667C6.76233 10.6667 5.57534 10.175 4.70017 9.29985C3.825 8.42468 3.33334 7.2377 3.33334 6.00002V1.33335ZM4.66667 2.00002V6.00002C4.66667 6.88408 5.01786 7.73192 5.64298 8.35704C6.2681 8.98216 7.11595 9.33335 8 9.33335C8.88406 9.33335 9.73191 8.98216 10.357 8.35704C10.9821 7.73192 11.3333 6.88408 11.3333 6.00002V2.00002H4.66667Z" fill={colorCode}/>
</g>
<defs>
<clipPath id="clip0_104_2134">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
);

const CalendarIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M5.33333 1.33334C5.70152 1.33334 6 1.63182 6 2.00001V2.66668H10V2.00001C10 1.63182 10.2985 1.33334 10.6667 1.33334C11.0349 1.33334 11.3333 1.63182 11.3333 2.00001V2.66668H12C12.7073 2.66668 13.3855 2.94763 13.8856 3.44773C14.3857 3.94782 14.6667 4.62611 14.6667 5.33334V12C14.6667 12.7073 14.3857 13.3855 13.8856 13.8856C13.3855 14.3857 12.7073 14.6667 12 14.6667H4C3.29276 14.6667 2.61448 14.3857 2.11438 13.8856C1.61428 13.3855 1.33333 12.7073 1.33333 12V5.33334C1.33333 4.62611 1.61428 3.94782 2.11438 3.44773C2.61448 2.94763 3.29276 2.66668 4 2.66668H4.66667V2.00001C4.66667 1.63182 4.96514 1.33334 5.33333 1.33334ZM4.66667 4.00001H4C3.64638 4.00001 3.30724 4.14048 3.05719 4.39053C2.80714 4.64058 2.66667 4.97972 2.66667 5.33334V12C2.66667 12.3536 2.80714 12.6928 3.05719 12.9428C3.30724 13.1929 3.64638 13.3333 4 13.3333H12C12.3536 13.3333 12.6928 13.1929 12.9428 12.9428C13.1929 12.6928 13.3333 12.3536 13.3333 12V5.33334C13.3333 4.97972 13.1929 4.64058 12.9428 4.39053C12.6928 4.14048 12.3536 4.00001 12 4.00001H11.3333V4.66668C11.3333 5.03487 11.0349 5.33334 10.6667 5.33334C10.2985 5.33334 10 5.03487 10 4.66668V4.00001H6V4.66668C6 5.03487 5.70152 5.33334 5.33333 5.33334C4.96514 5.33334 4.66667 5.03487 4.66667 4.66668V4.00001Z" fill={colorCode}/>
<path fillRule="evenodd" clipRule="evenodd" d="M1.33333 6.66667C1.33333 6.29849 1.63181 6 2 6H14C14.3682 6 14.6667 6.29849 14.6667 6.66667C14.6667 7.03486 14.3682 7.33334 14 7.33334H2C1.63181 7.33334 1.33333 7.03486 1.33333 6.66667Z" fill={colorCode}/>
</svg>
);

const UpsellCrossSellIcon = ({colorCode}: {colorCode: string}) => (
  <ShoppingCart size={16} color={colorCode} />
);

const WorkflowAutomationIcon = ({colorCode}: {colorCode: string}) => (
  <Zap size={16} color={colorCode} />
);

const CustomerFunnelIcon = ({colorCode}: {colorCode: string}) => (
  <Filter size={16} color={colorCode} />
);

const BusinessRecordsIcon = ({colorCode}: {colorCode: string}) => (
  <Pencil size={16} color={colorCode} />
);

const SettingsIcon = ({colorCode}: {colorCode: string}) => (
  <Settings size={20} color={colorCode} />
);

const LogoutIcon = () => (
  <LogOut size={18} color="#2A2A2F" />
);

const BugIcon = ({colorCode}: {colorCode: string}) => (
  <Bug size={20} color={colorCode} />
);

const PlusIcon = ({colorCode}: {colorCode: string}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 6H11M6 11V1" stroke={colorCode} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

);

const LockIcon = ({colorCode}: {colorCode: string}) => (
  <Lock size={12} color={colorCode} />
);



const getMenuItems = (hasFeature: (feature: keyof BusinessFeatures) => boolean) => [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview & analytics",
    icon: DashboardIcon,
    href: "/dashboard",
    active: true,
    notificationCount: 3,
    featureKey: "dashboard" as const
  },
  {
    id: "data-center",
    label: "Data centre",
    description: "Manage your data",
    icon: DataCenterIcon,
    href: "/data-center",
    notificationCount: 0,
    featureKey: "data_center" as const
  },
  {
    id: "customer-funnel",
    label: "Customer Funnel",
    description: "Analyze customer journeys",
    icon: CustomerFunnelIcon,
    href: "/customer-funnel",
    notificationCount: 0,
    featureKey: "customer_funnel" as const
  },
  {
    id: "campaigns",
    label: "Campaigns",
    description: "Marketing campaigns",
    icon: CampaignsIcon,
    href: "/campaigns",
    notificationCount: 25,
    featureKey: "campaigns" as const
  },
  {
    id: "achievements",
    label: "Achievements",
    description: "Goals & milestones",
    icon: AchievementsIcon,
    href: "/achievements",
    notificationCount: 0,
    featureKey: "achievements" as const
  },
  // {
  //   id: "workflow-automation",
  //   label: "Automation",
  //   description: "Automate communications",
  //   icon: WorkflowAutomationIcon,
  //   href: "/workflow-automation",
  //   notificationCount: 7,
  //   featureKey: "automation" as const
  // },
  {
    id: "business-records",
    label: "Business Records",
    description: "Add & manage records",
    icon: BusinessRecordsIcon,
    href: "/business-log",
    notificationCount: 0,
    featureKey: "dashboard" as const
  },
  // { id: "templates", label: "Templates", icon: TemplatesIcon, href: "/templates" },
  // {
  //   id: "upsell-cross-sell",
  //   label: "Upsell & cross sell",
  //   description: "Sell products & services",
  //   icon: UpsellCrossSellIcon,
  //   href: "/upsell-cross-sell",
  //   notificationCount: 0
  // },
  // {
  //   id: "business-services",
  //   label: "Business services",
  //   description: "Enterprise solutions",
  //   icon: BusinessServicesIcon,
  //   href: "/business-services",
  //   notificationCount: 0
  // },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isMobile, isMobileOpen, closeMobileSidebar } = useSidebar();
  const { logout, user } = useAuth();
  const { hasFeature, isLoading: featuresLoading, features } = useBusiness();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    id: string;
    label: string;
    description: string;
    top: number;
    left: number;
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showServiceDialog, setShowServiceDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Force collapsed state on desktop, expanded on mobile
  const actualIsCollapsed = isMobile ? false : true;

  useEffect(() => {
    if (!actualIsCollapsed) {
      setTooltip(null);
    }
  }, [actualIsCollapsed]);

  // Close mobile sidebar using context

  // Service dialog handlers
  const handleServiceClick = (item: any) => {
    setSelectedService(item);
    setShowServiceDialog(true);
  };

  const handleEnableService = () => {
    setShowServiceDialog(false);
    setShowSuccessMessage(true);
  };

  const handleCloseService = () => {
    setShowServiceDialog(false);
    setSelectedService(null);
  };

  const handleServiceBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseService();
    }
  };

  const handleSuccessBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSuccessMessage(false);
    }
  };

  return (
    <>
    <div className={`sidebar-mobile fixed left-0 top-0 h-full bg-[#f6f6f6] lg:bg-white flex flex-col z-50 lg:z-auto transition-all duration-300 ease-in-out border-r border-gray-200 ${
      actualIsCollapsed ? 'w-16' : isMobile ? 'w-[197px]' : 'w-[232px]'
    } ${actualIsCollapsed ? 'overflow-visible' : 'overflow-hidden'} ${isMobile && isMobileOpen ? 'open' : ''}`}>
      {/* User Profile Section */}
      <div className={`p-3 pt-4 pb-3 sm:p-4 sm:pt-6 sm:pb-3 lg:pt-8 lg:pb-3 border-b border-[#f1f3f4] transition-all duration-300 ease-in-out ${actualIsCollapsed ? 'px-2' : ''}`}>
        <div className={`transition-all duration-300 ease-in-out ${actualIsCollapsed ? 'w-10 flex justify-center' : 'w-full'}`}>
          {!actualIsCollapsed && (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f8f9fa] transition-all duration-200">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-[#9747FF] to-[#9747FF] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#2a2a2f] font-manrope leading-tight truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-xs text-[#6b7280] font-manrope leading-tight">
                  {user?.user_type || 'Loading...'}
                </div>
              </div>
              {/* Cross icon for mobile */}
              {isMobile && (
                <button
                  onClick={closeMobileSidebar}
                  className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
                  aria-label="Close menu"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>
          )}
          {actualIsCollapsed && (
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-[#9747FF] to-[#9747FF] rounded-full flex items-center justify-center text-white font-semibold text-sm transition-all duration-200 cursor-pointer">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] border-2 border-white rounded-full"></div>
            </div>
          )}
          </div>
        </div>



      {/* Navigation Menu */}
      <nav className={`flex-1 px-2 sm:px-3 py-2 overflow-y-auto transition-all duration-300 ease-in-out ${actualIsCollapsed ? 'px-2' : ''}`}>
        <div className="space-y-4 sm:space-y-5">
          {getMenuItems(hasFeature).map((item) => {
            const Icon = item.icon;
            const isActive =
              (item.id === "dashboard" && pathname === "/dashboard") ||
              (item.id === "data-center" && pathname === "/data-center") ||
              (item.id === "campaigns" && pathname.startsWith("/campaigns")) ||
              (item.id === "workflow-automation" && pathname.startsWith("/workflow-automation")) ||
              (item.id === "customer-funnel" && pathname === "/customer-funnel") ||
              (item.id === "business-records" && pathname === "/business-log") ||
              (item.id !== "dashboard" && item.id !== "campaigns" && item.id !== "workflow-automation" && item.id !== "customer-funnel" && item.id !== "business-records" && pathname === item.href);

            const isDisabled = !hasFeature(item.featureKey);
            const effectiveIsActive = isActive && !isDisabled;

            return (
              <Link
                key={item.id}
                href={isDisabled ? "#" : item.href}
                className={`group rounded flex items-center relative ${
                  actualIsCollapsed ? 'overflow-visible w-10 h-10 justify-center px-0 py-0' : 'overflow-hidden w-full h-[40px] justify-start gap-3 px-2 py-2'
                } ${
                  isDisabled
                    ? 'cursor-not-allowed opacity-50 text-[#6b7280]'
                    : effectiveIsActive
                      ? "cursor-pointer bg-gradient-to-r from-[#9747FF]/10 to-[#9747FF]/10 text-[#9747FF] border border-[#9747FF]/20"
                      : "cursor-pointer text-[#2a2a2f] hover:bg-gradient-to-r hover:from-[#9747FF]/8 hover:to-[#9747FF]/8 hover:text-[#9747FF] hover:border hover:border-[#9747FF]/15"
                }`}
                aria-label={item.label}
                onMouseEnter={(event) => {
                  setHoveredItem(item.id);
                  if (actualIsCollapsed) {
                    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      id: item.id,
                      label: item.label,
                      description: item.description,
                      top: rect.top + rect.height / 2,
                      left: rect.right + 12,
                    });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                  setTooltip((current) => (current?.id === item.id ? null : current));
                }}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                  }
                  e.stopPropagation();
                }}
              >
                {/* Left-side indicator for selected state */}
                {effectiveIsActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#9747FF] rounded-r-full"></div>
                )}
                <div className="flex-shrink-0 relative">
                  <div className={`p-1 rounded-md ${
                    effectiveIsActive ? 'bg-[#9747FF]/10' : isDisabled ? '' : 'group-hover:bg-[#9747FF]/10'
                  }`}>
                  <Icon colorCode={isDisabled ? "#6b7280" : effectiveIsActive ? "#9747FF" : (hoveredItem === item.id ? "#9747FF" : "#2A2A2F")} />
                  </div>
                  {isDisabled && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                      <LockIcon colorCode="#6b7280" />
                    </div>
                  )}
                  {/* Notification Badge */}
                  {item.notificationCount > 0 && !isDisabled && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
                  actualIsCollapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-full'
                } justify-start`}>
                  <span className={`text-[14px] font-semibold font-manrope leading-[1.2] whitespace-nowrap ${
                    effectiveIsActive ? 'text-[#9747FF]' : isDisabled ? 'text-[#6b7280]' : 'text-[#2a2a2f] group-hover:text-[#9747FF]'
                }`}>
                  {item.label}
                </span>
                  <span className="text-[12px] font-normal font-manrope leading-[1.2] whitespace-nowrap text-[#8f8f91]">
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Privacy Message */}
      <div className={`px-3 py-1 transition-all duration-300 ease-in-out ${actualIsCollapsed ? 'px-2' : ''} ${isMobile ? 'mb-4' : ''}`}>
        <div className={`transition-all duration-300 ease-in-out ${
          actualIsCollapsed ? 'opacity-0 max-w-0 overflow-hidden' : 'opacity-100 max-w-full'
        }`}>
          <div className="text-center px-2 py-1">
            <span className="text-xs font-medium text-[#6c757d] font-manrope whitespace-nowrap">
              🔒 Your data stays private. Always.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={`border-t border-[#e9e9e9] p-1 mt-auto ${isMobile ? 'pb-6' : ''}`}>
        <div className={`flex items-center p-1 transition-all duration-300 ease-in-out ${
          actualIsCollapsed ? 'flex-col gap-0.5' : isMobile ? 'justify-center' : 'justify-between'
        }`}>
          <div className={`flex items-center transition-all duration-300 ease-in-out ${
            actualIsCollapsed ? 'flex-col gap-0.5' : isMobile ? 'gap-6' : 'gap-0.5'
          }`}>

            <Link
              href="/report-bug"
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors flex-shrink-0 ${
                pathname === '/report-bug'
                  ? "bg-[#9747FF0D] hover:bg-[#9747FF]/10"
                  : "hover:bg-gray-100"
              }`}
              title="Report Bug"
            >
              <BugIcon colorCode={pathname === '/report-bug' ? "#9747FF" : "#2A2A2F"} />
            </Link>
            <Link
              href="/settings"
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors flex-shrink-0 relative ${
                pathname === '/settings'
                  ? "bg-[#9747FF0D] hover:bg-[#9747FF]/10"
                  : "hover:bg-gray-100"
              }`}
              title="Settings"
            >
              <SettingsIcon colorCode={pathname === '/settings' ? "#9747FF" : "#2A2A2F"} />
              {/* Notification Badge for Settings */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </Link>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0 relative"
              title="Logout"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Confirm Logout"
        message="You're about to sign out of your account. Any unsaved changes will be lost. Are you sure you want to continue?"
        confirmText="Yes, Logout"
        cancelText="Stay Logged In"
        variant="warning"
        customPosition={{ bottom: 100, left: 20 }}
        icon={
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        }
      />
    </div>

    {/* Service Dialog - Outside sidebar container */}
    {showServiceDialog && selectedService && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}} onClick={handleServiceBackdropClick}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform animate-slideUp">
            {/* Header with gradient background */}
            <div className="relative bg-gradient-to-br from-slate-600 to-slate-800 rounded-t-2xl p-6 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative flex items-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <selectedService.icon colorCode="#ffffff" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedService.label}</h3>
                  <p className="text-white/80 text-sm">{selectedService.description}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">Service Not Available</h4>
                <p className="text-gray-600 leading-relaxed">
                  {selectedService.label} is not enabled yet for your business. Enable this service to start using powerful features.
                </p>
              </div>

              {/* Features preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">What you&apos;ll get:</h5>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#9747FF] rounded-full mr-3"></div>
                    Advanced {selectedService.label.toLowerCase()} features
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#9747FF] rounded-full mr-3"></div>
                    AI-powered insights
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#9747FF] rounded-full mr-3"></div>
                    Real-time analytics
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleEnableService}
                  className="flex-1 bg-gradient-to-r from-[#9747FF] to-[#9747FF] text-white px-6 py-3 rounded font-semibold text-sm hover:from-[#9747FF] hover:to-[#9747FF] hover:shadow-lg transition-all duration-300"
                >
                  Enable Service
                </button>
                <button
                  onClick={handleCloseService}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded font-semibold text-sm hover:bg-gray-200 transition-all duration-300"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    {/* Success Message - Outside sidebar container */}
    {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn" style={{backgroundColor: 'rgba(0, 0, 0, 0.75)'}} onClick={handleSuccessBackdropClick}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 transform animate-slideUp">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Request Received!</h3>
                <p className="text-white/90 text-sm">Your service enablement request has been submitted</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">What happens next?</h4>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We received your request and Tribly team has initiated the process. We&apos;ll send you communication once services are enabled.
                </p>
              </div>

              {/* Timeline */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">Process Timeline:</h5>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-600">Request submitted successfully</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-600">Team review in progress</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-gray-500">Service activation</span>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="w-full bg-gradient-to-r from-[#9747FF] to-[#9747FF] text-white px-6 py-3 rounded font-semibold text-sm hover:from-[#9747FF] hover:to-[#9747FF] hover:shadow-lg transition-all duration-300"
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}

    {actualIsCollapsed && tooltip && (
        <div
          className="pointer-events-none fixed z-[9999]"
          style={{ top: tooltip.top, left: tooltip.left, transform: "translateY(-50%)" }}
        >
          <div className="rounded bg-[#2A2A2F] px-3 py-1 shadow-lg border border-black/40">
            <div className="text-xs font-semibold text-white font-manrope whitespace-nowrap">
              {tooltip.label}
            </div>
            {!!tooltip.description && (
              <div className="text-[10px] text-gray-300 font-manrope whitespace-nowrap">
                {tooltip.description}
              </div>
            )}
          </div>
        </div>
    )}
    </>
  );
}
