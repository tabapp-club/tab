'use client';

import { useState, useRef, useEffect } from 'react';
import { CampaignData } from './CampaignsClient';

// Campaign type icons (updated to match new-campaign page)
const FeedbackIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#EFF6FF"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#1B84FF" strokeOpacity="0.2"/>
    <path opacity="0.3" d="M26.7192 13.4004C27.3768 13.3967 28.0256 13.5528 28.6089 13.8564C29.1922 14.1601 29.6928 14.6017 30.0669 15.1426C30.441 15.6835 30.6771 16.308 30.7554 16.9609C30.8336 17.614 30.7518 18.2766 30.5161 18.8906C30.2805 19.5046 29.8979 20.0514 29.4028 20.4844C28.9078 20.9174 28.3143 21.2232 27.6743 21.375C27.0346 21.5266 26.3675 21.5199 25.731 21.3555C25.0943 21.1909 24.5072 20.8734 24.021 20.4307C24.7705 19.5159 25.258 18.4148 25.4321 17.2451C25.6062 16.0755 25.4598 14.8805 25.0093 13.7871C25.5433 13.533 26.1278 13.4011 26.7192 13.4004ZM18.8071 11.25C21.6212 11.2501 23.9028 13.5124 23.9028 16.3027C23.9027 19.0929 21.6211 21.3544 18.8071 21.3545C15.9931 21.3545 13.7116 19.093 13.7114 16.3027C13.7114 13.5123 15.993 11.25 18.8071 11.25Z" fill="#2270D0"/>
    <path d="M18.8076 22.6445C22.9812 22.6447 26.3643 24.907 26.3643 27.6973C26.3639 30.4874 22.9810 32.7489 18.8076 32.749C14.6341 32.749 11.2503 30.4875 11.25 27.6973C11.25 24.9069 14.6339 22.6445 18.8076 22.6445ZM26.7188 22.5371C30.0512 22.5371 32.75 24.4291 32.75 26.5791C32.7498 28.7289 30.2345 30.4813 27.0742 30.5996C27.6512 29.7413 27.961 28.7314 27.9658 27.6973C27.9231 26.6777 27.622 25.6852 27.0898 24.8145C26.5576 23.9437 25.8118 23.2227 24.9238 22.7197C25.5143 22.5977 26.1158 22.5366 26.7188 22.5371Z" fill="#2270D0"/>
  </svg>
);

const RetentionIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#9747FF" fillOpacity="0.1"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#9747FF" strokeOpacity="0.2"/>
    <path opacity="0.3" d="M30.8089 11.0238L26.9191 11.7271C24.949 12.2533 23.1573 13.301 21.7326 14.7598C19.4581 17.1333 16.9198 22.2208 15.9089 24.3415C15.7794 24.6216 15.7405 24.9352 15.7976 25.2385C15.8547 25.5419 16.005 25.8198 16.2276 26.0337L18.4911 28.2313C18.7113 28.4456 18.9937 28.5845 19.2978 28.6279C19.602 28.6714 19.912 28.6171 20.1833 28.473C23.4644 26.8145 26.5431 24.7829 29.3584 22.4186C30.8437 20.9147 31.8461 19.0016 32.2373 16.9245L32.9406 13.2215C32.9974 12.9264 32.9823 12.622 32.8964 12.334C32.8105 12.0461 32.6564 11.7831 32.4472 11.5674C32.2379 11.3517 31.9798 11.1897 31.6946 11.095C31.4094 11.0004 31.1055 10.976 30.8089 11.0238ZM28.2157 18.9243C27.9161 19.2409 27.5292 19.4612 27.1041 19.5574C26.679 19.6535 26.235 19.6211 25.8283 19.4642C25.4217 19.3073 25.0709 19.0331 24.8206 18.6764C24.5702 18.3196 24.4316 17.8965 24.4223 17.4608C24.4129 17.0251 24.5334 16.5964 24.7683 16.2293C25.0032 15.8622 25.342 15.5733 25.7415 15.3992C26.1411 15.2251 26.5834 15.1737 27.0122 15.2516C27.441 15.3295 27.8369 15.5332 28.1497 15.8366C28.5646 16.2392 28.8042 16.789 28.8165 17.367C28.8289 17.9449 28.613 18.5044 28.2157 18.9243Z" fill="#9747FF"/>
    <path d="M19.1171 18.3421L16.0624 24.0669L11.0298 23.946C11.0298 23.946 15.2382 17.518 19.1171 18.3421ZM26.5011 24.6493L21.007 28.0116L21.3477 33.0003C21.3477 33.0003 27.512 28.4731 26.5011 24.6493ZM26.611 15.2324C26.1763 15.2324 25.7514 15.3613 25.39 15.6028C25.0287 15.8443 24.747 16.1875 24.5806 16.5891C24.4143 16.9906 24.3708 17.4325 24.4556 17.8588C24.5404 18.2851 24.7497 18.6767 25.057 18.984C25.3644 19.2914 25.756 19.5007 26.1823 19.5855C26.6086 19.6703 27.0504 19.6267 27.452 19.4604C27.8535 19.2941 28.1968 19.0124 28.4383 18.651C28.6797 18.2896 28.8086 17.8647 28.8086 17.4301C28.8086 16.8472 28.5771 16.2882 28.1649 15.8761C27.7528 15.464 27.1938 15.2324 26.611 15.2324Z" fill="#9747FF"/>
  </svg>
);

const EngagementIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="44" height="44" fill="white"/>
    <path d="M17.5 2.59808C20.2846 0.990381 23.7154 0.990381 26.5 2.59808L36.5526 8.40192C39.3372 10.0096 41.0526 12.9808 41.0526 16.1962V27.8038C41.0526 31.0192 39.3372 33.9904 36.5526 35.5981L26.5 41.4019C23.7154 43.0096 20.2846 43.0096 17.5 41.4019L7.44744 35.5981C4.66283 33.9904 2.94744 31.0192 2.94744 27.8038V16.1962C2.94744 12.9808 4.66283 10.0096 7.44744 8.40192L17.5 2.59808Z" fill="#FFF5EF"/>
    <path d="M17.75 3.03125C20.3799 1.51287 23.6201 1.51287 26.25 3.03125L36.3027 8.83496C38.9326 10.3534 40.5527 13.1596 40.5527 16.1963V27.8037C40.5527 30.8404 38.9326 33.6466 36.3027 35.165L26.25 40.9688C23.6201 42.4871 20.3799 42.4871 17.75 40.9688L7.69727 35.165C5.06744 33.6466 3.44727 30.8404 3.44727 27.8037V16.1963C3.44727 13.1596 5.06744 10.3534 7.69727 8.83496L17.75 3.03125Z" stroke="#FF6F1E" strokeOpacity="0.2"/>
    <path opacity="0.3" d="M18.0078 30.3633C18.2089 30.2889 18.4314 30.2968 18.6269 30.3848C19.6748 30.8617 20.8107 31.114 21.9619 31.127C23.1132 31.14 24.255 30.9132 25.3134 30.46C25.5092 30.386 25.7259 30.3897 25.9189 30.4708C26.1119 30.5518 26.2664 30.7039 26.3505 30.8956C26.4347 31.0873 26.442 31.3041 26.3711 31.501C26.3001 31.6978 26.1566 31.8602 25.9697 31.9542C24.7341 32.4858 23.4017 32.757 22.0566 32.7501C20.6395 32.7529 19.2383 32.4481 17.9502 31.8575C17.758 31.7642 17.6092 31.5998 17.5351 31.3995C17.4611 31.1992 17.4665 30.9781 17.5517 30.7823C17.6428 30.5882 17.8068 30.4378 18.0078 30.3633ZM16.9394 14.7676C17.0539 14.779 17.1648 14.8141 17.2646 14.8712C17.3646 14.9283 17.4516 15.0067 17.5195 15.0997C17.5872 15.1926 17.6343 15.2988 17.6582 15.4112C17.6821 15.5238 17.6824 15.6404 17.6582 15.753C17.6339 15.8655 17.5857 15.9717 17.5175 16.0645C17.4495 16.1571 17.3626 16.2343 17.2627 16.2911C16.3293 16.966 15.5475 17.8298 14.9697 18.8262C14.392 19.8224 14.0305 20.9292 13.9082 22.0743C13.887 22.2739 13.7932 22.459 13.6445 22.5938C13.4959 22.7285 13.3031 22.8041 13.1025 22.8057H13.0156C12.8053 22.7762 12.615 22.665 12.4863 22.4962C12.3574 22.327 12.3005 22.1132 12.3281 21.9024C12.4703 20.5346 12.8979 19.2119 13.583 18.0196C14.2681 16.8271 15.1955 15.7913 16.3056 14.9796C16.3903 14.9016 16.4905 14.8423 16.5996 14.8057C16.7087 14.7692 16.8248 14.7564 16.9394 14.7676ZM27.3769 14.9678C27.5776 14.9303 27.7856 14.9685 27.9589 15.0762C29.0387 15.8892 29.9387 16.9166 30.6045 18.0928C31.2702 19.2691 31.6868 20.5699 31.8281 21.9141C31.8399 22.02 31.8315 22.1273 31.8017 22.2295C31.7719 22.3319 31.7212 22.4269 31.6543 22.5098C31.5873 22.5928 31.5049 22.6622 31.4111 22.7129C31.3174 22.7637 31.2144 22.795 31.1084 22.8057H31.0117C30.811 22.8042 30.6174 22.7286 30.4687 22.5938C30.3203 22.4591 30.2262 22.2746 30.205 22.0753C30.0856 20.9555 29.7383 19.8716 29.1836 18.8917C28.6289 17.9117 27.879 17.0557 26.9804 16.377C26.8289 16.2403 26.7334 16.0518 26.7138 15.8487C26.6944 15.6457 26.7514 15.4424 26.874 15.2794C26.9966 15.1163 27.1763 15.0054 27.3769 14.9678Z" fill="#FF6F1E"/>
    <path d="M14.4775 24.0967C16.2052 24.0967 17.6064 25.497 17.6064 27.2246C17.6064 28.9523 16.2052 30.3525 14.4775 30.3525C12.75 30.3524 11.3496 28.9522 11.3496 27.2246C11.3496 25.4971 12.75 24.0968 14.4775 24.0967ZM29.5273 24.0967C31.255 24.0967 32.6562 25.4969 32.6562 27.2246C32.6562 28.9522 31.255 30.3525 29.5273 30.3525C27.7998 30.3524 26.3995 28.9521 26.3994 27.2246C26.3994 25.497 27.7998 24.0968 29.5273 24.0967ZM21.9814 11.25C23.709 11.2501 25.1092 12.6504 25.1094 14.3779C25.1094 16.1056 23.7091 17.5068 21.9814 17.5068C20.2538 17.5068 18.8535 16.1056 18.8535 14.3779C18.8537 12.6504 20.2539 11.25 21.9814 11.25Z" fill="#FF6F1E"/>
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

