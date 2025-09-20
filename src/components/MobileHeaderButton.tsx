"use client";

import { usePathname, useRouter } from "next/navigation";
import { MobileMenuToggle } from "./MobileMenuToggle";

const BackIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M3.14551 15.9999C3.91882 15.4668 5.1713 14.1489 6.10547 12.8531C7.27318 11.2332 7.93849 10.1904 8.31866 9.0918L9.89367 10.1529C9.73979 10.7984 8.98125 12.6294 7.17814 14.7894L28.8547 14.7894V15.9999L3.14551 15.9999ZM3.14551 16.0001C3.91882 16.5332 5.1713 17.8511 6.10547 19.1469C7.27318 20.7668 7.93849 21.8096 8.31866 22.9082L9.89367 21.8471C9.73979 21.2016 8.98125 19.3706 7.17814 17.2106H28.8547V16.0001L3.14551 16.0001Z" fill="#0D0D0D"/>
  </svg>
);

interface MobileHeaderButtonProps {
  onClick?: () => void;
}

export function MobileHeaderButton({ onClick }: MobileHeaderButtonProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Check if we're on the dashboard
  const isDashboard = pathname === "/dashboard";
  
  const handleBack = onClick || (() => {
    router.back();
  });

  if (isDashboard) {
    return <MobileMenuToggle />;
  }

  return (
    <button
      onClick={handleBack}
      className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
      aria-label="Go back"
    >
      <BackIcon />
    </button>
  );
}
