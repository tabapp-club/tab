'use client';

import React, { useState } from 'react';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading?: boolean;
}

export function PhoneInput({ onSubmit, isLoading = false }: PhoneInputProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);

    // Format as needed (can add formatting logic here)
    return limitedDigits;
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 0) {
      return 'Phone number is required';
    }

    if (digits.length !== 10) {
      return 'Please enter a valid 10-digit phone number';
    }

    if (!/^[6-9]/.test(digits)) {
      return 'Phone number must start with 6, 7, 8, or 9';
    }

    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedValue);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const validationError = validatePhoneNumber(phoneNumber);
  //   if (validationError) {
  //     setError(validationError);
  //     return;
  //   }

  //   onSubmit(phoneNumber);
  // };

  const isValid = phoneNumber.length === 10 && !error;

    return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3 items-center w-full">
        <div className="text-[#a1a1a1] text-xs sm:text-sm md:text-[14px] font-medium text-center font-['Manrope'] leading-[1.4] px-2">
          Enter the registered phone number
        </div>

        <div className="w-full space-y-2 ">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="9876543210"
            className={`w-full h-10 sm:h-12 px-2 sm:px-4 py-2 sm:py-3 border border-[#1c1b1b] rounded text-[#151515] text-base sm:text-lg md:text-[20px] font-bold text-center tracking-[2px] sm:tracking-[4px] md:tracking-[6px] font-['Manrope'] leading-[1.4] focus:outline-none focus:ring-2 focus:ring-[#151515] focus:border-transparent transition-colors ${
              error
                ? 'border-[#e34f2f] focus:ring-[#e34f2f]'
                : 'border-[#e9e9e9] hover:border-gray-300'
            }`}
            maxLength={10}
            disabled={isLoading}
          />

          {error && (
            <div className="text-[#e34f2f] text-xs sm:text-sm text-center px-2 py-1 bg-red-50 rounded border border-red-200">
              {error}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const validationError = validatePhoneNumber(phoneNumber);
          if (validationError) {
            setError(validationError);
            return;
          }
          onSubmit(phoneNumber);
        }}
        disabled={!isValid || isLoading}
        className={`w-full h-10 sm:h-12 rounded font-semibold text-xs sm:text-sm md:text-[14px] tracking-[-0.2px] sm:tracking-[-0.249181px] font-['Manrope'] leading-[1.3] transition-all duration-200 ${
          isValid && !isLoading
            ? 'bg-[#2a2a2f] text-white hover:bg-gray-800 active:bg-gray-900'
            : 'bg-[#a1a1a1] text-white cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-xs sm:text-sm">Sending...</span>
          </div>
        ) : (
          'Continue'
        )}
      </button>
    </div>
  );
}
