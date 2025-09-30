"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSidebar } from "@/components/SidebarContext";
import { MobileHeaderButton } from "@/components/MobileHeaderButton";

interface CampaignType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'advertise' | 'engagement' | 'retention' | 'feedback';
  benefits: string[];
  category: string;
  color: string;
  gradient: string;
  badgeColor: string;
  badgeText: string;
  detailedBenefits: {
    title: string;
    description: string;
    keyMetrics: string[];
    businessImpact: string[];
    useCases: string[];
    roi: string;
  };
}

const EngagementIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#FFF5EF"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#FF6F1E" strokeOpacity="0.2"/>
    <path opacity="0.3" d="M18.0078 30.3633C18.2089 30.2889 18.4314 30.2968 18.6269 30.3848C19.6748 30.8617 20.8107 31.114 21.9619 31.127C23.1132 31.14 24.255 30.9132 25.3134 30.46C25.5092 30.386 25.7259 30.3897 25.9189 30.4708C26.1119 30.5518 26.2664 30.7039 26.3505 30.8956C26.4347 31.0873 26.442 31.3041 26.3711 31.501C26.3001 31.6978 26.1566 31.8602 25.9697 31.9542C24.7341 32.4858 23.4017 32.757 22.0566 32.7501C20.6395 32.7529 19.2383 32.4481 17.9502 31.8575C17.758 31.7642 17.6092 31.5998 17.5351 31.3995C17.4611 31.1992 17.4665 30.9781 17.5517 30.7823C17.6428 30.5882 17.8068 30.4378 18.0078 30.3633ZM16.9394 14.7676C17.0539 14.779 17.1648 14.8141 17.2646 14.8712C17.3646 14.9283 17.4516 15.0067 17.5195 15.0997C17.5872 15.1926 17.6343 15.2988 17.6582 15.4112C17.6821 15.5238 17.6824 15.6404 17.6582 15.753C17.6339 15.8655 17.5857 15.9717 17.5175 16.0645C17.4495 16.1571 17.3626 16.2343 17.2627 16.2911C16.3293 16.966 15.5475 17.8298 14.9697 18.8262C14.392 19.8224 14.0305 20.9292 13.9082 22.0743C13.887 22.2739 13.7932 22.459 13.6445 22.5938C13.4959 22.7285 13.3031 22.8041 13.1025 22.8057H13.0156C12.8053 22.7762 12.615 22.665 12.4863 22.4962C12.3574 22.327 12.3005 22.1132 12.3281 21.9024C12.4703 20.5346 12.8979 19.2119 13.583 18.0196C14.2681 16.8271 15.1955 15.7913 16.3056 14.9796C16.3903 14.9016 16.4905 14.8423 16.5996 14.8057C16.7087 14.7692 16.8248 14.7564 16.9394 14.7676ZM27.3769 14.9678C27.5776 14.9303 27.7856 14.9685 27.9589 15.0762C29.0387 15.8892 29.9387 16.9166 30.6045 18.0928C31.2702 19.2691 31.6868 20.5699 31.8281 21.9141C31.8399 22.02 31.8315 22.1273 31.8017 22.2295C31.7719 22.3319 31.7212 22.4269 31.6543 22.5098C31.5873 22.5928 31.5049 22.6622 31.4111 22.7129C31.3174 22.7637 31.2144 22.795 31.1084 22.8057H31.0117C30.811 22.8042 30.6174 22.7286 30.4687 22.5938C30.3203 22.4591 30.2262 22.2746 30.205 22.0753C30.0856 20.9555 29.7383 19.8716 29.1836 18.8917C28.6289 17.9117 27.879 17.0557 26.9804 16.377C26.8289 16.2403 26.7334 16.0518 26.7138 15.8487C26.6944 15.6457 26.7514 15.4424 26.874 15.2794C26.9966 15.1163 27.1763 15.0054 27.3769 14.9678Z" fill="#FF6F1E"/>
    <path d="M14.4775 24.0967C16.2052 24.0967 17.6064 25.497 17.6064 27.2246C17.6064 28.9523 16.2052 30.3525 14.4775 30.3525C12.75 30.3524 11.3496 28.9522 11.3496 27.2246C11.3496 25.4971 12.75 24.0968 14.4775 24.0967ZM29.5273 24.0967C31.255 24.0967 32.6562 25.4969 32.6562 27.2246C32.6562 28.9522 31.255 30.3525 29.5273 30.3525C27.7998 30.3524 26.3995 28.9521 26.3994 27.2246C26.3994 25.497 27.7998 24.0968 29.5273 24.0967ZM21.9814 11.25C23.709 11.2501 25.1092 12.6504 25.1094 14.3779C25.1094 16.1056 23.7091 17.5068 21.9814 17.5068C20.2538 17.5068 18.8535 16.1056 18.8535 14.3779C18.8537 12.6504 20.2539 11.25 21.9814 11.25Z" fill="#FF6F1E"/>
  </svg>
);

const FeedbackIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#EFF6FF"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#1B84FF" strokeOpacity="0.2"/>
    <path opacity="0.3" d="M26.7192 13.4004C27.3768 13.3967 28.0256 13.5528 28.6089 13.8564C29.1922 14.1601 29.6928 14.6017 30.0669 15.1426C30.441 15.6835 30.6771 16.308 30.7554 16.9609C30.8336 17.614 30.7518 18.2766 30.5161 18.8906C30.2805 19.5046 29.8979 20.0514 29.4028 20.4844C28.9078 20.9174 28.3143 21.2232 27.6743 21.375C27.0346 21.5266 26.3675 21.5199 25.731 21.3555C25.0943 21.1909 24.5072 20.8734 24.021 20.4307C24.7705 19.5159 25.258 18.4148 25.4321 17.2451C25.6062 16.0755 25.4598 14.8805 25.0093 13.7871C25.5433 13.533 26.1278 13.4011 26.7192 13.4004ZM18.8071 11.25C21.6212 11.2501 23.9028 13.5124 23.9028 16.3027C23.9027 19.0929 21.6211 21.3544 18.8071 21.3545C15.9931 21.3545 13.7116 19.093 13.7114 16.3027C13.7114 13.5123 15.993 11.25 18.8071 11.25Z" fill="#2270D0"/>
    <path d="M18.8076 22.6445C22.9812 22.6447 26.3643 24.907 26.3643 27.6973C26.3639 30.4874 22.981 32.7489 18.8076 32.749C14.6341 32.749 11.2503 30.4875 11.25 27.6973C11.25 24.9069 14.6339 22.6445 18.8076 22.6445ZM26.7188 22.5371C30.0512 22.5371 32.75 24.4291 32.75 26.5791C32.7498 28.7289 30.2345 30.4813 27.0742 30.5996C27.6512 29.7413 27.961 28.7314 27.9658 27.6973C27.9231 26.6777 27.622 25.6852 27.0898 24.8145C26.5576 23.9437 25.8118 23.2227 24.9238 22.7197C25.5143 22.5977 26.1158 22.5366 26.7188 22.5371Z" fill="#2270D0"/>
  </svg>
);

const AdvertiseIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#EAFFF1"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#17C653" strokeOpacity="0.2"/>
    <path d="M22.3906 23.8087C22.604 23.8087 22.809 23.8933 22.96 24.044C23.1109 24.1949 23.1962 24.4 23.1963 24.6134V29.0684C23.1935 29.281 23.1074 29.4845 22.957 29.6348C22.8067 29.7851 22.6032 29.8703 22.3906 29.8731C22.1772 29.873 21.9722 29.7887 21.8213 29.6378C21.6704 29.4868 21.586 29.2818 21.5859 29.0684V24.6134C21.586 24.4 21.6704 24.1949 21.8213 24.044C21.9722 23.8931 22.1772 23.8088 22.3906 23.8087ZM17.2188 25.1817C17.4323 25.1817 17.6371 25.2671 17.7881 25.418C17.939 25.569 18.0244 25.7739 18.0244 25.9874V29.0675C18.0244 29.281 17.9391 29.4858 17.7881 29.6368C17.6371 29.7877 17.4322 29.8721 17.2188 29.8721C17.0064 29.8693 16.8036 29.784 16.6533 29.6339C16.5029 29.4835 16.4168 29.2801 16.4141 29.0675V25.9874C16.4141 25.774 16.4987 25.569 16.6494 25.418C16.8003 25.2671 17.0054 25.1818 17.2188 25.1817ZM27.4922 20.9415C27.7055 20.9415 27.9106 21.0261 28.0615 21.1768C28.2124 21.3277 28.2978 21.5328 28.2979 21.7462V29.0675C28.2977 29.2808 28.2123 29.4849 28.0615 29.6358C27.9105 29.7868 27.7057 29.8721 27.4922 29.8721C27.2797 29.8693 27.077 29.7832 26.9268 29.6329C26.7765 29.4826 26.6904 29.28 26.6875 29.0675V21.7462C26.6876 21.5328 26.772 21.3277 26.9229 21.1768C27.0737 21.0259 27.2788 20.9416 27.4922 20.9415ZM27.4932 14.3731C27.5993 14.3717 27.7054 14.3918 27.8037 14.4317C27.9019 14.4717 27.9915 14.5306 28.0664 14.6055C28.1414 14.6805 28.2003 14.77 28.2402 14.8682C28.2801 14.9664 28.3002 15.0718 28.2988 15.1778V17.7003C28.3032 17.808 28.2856 17.916 28.2471 18.0167C28.2085 18.1174 28.1495 18.2099 28.0742 18.2872C27.9989 18.3645 27.9083 18.4256 27.8086 18.4669C27.7088 18.5081 27.6011 18.529 27.4932 18.5274C27.3858 18.5274 27.2796 18.5056 27.1807 18.4639C27.0817 18.4222 26.992 18.3611 26.917 18.2843C26.842 18.2073 26.7823 18.1158 26.7432 18.0157C26.704 17.9155 26.6856 17.8078 26.6885 17.7003V17.4151C22.5053 21.887 17.7328 22.0809 17.4971 22.0811H17.4863C17.2765 22.0812 17.0742 21.999 16.9238 21.8526C16.7736 21.7063 16.6863 21.5066 16.6807 21.2969C16.6749 21.1915 16.6905 21.0857 16.7266 20.9864C16.7627 20.8871 16.8185 20.796 16.8906 20.7188C16.9628 20.6417 17.0499 20.5799 17.1465 20.5372C17.2432 20.4945 17.3484 20.4721 17.4541 20.4708C17.6658 20.4705 22.0503 20.2683 25.8203 15.9835H24.9922C24.7788 15.9834 24.5737 15.898 24.4229 15.7471C24.2721 15.5962 24.1875 15.3911 24.1875 15.1778C24.1876 14.9647 24.2723 14.7603 24.4229 14.6094C24.5737 14.4586 24.7788 14.3732 24.9922 14.3731H27.4932Z" fill="#17C653"/>
  </svg>
);

const RetentionIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#7856FF" fillOpacity="0.1"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#6E4EFF" strokeOpacity="0.2"/>
    <path opacity="0.3" d="M30.8089 11.0238L26.9191 11.7271C24.949 12.2533 23.1573 13.301 21.7326 14.7598C19.4581 17.1333 16.9198 22.2208 15.9089 24.3415C15.7794 24.6216 15.7405 24.9352 15.7976 25.2385C15.8547 25.5419 16.005 25.8198 16.2276 26.0337L18.4911 28.2313C18.7113 28.4456 18.9937 28.5845 19.2978 28.6279C19.602 28.6714 19.912 28.6171 20.1833 28.473C23.4644 26.8145 26.5431 24.7829 29.3584 22.4186C30.8437 20.9147 31.8461 19.0016 32.2373 16.9245L32.9406 13.2215C32.9974 12.9264 32.9823 12.622 32.8964 12.334C32.8105 12.0461 32.6564 11.7831 32.4472 11.5674C32.2379 11.3517 31.9798 11.1897 31.6946 11.095C31.4094 11.0004 31.1055 10.976 30.8089 11.0238ZM28.2157 18.9243C27.9161 19.2409 27.5292 19.4612 27.1041 19.5574C26.679 19.6535 26.235 19.6211 25.8283 19.4642C25.4217 19.3073 25.0709 19.0331 24.8206 18.6764C24.5702 18.3196 24.4316 17.8965 24.4223 17.4608C24.4129 17.0251 24.5334 16.5964 24.7683 16.2293C25.0032 15.8622 25.342 15.5733 25.7415 15.3992C26.1411 15.2251 26.5834 15.1737 27.0122 15.2516C27.441 15.3295 27.8369 15.5332 28.1497 15.8366C28.5646 16.2392 28.8042 16.789 28.8165 17.367C28.8289 17.9449 28.613 18.5044 28.2157 18.9243Z" fill="#6E4EFF"/>
    <path d="M19.1171 18.3421L16.0624 24.0669L11.0298 23.946C11.0298 23.946 15.2382 17.518 19.1171 18.3421ZM26.5011 24.6493L21.007 28.0116L21.3477 33.0003C21.3477 33.0003 27.512 28.4731 26.5011 24.6493ZM26.611 15.2324C26.1763 15.2324 25.7514 15.3613 25.39 15.6028C25.0287 15.8443 24.747 16.1875 24.5806 16.5891C24.4143 16.9906 24.3708 17.4325 24.4556 17.8588C24.5404 18.2851 24.7497 18.6767 25.057 18.984C25.3644 19.2914 25.756 19.5007 26.1823 19.5855C26.6086 19.6703 27.0504 19.6267 27.452 19.4604C27.8535 19.2941 28.1968 19.0124 28.4383 18.651C28.6797 18.2896 28.8086 17.8647 28.8086 17.4301C28.8086 16.8472 28.5771 16.2882 28.1649 15.8761C27.7528 15.464 27.1938 15.2324 26.611 15.2324Z" fill="#6E4EFF"/>
  </svg>
);

