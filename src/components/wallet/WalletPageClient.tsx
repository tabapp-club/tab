"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { WalletLoadPage } from "./WalletLoadPage";
import { WalletSidepane } from "./WalletSidepane";

export function WalletPageClient() {
  const [sidepaneOpen, setSidepaneOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Open sidepane if there's a success parameter or if user wants to view transactions
    const success = searchParams.get("success");
    const view = searchParams.get("view");
    
    if (success === "true" || view === "transactions") {
      setSidepaneOpen(true);
    }
  }, [searchParams]);

  const handleViewTransactions = () => {
    setSidepaneOpen(true);
  };

  return (
    <>
      <WalletLoadPage onViewTransactions={handleViewTransactions} />
      <WalletSidepane isOpen={sidepaneOpen} onClose={() => setSidepaneOpen(false)} />
    </>
  );
}

