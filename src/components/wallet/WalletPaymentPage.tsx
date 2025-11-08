"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { usePaymentStatus } from "@/hooks/useWalletData";

interface WalletPaymentPageProps {
  amount?: number;
  title?: string;
  onBack?: () => void;
  paymentId?: string | null;
  onPaymentConfirmed?: () => void;
}

export function WalletPaymentPage({ amount, title = "Payment", onBack, paymentId, onPaymentConfirmed }: WalletPaymentPageProps) {
  const currency = "INR";
  const qrAmount = amount ? amount.toString() : "";
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const { data: paymentStatusData } = usePaymentStatus(paymentId ?? null);

  useEffect(() => {
    if (paymentId && paymentStatusData?.data) {
      const status = paymentStatusData.data.status;
      if (status === "completed") {
        setPaymentCompleted(true);
      }
    }
  }, [paymentStatusData, paymentId]);

  const handlePaymentConfirmed = () => {
    if (onPaymentConfirmed) {
      onPaymentConfirmed();
    } else if (onBack) {
      onBack();
    }
  };

  return (
    <div className="space-y-2">
      {/* Back Button */}
      {onBack && (
        <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
          <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-[#626266] hover:text-[#2a2a2f] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment Amount Display */}
      {amount && (
        <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
          <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
            <div className="text-center w-full">
              <p className="text-sm text-[#626266] mb-1">Amount to Pay</p>
              <p className="text-3xl font-bold text-[#2a2a2f]">{formatCurrency(amount, currency)}</p>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
        <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
          <div className="text-center w-full">
            <p className="text-sm font-semibold text-[#2a2a2f] mb-4">Scan QR Code to Pay</p>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white border-2 border-[#e9e9e9] rounded">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=merchant@upi&pn=Merchant%20Name&am=${qrAmount}&cu=INR&tn=${title}`)}`}
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
            <p className="text-xs text-[#626266]">Scan with any UPI app to complete the payment</p>
          </div>
        </div>
      </div>

      {/* UPI ID Section */}
      <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
        <div className="box-border flex gap-4 items-center justify-start overflow-clip p-[12px] relative w-full">
          <div className="text-center w-full">
            <div className="flex items-center justify-center gap-3 mb-2">
              <p className="text-sm font-semibold text-[#2a2a2f]">Or Send to UPI ID</p>
              <div className="bg-gray-50 rounded-lg px-3 py-1.5">
                <code className="text-base font-bold text-[#2a2a2f]">
                  merchant@upi
                </code>
              </div>
            </div>
            <p className="text-xs text-[#626266]">
              Send {amount ? formatCurrency(amount, currency) : "the amount"} to this UPI ID to complete the payment
            </p>
          </div>
        </div>
      </div>

      {/* Payment Completed Section */}
      {paymentCompleted && (
        <>
          <div className="bg-[#ffffff] relative rounded w-full border border-[#e9e9e9]">
            <div className="box-border flex gap-4 items-center justify-start overflow-clip p-4 relative w-full">
              <div className="text-center w-full">
                <p className="text-xs text-[#626266] mb-4">
                  Please click on payment complete button after completing the payment successfully to confirm.
                </p>
                <button
                  onClick={handlePaymentConfirmed}
                  className="inline-flex items-center justify-center h-12 px-6 bg-white border-[0.5px] border-[#9747FF] hover:bg-[#9747FF]/5 text-[#9747FF] font-semibold rounded-full transition-all duration-200 shadow-[0_4px_0_0_#9747FF]"
                >
                  Payment Completed
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
