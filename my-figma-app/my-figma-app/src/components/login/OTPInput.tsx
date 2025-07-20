'use client';

import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  onSubmit: (otp: string) => void;
  onResendOTP: () => void;
  isLoading?: boolean;
  hasError?: boolean;
  phoneNumber?: string;
}

export function OTPInput({
  onSubmit,
  onResendOTP,
  isLoading = false,
  hasError = false,
  phoneNumber = ''
}: OTPInputProps) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, canResend]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Auto-submit when OTP is complete
  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6 && !hasError) {
      onSubmit(otpValue);
    }
  }, [otp, hasError, onSubmit]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value !== '' && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault();

      if (otp[index] !== '') {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (/^\d+$/.test(pastedData)) {
      const newOtp = Array(6).fill('');
      for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleResendClick = () => {
    if (canResend) {
      setCanResend(false);
      setResendTimer(30);
      setOtp(Array(6).fill(''));
      onResendOTP();

      // Focus first input after resend
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onSubmit(otpValue);
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="text-[#a1a1a1] text-xs sm:text-sm md:text-[14px] font-medium text-center font-['Manrope'] leading-[1.4] px-2">
          Enter the OTP
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-2 w-full max-w-xs mx-auto">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el }}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`flex-1 max-w-[45px] h-10 sm:h-12 border border-[#e9e9e9] rounded text-center text-base sm:text-lg md:text-[20px] font-bold font-['Manrope'] focus:outline-none focus:ring-2 transition-colors ${
                hasError
                  ? 'border-[#e34f2f] text-[#e34f2f] focus:ring-[#e34f2f] focus:border-[#e34f2f]'
                  : 'text-[#2a2a2f] border-[#e9e9e9] focus:ring-[#151515] focus:border-transparent hover:border-gray-300'
              }`}
              maxLength={1}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="flex justify-end w-full">
          <button
            type="button"
            onClick={handleResendClick}
            disabled={!canResend || isLoading}
            className={`text-xs sm:text-sm md:text-[14px] font-medium font-['Manrope'] transition-colors ${
              canResend && !isLoading
                ? 'text-[#151515] hover:text-[#6545dd] cursor-pointer'
                : 'text-[#a1a1a1] cursor-not-allowed'
            }`}
          >
            {canResend ? 'Resend OTP' : hasError ? 'OTP Sent' : `Resend in ${resendTimer}s`}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const otpValue = otp.join('');
          if (otpValue.length === 6) {
            onSubmit(otpValue);
          }
        }}
        disabled={!isComplete || isLoading}
        className={`w-full h-10 sm:h-12 rounded font-semibold text-xs sm:text-sm md:text-[14px] tracking-[-0.2px] sm:tracking-[-0.249181px] font-['Manrope'] leading-[1.3] transition-all duration-200 ${
          isComplete && !isLoading
            ? 'bg-[#2a2a2f] text-white hover:bg-gray-800 active:bg-gray-900'
            : 'bg-[#a1a1a1] text-white cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-xs sm:text-sm">Verifying...</span>
          </div>
        ) : (
          'Continue'
        )}
      </button>

      {hasError && (
        <div className="text-center text-[#e34f2f] text-xs sm:text-sm md:text-[14px] font-medium font-['Manrope'] px-2 py-2 bg-red-50 rounded border border-red-200 mt-2">
          Invalid OTP. Please try again.
        </div>
      )}
    </div>
  );
}