const campaignTypes: CampaignType[] = [
  {
    id: 'engagement',
    title: 'Engagement',
    description: 'Boost customer interaction and loyalty',
    icon: <EngagementIcon />,
    type: 'engagement',
    benefits: ['Brand Awareness', 'Customer Reach', 'Sales Conversion', 'Reach new customers', 'Driving revenue and growth'],
    category: 'Engagement',
    color: '#e34f2f',
    gradient: 'from-[#ffffff] to-[#fff5ef]',
    badgeColor: 'bg-[rgba(73,90,255,0.1)] border-[rgba(73,90,255,0.2)]',
    badgeText: 'high performance',
    detailedBenefits: {
      title: 'Drive Customer Engagement & Loyalty',
      description: 'Create meaningful connections with your audience through interactive campaigns that build lasting relationships and drive repeat business.',
      keyMetrics: [
        '3x higher email open rates',
        '45% increase in social media interactions',
        '67% boost in customer lifetime value',
        '85% improvement in brand recall'
      ],
      businessImpact: [
        'Increase customer retention by 35%',
        'Generate 2.5x more qualified leads',
        'Boost average order value by 28%',
        'Reduce customer acquisition cost by 40%',
        'Improve Net Promoter Score by 50 points'
      ],
      useCases: [
        'Social media contests and giveaways',
        'Interactive polls and quizzes',
        'User-generated content campaigns',
        'Loyalty program promotions',
        'Community building initiatives',
        'Influencer partnerships'
      ],
      roi: 'Average ROI: 450% within 6 months'
    }
  },
  {
    id: 'feedback',
    title: 'Survey and Feedback',
    description: 'Gather insights to improve your business',
    icon: <FeedbackIcon />,
    type: 'feedback',
    benefits: ['Customer Insights', 'Product Improvement', 'Service Enhancement', 'Data-driven decisions', 'Customer satisfaction'],
    category: 'Feedback',
    color: '#1b84ff',
    gradient: 'from-[#ffffff] to-[#eff6ff]',
    badgeColor: 'bg-[rgba(138,56,245,0.1)] border-[rgba(138,56,245,0.2)]',
    badgeText: 'data-driven',
    detailedBenefits: {
      title: 'Unlock Customer Insights & Drive Growth',
      description: 'Transform customer feedback into actionable insights that fuel product innovation, service improvements, and strategic business decisions.',
      keyMetrics: [
        '90% response rate with targeted surveys',
        '60% faster product development cycles',
        '75% reduction in customer churn',
        '4.8/5 average customer satisfaction score'
      ],
      businessImpact: [
        'Identify new revenue opportunities worth $2M+',
        'Reduce product development costs by 30%',
        'Increase customer satisfaction by 65%',
        'Improve product-market fit by 80%',
        'Accelerate feature adoption by 45%'
      ],
      useCases: [
        'Post-purchase satisfaction surveys',
        'Product feedback and feature requests',
        'Customer experience mapping',
        'Market research and trend analysis',
        'Employee satisfaction surveys',
        'Brand perception studies'
      ],
      roi: 'Average ROI: 380% through improved retention'
    }
  },
  {
    id: 'retention',
    title: 'Retention',
    description: 'Keep customers coming back for more',
    icon: <RetentionIcon />,
    type: 'retention',
    benefits: ['Customer loyalty', 'Repeat purchases', 'Lifetime value', 'Reduced churn', 'Sustainable growth'],
    category: 'Retention',
    color: '#04b440',
    gradient: 'from-[#ffffff] to-[#eafff1]',
    badgeColor: 'bg-[rgba(213,32,32,0.1)] border-[rgba(213,32,32,0.2)]',
    badgeText: 'proven results',
    detailedBenefits: {
      title: 'Maximize Customer Lifetime Value',
      description: 'Implement strategic retention campaigns that turn one-time buyers into loyal advocates, dramatically increasing profitability and sustainable growth.',
      keyMetrics: [
        '95% customer retention rate achieved',
        '5x higher lifetime value per customer',
        '70% increase in repeat purchase frequency',
        '25% growth in average order value'
      ],
      businessImpact: [
        'Reduce customer churn by 85%',
        'Increase monthly recurring revenue by 120%',
        'Lower acquisition costs by 60%',
        'Boost profit margins by 55%',
        'Generate 40% more referrals'
      ],
      useCases: [
        'Personalized email re-engagement',
        'Loyalty point systems and rewards',
        'Win-back campaigns for inactive users',
        'Birthday and anniversary promotions',
        'Exclusive member benefits',
        'Subscription renewal incentives'
      ],
      roi: 'Average ROI: 520% - Retention is 5x cheaper than acquisition'
    }
  },
  {
    id: 'advertise',
    title: 'Advertise',
    description: 'Reach new audiences and scale growth',
    icon: <AdvertiseIcon />,
    type: 'advertise',
    benefits: ['Market expansion', 'Lead generation', 'Brand visibility', 'Sales growth', 'Competitive advantage'],
    category: 'Advertising',
    color: '#7856ff',
    gradient: 'from-[#ffffff] to-[#f0ecff]',
    badgeColor: 'bg-[rgba(213,92,32,0.1)] border-[rgba(213,92,32,0.2)]',
    badgeText: 'trending',
    detailedBenefits: {
      title: 'Scale Your Business with Targeted Advertising',
      description: 'Leverage precision targeting and data-driven advertising strategies to reach high-intent customers and accelerate business growth across all channels.',
      keyMetrics: [
        '300% increase in qualified leads',
        '15x return on ad spend (ROAS)',
        '89% reduction in cost per acquisition',
        '250% boost in conversion rates'
      ],
      businessImpact: [
        'Scale revenue by 400% in 12 months',
        'Enter 3 new market segments',
        'Increase market share by 25%',
        'Generate $5M+ in additional revenue',
        'Build brand awareness by 180%'
      ],
      useCases: [
        'Google Ads and search marketing',
        'Facebook and Instagram advertising',
        'LinkedIn B2B lead generation',
        'YouTube video advertising',
        'Retargeting and remarketing',
        'Influencer and affiliate marketing'
      ],
      roi: 'Average ROI: 600% with optimized campaigns'
    }
  }
];

