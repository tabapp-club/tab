'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoginLayout } from '@/components/login/LoginLayout';
import { PhoneInput } from '@/components/login/PhoneInput';
import { OTPInput } from '@/components/login/OTPInput';

type LoginStep = 'phone' | 'otp';

export default function LoginPage() {
  const [currentStep, setCurrentStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [hasOTPError, setHasOTPError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { sendOTP, login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handlePhoneSubmit = async (phone: string) => {
    try {
      setErrorMessage('');
      const success = await sendOTP(phone);
      if (success) {
        setPhoneNumber(phone);
        setCurrentStep('otp');
        setHasOTPError(false);
      } else {
        setErrorMessage('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  const handleOTPSubmit = async (otp: string) => {
    try {
      setErrorMessage('');
      setHasOTPError(false);
      const success = await login(phoneNumber, otp);
      if (success) {
        // Redirect to dashboard on successful login
        router.push('/dashboard');
      } else {
        // Show error state for invalid OTP
        setHasOTPError(true);
        setErrorMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setHasOTPError(true);
      setErrorMessage('Login failed. Please try again.');
    }
  };

  const handleResendOTP = async () => {
    try {
      setHasOTPError(false);
      setErrorMessage('');
      const success = await sendOTP(phoneNumber);
      if (!success) {
        setErrorMessage('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setErrorMessage('Network error. Please try again.');
    }
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setPhoneNumber('');
    setHasOTPError(false);
    setErrorMessage('');
  };

  // Use default carousel for all steps

  return (
    <LoginLayout>
      <div className="space-y-6">
        {/* Back button for OTP step */}
        {currentStep === 'otp' && (
          <button
            onClick={handleBackToPhone}
            className="flex items-center text-[#151515] hover:text-[#151515] transition-colors"
            disabled={isLoading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to phone number
          </button>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm text-center">
            {errorMessage}
          </div>
        )}

        {/* Conditional rendering based on current step */}
        {currentStep === 'phone' ? (
          <PhoneInput
            onSubmit={handlePhoneSubmit}
            isLoading={isLoading}
          />
        ) : (
          <OTPInput
            onSubmit={handleOTPSubmit}
            onResendOTP={handleResendOTP}
            isLoading={isLoading}
            hasError={hasOTPError}
            phoneNumber={phoneNumber}
          />
        )}

        {/* Phone number display for OTP step */}
        {currentStep === 'otp' && (
          <div className="text-center text-sm text-[#a1a1a1]">
            OTP sent to {phoneNumber}
          </div>
        )}
      </div>
    </LoginLayout>
  );
}
