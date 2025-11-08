"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { WalletContent } from "./WalletContent";

interface WalletPageClientProps {
  defaultTab?: "platform" | "addfunds" | "breakdown";
}

export function WalletPageClient({ defaultTab = "addfunds" }: WalletPageClientProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle success parameter if needed for future use
    const success = searchParams.get("success");
    const view = searchParams.get("view");
    
    // Success and view parameters can be used for future enhancements
    // Currently, the wallet content is displayed directly as a full page
    if (success === "true" || view === "transactions") {
      // Could scroll to breakdown tab or show success message in the future
    }
  }, [searchParams]);

  return <WalletContent defaultTab={defaultTab} />;
}