// Icons for the stepper based on Figma design
const CampaignIcon = () => (
 <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.0996 13.0009H19.0996C18.8163 13.0009 18.5789 12.9049 18.3876 12.7129C18.1963 12.5209 18.1003 12.2836 18.0996 12.0009C18.0989 11.7182 18.1949 11.4809 18.3876 11.2889C18.5803 11.0969 18.8176 11.0009 19.0996 11.0009H21.0996C21.3829 11.0009 21.6206 11.0969 21.8126 11.2889C22.0046 11.4809 22.1003 11.7182 22.0996 12.0009C22.0989 12.2836 22.0029 12.5212 21.8116 12.7139C21.6203 12.9066 21.3829 13.0022 21.0996 13.0009ZM16.6996 16.8009C16.8663 16.5676 17.0829 16.4342 17.3496 16.4009C17.6163 16.3676 17.8663 16.4342 18.0996 16.6009L19.6996 17.8009C19.9329 17.9676 20.0663 18.1842 20.0996 18.4509C20.1329 18.7176 20.0663 18.9676 19.8996 19.2009C19.7329 19.4342 19.5163 19.5676 19.2496 19.6009C18.9829 19.6342 18.7329 19.5676 18.4996 19.4009L16.8996 18.2009C16.6663 18.0342 16.5329 17.8176 16.4996 17.5509C16.4663 17.2842 16.5329 17.0342 16.6996 16.8009ZM19.6996 6.20091L18.0996 7.40091C17.8663 7.56758 17.6163 7.63424 17.3496 7.60091C17.0829 7.56758 16.8663 7.43424 16.6996 7.20091C16.5329 6.96758 16.4663 6.71758 16.4996 6.45091C16.5329 6.18424 16.6663 5.96758 16.8996 5.80091L18.4996 4.60091C18.7329 4.43424 18.9829 4.36758 19.2496 4.40091C19.5163 4.43424 19.7329 4.56758 19.8996 4.80091C20.0663 5.03424 20.1329 5.28424 20.0996 5.55091C20.0663 5.81758 19.9329 6.03424 19.6996 6.20091ZM5.09961 15.0009H4.09961C3.54961 15.0009 3.07894 14.8052 2.68761 14.4139C2.29628 14.0226 2.10028 13.5516 2.09961 13.0009V11.0009C2.09961 10.4509 2.29561 9.98024 2.68761 9.58891C3.07961 9.19758 3.55028 9.00158 4.09961 9.00091H8.09961L11.5746 6.90091C11.9079 6.70091 12.2456 6.70091 12.5876 6.90091C12.9296 7.10091 13.1003 7.39258 13.0996 7.77591V16.2259C13.0996 16.6092 12.9286 16.9009 12.5866 17.1009C12.2446 17.3009 11.9073 17.3009 11.5746 17.1009L8.09961 15.0009H7.09961V18.0009C7.09961 18.2842 7.00361 18.5219 6.81161 18.7139C6.61961 18.9059 6.38228 19.0016 6.09961 19.0009C5.81694 19.0002 5.57961 18.9042 5.38761 18.7129C5.19561 18.5216 5.09961 18.2842 5.09961 18.0009V15.0009ZM14.0996 15.3509V8.65091C14.5496 9.05091 14.9123 9.53858 15.1876 10.1139C15.4629 10.6892 15.6003 11.3182 15.5996 12.0009C15.5989 12.6836 15.4613 13.3129 15.1866 13.8889C14.9119 14.4649 14.5496 14.9522 14.0996 15.3509Z" fill="currentColor"/>
</svg>

);

const MoneyIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.2002 4.5H10.2002C6.42896 4.5 4.54334 4.5 3.37177 5.67157C2.52823 6.51511 2.29204 7.72882 2.22591 9.75H22.1745C22.1083 7.72882 21.8722 6.51511 21.0286 5.67157C19.857 4.5 17.9714 4.5 14.2002 4.5Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M14.2002 20.5H10.2002C6.42896 20.5 4.54334 20.5 3.37177 19.3284C2.2002 18.1569 2.2002 16.2712 2.2002 12.5C2.2002 12.0581 2.2002 11.642 2.20208 11.25H22.1983C22.2002 11.642 22.2002 12.0581 22.2002 12.5C22.2002 16.2712 22.2002 18.1569 21.0286 19.3284C19.857 20.5 17.9714 20.5 14.2002 20.5ZM16.2449 12.75C16.6778 12.7499 17.0746 12.7499 17.3974 12.7933C17.7529 12.8411 18.1286 12.9535 18.4376 13.2626C18.7467 13.5716 18.8591 13.9473 18.9069 14.3028C18.9503 14.6256 18.9502 15.0224 18.9502 15.4553V15.5447C18.9502 15.9776 18.9503 16.3744 18.9069 16.6972C18.8591 17.0527 18.7467 17.4284 18.4376 17.7374C18.1286 18.0465 17.7529 18.1589 17.3974 18.2067C17.0746 18.2501 16.6778 18.2501 16.2449 18.25L16.2002 18.25L16.1555 18.25C15.7226 18.2501 15.3258 18.2501 15.003 18.2067C14.6475 18.1589 14.2718 18.0465 13.9628 17.7374C13.6537 17.4284 13.5413 17.0527 13.4935 16.6972C13.4501 16.3744 13.4501 15.9776 13.4502 15.5447L13.4502 15.5L13.4502 15.4553C13.4501 15.0224 13.4501 14.6256 13.4935 14.3028C13.5413 13.9473 13.6537 13.5716 13.9628 13.2626C14.2718 12.9535 14.6475 12.8411 15.003 12.7933C15.3258 12.7499 15.7226 12.7499 16.1554 12.75H16.2449ZM5.4502 14C5.4502 13.5858 5.78598 13.25 6.2002 13.25H8.2002C8.61441 13.25 8.9502 13.5858 8.9502 14C8.9502 14.4142 8.61441 14.75 8.2002 14.75H6.2002C5.78598 14.75 5.4502 14.4142 5.4502 14ZM5.4502 17C5.4502 16.5858 5.78598 16.25 6.2002 16.25H10.2002C10.6144 16.25 10.9502 16.5858 10.9502 17C10.9502 17.4142 10.6144 17.75 10.2002 17.75H6.2002C5.78598 17.75 5.4502 17.4142 5.4502 17Z" fill="currentColor"/>
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
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 3.5L6 10L2.5 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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
      <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full">
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
const StepperProgressBar = ({ currentStep = 1, totalSteps = 5 }: { currentStep?: number; totalSteps?: number }) => {
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

export function NewCampaignContent() {
  const { isCollapsed, isMobile } = useSidebar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignTypeFromUrl = searchParams.get('type');
  const [selectedCampaignType, setSelectedCampaignType] = useState<CampaignType | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredCampaignType, setHoveredCampaignType] = useState<CampaignType | null>(campaignTypes[0]); // Default to engagement

  // Force uncollapsed state on mobile
  const actualIsCollapsed = isMobile ? false : isCollapsed;

  // Load selected campaign type from session storage or URL parameter on component mount
  useEffect(() => {
    // First check if there's a campaign type in the URL
    if (campaignTypeFromUrl) {
      const campaignType = campaignTypes.find(type => type.type === campaignTypeFromUrl);
      if (campaignType) {
        setSelectedCampaignType(campaignType);
        return;
      }
    }

    // If no URL parameter, load from session storage
    const savedData = sessionStorage.getItem('newCampaignData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.selectedCampaignType) {
          const campaignType = campaignTypes.find(type => type.id === data.selectedCampaignType);
          if (campaignType) {
            setSelectedCampaignType(campaignType);
          }
        }
      } catch (error) {
      }
    }
  }, [campaignTypeFromUrl]);

  // Save selected campaign type to session storage whenever it changes
  useEffect(() => {
    const dataToSave = {
      selectedCampaignType: selectedCampaignType?.id || null
    };
    sessionStorage.setItem('newCampaignData', JSON.stringify(dataToSave));
  }, [selectedCampaignType]);

  const handleCampaignTypeSelect = (campaignType: CampaignType) => {
    setSelectedCampaignType(campaignType);
  };

  const handleProceedToNextStep = async () => {
    if (selectedCampaignType && !isNavigating) {
      setIsNavigating(true);
      try {
          await router.push(`/new-campaign/audience?type=${selectedCampaignType.type}`);
      } catch (error) {
        setIsNavigating(false);
      }
    }
  };



  const handleClose = () => {
    router.push('/campaigns');
  };

  return (
    <main className={`flex-1 transition-sidebar bg-[#f6f6f6] ${
      actualIsCollapsed ? 'main-content sidebar-collapsed' : 'main-content'
    }`}>
      {/* Mobile Header with Back Button */}
      <header className="lg:hidden flex items-center justify-start p-3 sm:p-4 bg-[#F6F6F6] fixed top-0 left-0 right-0 z-50">
        <MobileHeaderButton />
      </header>

      <div className="w-full max-w-full overflow-x-hidden">
        {/* Navigation Bar */}
        <div className={`fixed bottom-0 bg-white border-t border-[#e9e9e9] z-50 ${
          isMobile ? 'left-0 right-0' : actualIsCollapsed ? 'left-[64px] right-0' : 'left-[232px] right-0'
        }`}>
          {/* Mobile Navigation */}
          <div className="lg:hidden px-4 py-4">
            <div className="flex flex-col gap-3">
              {/* Progress Info */}
              <div className="text-center">
                <div className="text-[12px] text-[#626266] font-medium mb-1">
                  Step 1 of 5 • Choose Campaign Type
                </div>
                <div className="text-[11px] text-[#10b981] font-medium">
                  ✓ All changes are saved automatically
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 h-9 px-4 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[16px] transition-colors hover:bg-gray-50 active:bg-gray-100 touch-manipulation"
                >
                  Back
                </button>
                <button
                  onClick={handleProceedToNextStep}
                  disabled={!selectedCampaignType || isNavigating}
                  className={`flex-[2] h-9 px-6 rounded font-medium text-[16px] transition-all duration-200 touch-manipulation ${
                    selectedCampaignType && !isNavigating
                      ? 'bg-gradient-to-r from-[#6e4eff] to-[#8B6AFF] text-white hover:from-[#5a3de8] hover:to-[#7856ff] '
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isNavigating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Continue
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Navigation - Original */}
          <div className="hidden lg:block px-4 sm:px-6 lg:px-12 py-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={handleClose}
                className="h-9 px-4 py-1 border border-[#e9e9e9] rounded font-medium text-[#2a2a2f] text-[14px] transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <div className="text-[#2a2a2f] text-[14px] font-medium">
                All changes are saved
              </div>
            </div>
            <div className="flex flex-row gap-2 sm:gap-4 items-center">
              <button
                onClick={handleProceedToNextStep}
                disabled={!selectedCampaignType || isNavigating}
                  className={`h-9 px-4 py-1 rounded font-medium text-[14px] transition-all duration-200 ${
                    selectedCampaignType && !isNavigating
                      ? 'bg-[#6e4eff] text-white hover:bg-[#5a3de8]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {isNavigating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Navigating...
                  </span>
                ) : (
                  'Proceed to next step'
                )}
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 pt-20 pb-40 py-4 lg:px-8 lg:py-8 lg:pb-20 lg:pt-8">
          {/* Mobile-First Stepper */}
          <div className="mb-6 lg:mb-8 bg-white border border-[#e9e9e9] rounded-md overflow-hidden relative">
            {/* Mobile Stepper - Simplified */}
            <div className="lg:hidden">
              <div className="flex items-center p-4 bg-gradient-to-r from-[#7856ff]/5 to-[#8B6AFF]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#7856ff] to-[#8B6AFF] flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-[16px] font-semibold text-[#2a2a2f] font-manrope">
                      Choose Campaign Type
                    </div>
                    <div className="text-[12px] text-[#626266] font-manrope">
                      Step 1 of 5 • 2-3 min
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-1 bg-gray-200">
                <div className="h-full bg-gradient-to-r from-[#7856ff] to-[#8B6AFF] transition-all duration-500" style={{ width: '20%' }}></div>
              </div>
            </div>

            {/* Desktop Stepper - Original */}
            <div className="hidden lg:block p-2 overflow-x-auto relative">
            <div className="box-border content-stretch flex flex-row items-start justify-start p-0 relative rounded-md size-full">
              <StepperStep
                title="Choose campaign type"
                icon={<CampaignIcon />}
                isCurrent={true}
                stepIndex={1}
                totalSteps={5}
                timeEstimate="2-3 min"
                description="Choose campaign type"
              />
              <StepperStep
                title="Choose audience"
                icon={<UsersIcon />}
                stepIndex={2}
                totalSteps={5}
                timeEstimate="3-5 min"
                description="Select target users"
              />
              <StepperStep
                title="Platform & Budget"
                icon={<BagIcon />}
                stepIndex={3}
                totalSteps={5}
                timeEstimate="2-4 min"
                description="Set budget & platforms"
              />
              <StepperStep
                title="Design your campaign"
                icon={<MoneyIcon />}
                stepIndex={4}
                totalSteps={5}
                timeEstimate="5-8 min"
                description="Design your campaign"
              />
              <StepperStep
                title="Schedule"
                icon={<CalendarIcon />}
                stepIndex={5}
                totalSteps={5}
                timeEstimate="1-2 min"
                description="Schedule"
              />
            </div>
            <StepperProgressBar currentStep={1} totalSteps={5} />
            </div>
          </div>

          {/* Campaign Selection */}
          <div className="flex flex-col gap-6 items-start justify-start">
            {/* Mobile Layout */}
            <div className="lg:hidden w-full space-y-4">
              {/* Campaign Cards - Mobile Stack */}
              <div className="space-y-3">
                {campaignTypes.map((campaignType) => (
                  <div key={campaignType.id}>
                    {/* Campaign Card */}
                    <div 
                      className={`bg-[#ffffff] relative rounded w-full cursor-pointer transition-all duration-200 border touch-manipulation ${
                        selectedCampaignType?.id === campaignType.id
                          ? 'ring-2 ring-[#7856ff]/20 border-[#7856ff]'
                          : 'border-[#e9e9e9] hover:border-[#7856ff]/50 active:border-[#7856ff]/70'
                      }`}
                      onClick={() => handleCampaignTypeSelect(campaignType)}
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 flex items-center justify-center">
                              {campaignType.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[16px] font-semibold text-[#2a2a2f] font-manrope leading-tight">
                              {campaignType.title}
                            </h3>
                            <p className="text-[14px] text-[#626266] font-manrope leading-tight mt-1">
                              {campaignType.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            {selectedCampaignType?.id === campaignType.id ? (
                              <div className="w-6 h-6 rounded-full bg-[#7856ff] flex items-center justify-center text-white">
                                <CheckIcon />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-[#e9e9e9]"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Benefits - Mobile */}
                    {selectedCampaignType?.id === campaignType.id && (
                      <div className="mt-3 bg-white rounded border border-[#e9e9e9] p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        {/* ROI Badge */}
                        <div className="text-center">
                          <div className="inline-flex items-center px-4 py-2 rounded-full text-[14px] font-medium" style={{ 
                            backgroundColor: `${campaignType.color}15`, 
                            color: campaignType.color 
                          }}>
                            {campaignType.detailedBenefits.roi}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded p-4 border border-gray-200">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-[16px] font-semibold text-slate-700 mb-1">
                                {campaignType.type === 'engagement' ? '15K+' : 
                                 campaignType.type === 'feedback' ? '8K+' :
                                 campaignType.type === 'retention' ? '12K+' : '20K+'}
                              </div>
                              <div className="text-[10px] text-slate-600 font-medium">Active campaigns</div>
                            </div>
                            <div>
                              <div className="text-[16px] font-semibold text-slate-700 mb-1">
                                {campaignType.type === 'engagement' ? '98%' : 
                                 campaignType.type === 'feedback' ? '95%' :
                                 campaignType.type === 'retention' ? '97%' : '99%'}
                              </div>
                              <div className="text-[10px] text-slate-600 font-medium">Success rate</div>
                            </div>
                            <div>
                              <div className="text-[16px] font-semibold text-slate-700 mb-1">50K+</div>
                              <div className="text-[10px] text-slate-600 font-medium">Businesses</div>
                            </div>
                          </div>
                        </div>

                        {/* Key Benefits */}
                        <div className="space-y-3">
                          <h4 className="text-[14px] font-semibold text-[#2a2a2f] flex items-center gap-2">
                            ✨ Key Benefits
                          </h4>
                          <div className="space-y-2">
                            {campaignType.detailedBenefits.keyMetrics.slice(0, 3).map((metric, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: campaignType.color }}></div>
                                <span className="text-[13px] text-[#626266] leading-relaxed">{metric}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Trust Indicator */}
                        <div className="pt-3 border-t border-gray-100 text-center">
                          <div className="text-[11px] text-[#626266] flex items-center justify-center gap-1">
                            <span>🔒</span>
                            <span>GDPR compliant & secure</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Layout - Original */}
            <div className="hidden lg:flex gap-6 items-start justify-start w-full">
                              <div className="flex flex-col gap-2 items-start justify-start w-full max-w-[300px]">
                {campaignTypes.map((campaignType) => (
                  <div 
                    key={campaignType.id}
                    className={`bg-[#ffffff] relative rounded w-full cursor-pointer transition-all duration-200 border ${
                      selectedCampaignType?.id === campaignType.id
                        ? 'ring-2 ring-[#7856ff]/20 border-[#7856ff]'
                        : 'border-[#e9e9e9] hover:border-[#7856ff]/50'
                    }`}
                    onClick={() => handleCampaignTypeSelect(campaignType)}
                    onMouseEnter={() => setHoveredCampaignType(campaignType)}
                    onMouseLeave={() => setHoveredCampaignType(campaignTypes[0])}
                  >
                    <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
                      <div className="flex gap-2.5 items-center justify-center relative shrink-0">
                        <div className="relative shrink-0 size-11 flex items-center justify-center">
                          {campaignType.icon}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-1 items-center justify-between">
                        <div className="flex flex-col font-['Manrope:Bold',_sans-serif] justify-center leading-[0] not-italic text-[#2a2a2f] text-[14px]">
                          <p className="leading-[1.4]">{campaignType.title}</p>
                          <p className="text-[12px] text-[#626266] font-normal leading-[1.3] mt-1">{campaignType.description}</p>
                        </div>
                        <div className="flex items-center justify-center shrink-0">
                          <div className="rotate-[270deg]">
                            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L4 4L7 1" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Benefits Panel - Desktop */}
              {hoveredCampaignType && (
                <div className="flex-1 ml-6 bg-white rounded border border-[#e9e9e9] p-6 transition-all duration-300 max-h-[600px] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="border-b border-gray-100 pb-3">
                      <h3 className="text-lg font-semibold text-[#2a2a2f] mb-2" style={{ color: hoveredCampaignType.color }}>
                        {hoveredCampaignType.detailedBenefits.title}
                      </h3>
                      <p className="text-[14px] font-normal text-[#626266] leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {hoveredCampaignType.detailedBenefits.description}
                      </p>
                      <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-[14px] font-normal" style={{ 
                        backgroundColor: `${hoveredCampaignType.color}15`, 
                        color: hoveredCampaignType.color 
                      }}>
                        {hoveredCampaignType.detailedBenefits.roi}
                      </div>
                    </div>

                    {/* Key Metrics and Business Impact - Side by Side */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Key Metrics */}
                      <div>
                        <h4 className="text-[14px] font-normal text-[#2a2a2f] mb-3 flex items-center gap-2">
                          📊 <span>Key Metrics</span>
                        </h4>
                        <div className="space-y-2">
                          {hoveredCampaignType.detailedBenefits.keyMetrics.slice(0, 4).map((metric, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: hoveredCampaignType.color }}></div>
                              <span className="text-[14px] font-normal text-[#626266] leading-relaxed">{metric}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Business Impact */}
                      <div>
                        <h4 className="text-[14px] font-normal text-[#2a2a2f] mb-3 flex items-center gap-2">
                          💼 <span>Business Impact</span>
                        </h4>
                        <div className="space-y-2">
                          {hoveredCampaignType.detailedBenefits.businessImpact.slice(0, 4).map((impact, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: hoveredCampaignType.color }}></div>
                              <span className="text-[14px] font-normal text-[#626266] leading-relaxed">{impact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Social Proof Section */}
                    <div className="border-t border-gray-100 pt-4">
                      {/* Usage Statistics */}
                      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded p-4 border border-gray-200 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-center">
                            <div className="text-[18px] font-semibold text-slate-700 mb-1">
                              {hoveredCampaignType.type === 'engagement' ? '15K+' : 
                               hoveredCampaignType.type === 'feedback' ? '8K+' :
                               hoveredCampaignType.type === 'retention' ? '12K+' : '20K+'}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">Active campaigns</div>
                          </div>
                          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>
                          <div className="flex-1 text-center">
                            <div className="text-[18px] font-semibold text-slate-700 mb-1">
                              {hoveredCampaignType.type === 'engagement' ? '98%' : 
                               hoveredCampaignType.type === 'feedback' ? '95%' :
                               hoveredCampaignType.type === 'retention' ? '97%' : '99%'}
                            </div>
                            <div className="text-[11px] text-slate-600 font-medium">Success rate</div>
                          </div>
                          <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-2"></div>
                          <div className="flex-1 text-center">
                            <div className="text-[18px] font-semibold text-slate-700 mb-1">50K+</div>
                            <div className="text-[11px] text-slate-600 font-medium">Trusted by businesses</div>
                          </div>
                        </div>
                      </div>

                      {/* Trust Indicators */}
                      <div className="mt-4 flex items-center justify-center text-[11px] text-[#626266]">
                        <div className="flex items-center gap-1">
                          <span>🔒</span>
                          <span>GDPR compliant</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
