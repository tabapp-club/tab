import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Wallet - Recharge & Transactions",
  description: "Manage your wallet, recharge money, and view transaction history.",
};

export default function WalletPage() {
  // Redirect to recharge tab by default (first tab)
  redirect("/wallet/recharge");
}

