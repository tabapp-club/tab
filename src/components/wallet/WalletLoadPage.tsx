"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreatePayment, usePaymentStatus, useWalletBalance } from "@/hooks/useWalletData";
import { formatCurrency, formatCurrencyWithDecimals } from "@/lib/utils";
import { CreatePaymentRequest } from "@/lib/api/types";

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

interface WalletLoadPageProps {
  onViewTransactions?: () => void;
}

export function WalletLoadPage({ onViewTransactions }: WalletLoadPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<{ qr_code_url?: string; payment_url?: string } | null>(null);

  const { data: balanceData } = useWalletBalance();
  const createPayment = useCreatePayment();
  const { data: paymentStatusData } = usePaymentStatus(paymentId);

  const balance = balanceData?.data.balance ?? 0;
  const currency = balanceData?.data.currency ?? "INR";

  // Check payment status
  useEffect(() => {
    if (paymentId && paymentStatusData?.data) {
      const status = paymentStatusData.data.status;
      if (status === "completed") {
        // Payment successful - close modal and refresh
        setTimeout(() => {
          router.push("/wallet/recharge?success=true");
        }, 2000);
      } else if (status === "failed" || status === "cancelled") {
        setError(paymentStatusData.data.failure_reason || "Payment failed. Please try again.");
        setShowQR(false);
        setPaymentId(null);
      }
    }
  }, [paymentStatusData, paymentId, router]);

  const handleAmountChange = (value: string) => {
    // Only allow numbers and one decimal point
    const cleaned = value.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;
    setAmount(cleaned);
    setError("");
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
    setError("");
  };

  const validateAmount = (): number | null => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
      return null;
    }
    if (numAmount < 100) {
      setError("Minimum recharge amount is ₹100");
      return null;
    }
    if (numAmount > 100000) {
      setError("Maximum recharge amount is ₹1,00,000");
      return null;
    }
    return numAmount;
  };

  const handleProceed = async () => {
    setError("");
    const numAmount = validateAmount();
    if (!numAmount) return;

    try {
      const paymentData: CreatePaymentRequest = {
        amount: numAmount,
        payment_method: paymentMethod,
        return_url: typeof window !== "undefined" ? `${window.location.origin}/wallet` : undefined,
      };

      const response = await createPayment.mutateAsync(paymentData);
      setPaymentId(response.data.payment_id);
      setPaymentResponse(response.data);
      setShowQR(true);
    } catch (err: any) {
      setError(err?.message || "Failed to create payment. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowQR(false);
    setPaymentId(null);
    setPaymentResponse(null);
    setAmount("");
    setError("");
  };

  const currentPayment = paymentStatusData?.data;

  const qrCodeUrl = showQR && paymentResponse?.qr_code_url
    ? paymentResponse.qr_code_url
    : paymentId && showQR
      ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`payment://${paymentId}`)}`
      : null;

  return (
    <div className="min-h-screen bg-[#f6f6f6] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#626266] hover:text-[#2a2a2f] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
            {onViewTransactions && (
              <button
                onClick={onViewTransactions}
                className="flex items-center gap-2 text-[#9747FF] hover:text-[#8545dd] font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>View Transactions</span>
              </button>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2a2a2f]">Recharge Wallet</h1>
          <p className="text-sm sm:text-base text-[#626266] mt-2">
            Add money to your wallet to send campaigns and invoices
          </p>
        </div>

        {/* Current Balance Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#626266] mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-[#2a2a2f]">{formatCurrency(balance, currency)}</p>
            </div>
            <div className="w-12 h-12 bg-[#9747FF]/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-[#9747FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {!showQR ? (
          <>
            {/* Amount Input */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <label className="block text-sm font-semibold text-[#2a2a2f] mb-3">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#626266] font-medium">₹</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-[#2a2a2f] border-2 border-gray-200 rounded-xl focus:border-[#9747FF] focus:outline-none transition-colors"
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              )}

              {/* Quick Amounts */}
              <div className="mt-4">
                <p className="text-sm text-[#626266] mb-3">Quick Select</p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {QUICK_AMOUNTS.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => handleQuickAmount(quickAmount)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        amount === quickAmount.toString()
                          ? "bg-[#9747FF] text-white"
                          : "bg-gray-100 text-[#2a2a2f] hover:bg-gray-200"
                      }`}
                    >
                      ₹{quickAmount.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <label className="block text-sm font-semibold text-[#2a2a2f] mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                {[
                  { value: "upi", label: "UPI", icon: "📱" },
                  { value: "card", label: "Card", icon: "💳" },
                  { value: "netbanking", label: "Net Banking", icon: "🏦" },
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value as any)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === method.value
                        ? "border-[#9747FF] bg-[#9747FF]/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-[#2a2a2f]">{method.label}</span>
                    {paymentMethod === method.value && (
                      <svg className="w-5 h-5 text-[#9747FF] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={!amount || createPayment.isPending}
              className="w-full h-14 bg-[#9747FF] hover:bg-[#8545dd] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {createPayment.isPending ? "Processing..." : `Proceed to Pay ${amount ? formatCurrencyWithDecimals(parseFloat(amount) || 0, currency) : ""}`}
            </button>
          </>
        ) : (
          /* QR Code Display */
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#2a2a2f] mb-2">Scan QR Code to Pay</h2>
              <p className="text-sm text-[#626266] mb-6">
                Scan this QR code with your UPI app to complete the payment
              </p>

              {qrCodeUrl && (
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
                    <img
                      src={qrCodeUrl}
                      alt="Payment QR Code"
                      className="w-64 h-64 sm:w-80 sm:h-80"
                    />
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-[#626266] mb-1">Amount to Pay</p>
                <p className="text-2xl font-bold text-[#2a2a2f]">
                  {currentPayment ? formatCurrencyWithDecimals(currentPayment.amount, currency) : formatCurrencyWithDecimals(parseFloat(amount) || 0, currency)}
                </p>
              </div>

              {currentPayment && (
                <div className="mb-6">
                  {currentPayment.status === "pending" && (
                    <div className="flex items-center justify-center gap-2 text-[#626266]">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Waiting for payment...</span>
                    </div>
                  )}
                  {currentPayment.status === "completed" && (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold">Payment Successful!</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-[#2a2a2f] font-medium rounded-full transition-colors"
                >
                  Cancel
                </button>
                {paymentResponse?.payment_url && (
                  <a
                    href={paymentResponse.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 h-12 bg-[#9747FF] hover:bg-[#8545dd] text-white font-medium rounded-full transition-colors flex items-center justify-center"
                  >
                    Open Payment Link
                  </a>
                )}
              </div>

              <p className="text-xs text-[#626266] mt-4">
                Payment will be automatically verified. Please do not close this page.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