interface CampaignCardProps {
  campaign: CampaignData;
  isHighlighted?: boolean;
}

export function CampaignCard({ campaign, isHighlighted = false }: CampaignCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTypeIcon = (type: CampaignData['type']) => {
    switch (type) {
      case 'feedback':
        return <FeedbackIcon />;
      case 'retention':
        return <RetentionIcon />;
      case 'engagement':
        return <EngagementIcon />;
      case 'advertise':
        return <AdvertiseIcon />;
      default:
        return <EngagementIcon />;
    }
  };

  const getStatusColor = (status: CampaignData['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-[#9747FF]/10 text-[#9747FF] border-[#9747FF]/20';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: CampaignData['type']) => {
    switch (type) {
      case 'feedback':
        return 'text-green-600';
      case 'retention':
        return 'text-purple-600';
      case 'engagement':
        return 'text-pink-600';
      case 'advertise':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };


  return (
    <>
      <div
        id={`campaign-${campaign.id}`}
        className={`bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 min-w-0 relative scroll-mt-24 ${
          isHighlighted ? 'ring-2 ring-[#9747FF] ring-offset-2' : ''
        }`}
        tabIndex={-1}
      >
        {/* Mobile Layout */}
        <div className="block lg:hidden">
          <div className="p-4">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <div className="scale-90">
                    {getTypeIcon(campaign.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {campaign.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500 capitalize">
                      {campaign.type.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-900">{formatNumber(campaign.audience)}</div>
                <div className="text-xs text-blue-600 mt-0.5">Audience</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-900">{campaign.conversion.toFixed(1)}%</div>
                <div className="text-xs text-green-600 mt-0.5">Conversion</div>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-900">{formatCurrency(campaign.budget)}</div>
                <div className="text-xs text-purple-600 mt-0.5">Budget</div>
              </div>
            </div>

            {/* Secondary Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{formatNumber(campaign.sent)}</div>
                <div className="text-xs text-gray-600 mt-0.5">Sent</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{formatNumber(campaign.opened)}</div>
                <div className="text-xs text-gray-600 mt-0.5">Opened</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-900">{formatNumber(campaign.clicked)}</div>
                <div className="text-xs text-gray-600 mt-0.5">Clicked</div>
              </div>
            </div>

            {/* Dates Row */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span>Created: {campaign.createdDate}</span>
              <span>Ends: {campaign.endDate}</span>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* Left Side - Campaign Information */}
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex-shrink-0 w-11 h-11 flex items-center justify-center">
                    <div className="scale-100">
                      {getTypeIcon(campaign.type)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {campaign.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-xs text-gray-500 capitalize">
                        {campaign.type.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <span className={`px-1 py-0.5 text-xs font-medium rounded border ${getStatusColor(campaign.status)}`}>
                        {campaign.status}
                      </span>
                    </div>
                    {/* Dates under the status tag */}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span>Created: {campaign.createdDate}</span>
                      <span>Ends: {campaign.endDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center - All Metrics in Single Line */}
              <div className="flex items-center">
                {/* Audience */}
                <div className="text-center px-4 py-1 min-w-[60px]">
                  <div className="text-base text-gray-900">
                    {formatNumber(campaign.audience)}
                  </div>
                  <div className="text-xs text-gray-500">Audience</div>
                </div>
                
                {/* Separator */}
                <div className="w-px h-8 bg-gray-200"></div>
                
                {/* Conversion */}
                <div className="text-center px-4 py-1 min-w-[50px]">
                  <div className="text-base text-gray-900">
                    {campaign.conversion.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Conv.</div>
                </div>
                
                {/* Separator */}
                <div className="w-px h-8 bg-gray-200"></div>
                
                {/* Budget */}
                <div className="text-center px-4 py-1 min-w-[60px]">
                  <div className="text-base text-gray-900">
                    {formatCurrency(campaign.budget)}
                  </div>
                  <div className="text-xs text-gray-500">Budget</div>
                </div>
                
                {/* Separator */}
                <div className="w-px h-8 bg-gray-200"></div>
                
                {/* Spent */}
                <div className="text-center px-4 py-1 min-w-[60px]">
                  <div className="text-base text-gray-900">
                    {formatCurrency(campaign.spent)}
                  </div>
                  <div className="text-xs text-gray-500">Spent</div>
                </div>
                
                {/* Sent */}
                <div className="text-center px-4 py-1 bg-blue-50 rounded min-w-[50px]">
                  <div className="text-base text-blue-900">{formatNumber(campaign.sent)}</div>
                  <div className="text-xs text-blue-600">Sent</div>
                </div>
                
                {/* Opened */}
                <div className="text-center px-4 py-1 bg-green-50 rounded min-w-[50px]">
                  <div className="text-base text-green-900">{formatNumber(campaign.opened)}</div>
                  <div className="text-xs text-green-600">Opened</div>
                </div>
                
                {/* Clicked */}
                <div className="text-center px-4 py-1 bg-purple-50 rounded min-w-[50px]">
                  <div className="text-base text-purple-900">{formatNumber(campaign.clicked)}</div>
                  <div className="text-xs text-purple-600">Clicked</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Action Icons
const ViewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2.5C3.5 2.5 0.5 5.5 0.5 7s3 4.5 6.5 4.5 6.5-2 6.5-4.5-3-4.5-6.5-4.5z" stroke="currentColor" strokeWidth="1"/>
    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 1.5a2 2 0 012.83 2.83L4.5 13.17l-3.67.33.33-3.67L10 1.5z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const DuplicateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 4.5h5.5v5.5M2.5 6.5h5.5v5.5h-5.5z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 3.5L2.5 3.5M5.5 1.5h3M9.5 5.5v6h-5v-6M6.5 7.5v2M7.5 7.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);
