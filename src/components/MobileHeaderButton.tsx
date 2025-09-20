"use client";

import { usePathname, useRouter } from "next/navigation";
import { MobileMenuToggle } from "./MobileMenuToggle";

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6L18 18" stroke="#0D0D0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
