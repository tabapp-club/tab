"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useCreatePayment } from "@/hooks/useWalletData";
import { CreatePaymentRequest } from "@/lib/api/types";

type PaymentFrequency = 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
type PlatformStatus = 'active' | 'paused';

interface PlatformPlan {
  frequency: PaymentFrequency;
  label: string;
  price: number;
  recommended?: boolean;
  savings?: string;
}

const platformPlans: PlatformPlan[] = [
  {
    frequency: 'monthly',
    label: 'Monthly',
    price: 3999,
  },
  {
    frequency: 'quarterly',
    label: 'Quarterly',
    price: 10677,
    savings: 'Save 11%',
  },
  {
    frequency: 'half_yearly',
    label: 'Half Yearly',
    price: 19909,
    recommended: true,
    savings: 'Save 17%',
  },
  {
    frequency: 'yearly',
    label: 'Yearly',
    price: 37431,
    recommended: true,
    savings: 'Save 22%',
  },
];

export function WalletPlatformContent() {
  const router = useRouter();
  const [selectedFrequency, setSelectedFrequency] = useState<PaymentFrequency>('monthly');
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus>('active');
  const [showPaymentReminder, setShowPaymentReminder] = useState(true);
  const createPayment = useCreatePayment();

  const currentPlan = platformPlans.find(plan => plan.frequency === selectedFrequency);

  const handleUpdatePayment = async () => {
    if (!currentPlan) return;

    try {
      const paymentData: CreatePaymentRequest = {
        amount: currentPlan.price,
        payment_method: "upi",
        return_url: typeof window !== "undefined" ? `${window.location.origin}/wallet/platform` : undefined,
      };

      const response = await createPayment.mutateAsync(paymentData);
      const paymentId = response.data.payment_id;
      
      // Navigate to payment page with query params
      const params = new URLSearchParams({
        amount: currentPlan.price.toString(),
        title: "Platform Fee Payment",
        paymentId: paymentId,
        returnTo: "/wallet/platform",
      });
      
      router.push(`/wallet/payment?${params.toString()}`);
    } catch (err: any) {
      console.error("Failed to create payment:", err);
      // Navigate to payment page even if payment creation fails
      const params = new URLSearchParams({
        amount: currentPlan.price.toString(),
        title: "Platform Fee Payment",
        returnTo: "/wallet/platform",
      });
      router.push(`/wallet/payment?${params.toString()}`);
    }
  };

  const getStatusBadge = (status: PlatformStatus) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-green-500 rounded-full"></span>
          Active
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <span className="w-1.5 h-1.5 mr-1.5 bg-yellow-500 rounded-full"></span>
          Paused
        </span>
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* Platform Status Card */}
      <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
        <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
          <div className="flex items-center justify-between w-full">
            <div>
              <p className="text-xs text-[#626266] mb-1">Platform Status</p>
              <div className="flex items-center gap-2">
                {getStatusBadge(platformStatus)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#626266] mb-1">Current Plan</p>
              <p className="text-sm font-semibold text-[#2a2a2f]">
                {currentPlan?.label || 'Monthly'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Reminder */}
      {showPaymentReminder && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-yellow-900 mb-1">Platform Fee Payment Due</p>
                <p className="text-xs text-yellow-700">
                  Your platform fee payment is due. Please update your payment plan to continue using the platform.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPaymentReminder(false)}
              className="text-yellow-600 hover:text-yellow-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Payment Frequency Options */}
      <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
        <div className="box-border flex gap-4 items-center justify-start overflow-clip p-6 relative w-full">
          <div className="w-full">
            <h3 className="text-sm font-semibold text-[#2a2a2f] mb-4">Select Payment Frequency</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {platformPlans.map((plan) => {
                const isSelected = selectedFrequency === plan.frequency;
                const monthlyEquivalent = plan.frequency === 'monthly' 
                  ? plan.price 
                  : plan.frequency === 'quarterly'
                  ? plan.price / 3
                  : plan.frequency === 'half_yearly'
                  ? plan.price / 6
                  : plan.price / 12;

                return (
                  <button
                    key={plan.frequency}
                    onClick={() => setSelectedFrequency(plan.frequency)}
                    className={`flex-1 min-w-[140px] bg-[#ffffff] relative rounded border ${
                      isSelected
                        ? 'border-[#9747FF]'
                        : 'border-[#e9e9e9]'
                    } hover:border-[#9747FF] transition-colors text-left`}
                  >
                    <div className="box-border flex flex-col gap-2 items-start overflow-clip p-[12px] relative w-full">
                      <div className="flex items-center gap-2 w-full">
                        <p className="text-[14px] font-semibold text-[#2a2a2f]">{plan.label}</p>
                        {plan.recommended && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#9747FF]/10 text-[#9747FF]">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-start w-full">
                        <p className="text-[14px] font-bold text-[#2a2a2f]">
                          {formatCurrency(plan.price, "INR")}
                        </p>
                        {plan.frequency !== 'monthly' && (
                          <p className="text-[12px] text-[#626266]">
                            {formatCurrency(monthlyEquivalent, "INR")}/month
                          </p>
                        )}
                        {plan.savings && (
                          <p className="text-[12px] text-green-600 font-medium mt-1">{plan.savings}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-6 border-t border-[#e9e9e9]">
              <button
                onClick={handleUpdatePayment}
                className="inline-flex items-center justify-center h-12 px-6 bg-white border-[0.5px] border-[#9747FF] hover:bg-[#9747FF]/5 text-[#9747FF] font-semibold rounded-full transition-all duration-200 shadow-[0_4px_0_0_#9747FF]"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-[#626266] mt-2 text-center">
        Your payment will be processed immediately and the plan will be updated
      </p>
    </div>
  );
}

