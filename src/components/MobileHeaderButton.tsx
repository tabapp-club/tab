"use client";

import { usePathname, useRouter } from "next/navigation";
import { MobileMenuToggle } from "./MobileMenuToggle";

const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 8L8 24M8 8L24 24" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function MobileHeaderButton() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if we're on the dashboard
  const isDashboard = pathname === "/dashboard";
  
  const handleBack = () => {
    router.back();
  };

  if (isDashboard) {
    return <MobileMenuToggle />;
  }

  return (
    <button
      onClick={handleBack}
      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
      aria-label="Close"
    >
      <CloseIcon />
    </button>
  );
}
