"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletBalance, useCreatePayment } from "@/hooks/useWalletData";
import { formatCurrency } from "@/lib/utils";
import { CreatePaymentRequest } from "@/lib/api/types";

const QUICK_AMOUNTS = [
  { amount: 1000, recommended: false },
  { amount: 2500, recommended: false },
  { amount: 5000, recommended: true },
  { amount: 10000, recommended: false },
];

export function WalletAddFundsContent() {
  const router = useRouter();
  const { data: balanceData } = useWalletBalance();
  const balance = balanceData?.data.balance ?? 0;
  const currency = balanceData?.data.currency ?? "INR";
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(5000); // Default to recommended
  const [customAmount, setCustomAmount] = useState<string>('');
  const createPayment = useCreatePayment();

  const handleRecharge = async () => {
    const amountToRecharge = getAmountToRecharge();
    if (amountToRecharge <= 0) return;

    try {
      const paymentData: CreatePaymentRequest = {
        amount: amountToRecharge,
        payment_method: "upi",
        return_url: typeof window !== "undefined" ? `${window.location.origin}/wallet/recharge` : undefined,
      };

      const response = await createPayment.mutateAsync(paymentData);
      const paymentId = response.data.payment_id;
      
      // Navigate to payment page with query params
      const params = new URLSearchParams({
        amount: amountToRecharge.toString(),
        title: "Wallet Recharge",
        paymentId: paymentId,
        returnTo: "/wallet/recharge",
      });
      
      router.push(`/wallet/payment?${params.toString()}`);
    } catch (err: any) {
      console.error("Failed to create payment:", err);
      // Navigate to payment page even if payment creation fails
      const params = new URLSearchParams({
        amount: amountToRecharge.toString(),
        title: "Wallet Recharge",
        returnTo: "/wallet/recharge",
      });
      router.push(`/wallet/payment?${params.toString()}`);
    }
  };

  const getAmountToRecharge = (): number => {
    if (selectedAmount === 'custom') {
      return customAmount ? parseFloat(customAmount) : 0;
    }
    return selectedAmount;
  };

  return (
    <div className="space-y-2">
      {/* Current Balance */}
      <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
        <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
          <div className="text-center w-full">
            <p className="text-sm text-[#626266] mb-1">Current Balance</p>
            <p className="text-3xl font-bold text-[#2a2a2f]">{formatCurrency(balance, currency)}</p>
          </div>
        </div>
      </div>

      {/* Quick Amount Selection */}
      <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
        <div className="box-border flex gap-4 items-center justify-start overflow-clip p-6 relative w-full">
          <div className="w-full">
            <p className="text-sm font-semibold text-[#2a2a2f] mb-4">Select Amount</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {QUICK_AMOUNTS.map((option) => {
                const isSelected = selectedAmount === option.amount;
                return (
                  <button
                    key={option.amount}
                    onClick={() => setSelectedAmount(option.amount)}
                    className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all bg-white ${
                      isSelected
                        ? 'text-[#9747FF] border-[#9747FF]'
                        : 'text-[#2a2a2f] border-[#e9e9e9] hover:border-[#9747FF]'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {formatCurrency(option.amount, currency)}
                    </span>
                    {option.recommended && (
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#9747FF]/10 text-[#9747FF]'
                          : 'bg-[#9747FF]/10 text-[#9747FF]'
                      }`}>
                        Recommended
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setSelectedAmount('custom')}
                className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-all bg-white ${
                  selectedAmount === 'custom'
                    ? 'text-[#9747FF] border-[#9747FF]'
                    : 'text-[#2a2a2f] border-[#e9e9e9] hover:border-[#9747FF]'
                }`}
              >
                <span className="text-sm font-medium">Custom</span>
              </button>
            </div>
            {selectedAmount === 'custom' && (
              <div className="mb-4">
                <input
                  type="text"
                  inputMode="decimal"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="w-full px-4 py-2 text-sm border border-[#e9e9e9] rounded-lg focus:border-[#9747FF] focus:outline-none"
                />
              </div>
            )}
            <div className="flex justify-end pt-6 border-t border-[#e9e9e9]">
              <button
                onClick={handleRecharge}
                className="inline-flex items-center justify-center h-12 px-6 bg-white border-[0.5px] border-[#9747FF] hover:bg-[#9747FF]/5 text-[#9747FF] font-semibold rounded-full transition-all duration-200 shadow-[0_4px_0_0_#9747FF]"
              >
                Recharge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Minimum Balance Suggestion */}
      <div className="bg-blue-50 border border-blue-200 rounded p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Maintain Minimum Balance</p>
            <p className="text-xs text-blue-700">
              We recommend keeping a minimum balance of ₹1,000 to ensure smooth and uninterrupted communication with your customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

