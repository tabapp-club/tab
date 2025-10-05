'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();
  const router = useRouter();

  // Focus first OTP input when OTP screen appears
  React.useEffect(() => {
    if (isOtpSent && !isOtpVerified) {
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }, [isOtpSent, isOtpVerified]);

  // Navigate to dashboard when authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Carousel data
  const carouselSlides = [
    {
      title: "Track Performance",
      description: "Monitor your business metrics in real-time with comprehensive analytics",
      image: "/track-performance.png"
    },
    {
      title: "Engage Customers",
      description: "Build meaningful connections with your audience through targeted campaigns",
      image: "/grow-revenue.png"
    },
    {
      title: "Retain Users",
      description: "Keep your customers coming back with smart retention strategies",
      image: "/smart-campaigns.png"
    },
    {
      title: "AI Insights",
      description: "Leverage artificial intelligence to understand and predict customer behavior",
      image: "/customer-insights.png"
    }
  ];

  // Auto-advance carousel
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [carouselSlides.length]);

  // FAQ data with answers
  const faqItems = [
    {
      question: "How do I login to my account?",
      answer: "To login to your account, enter your registered phone number in the input field and click the 'Login' button. You'll receive an OTP via SMS to complete the authentication process."
    },
    {
      question: "What if I forgot my password?",
      answer: "Our system uses phone number authentication with OTP, so you don't need to remember a password. Simply enter your registered phone number and we'll send you a verification code."
    },
    {
      question: "How do I change my phone number?",
      answer: "To change your phone number, please contact our support team. They will help you update your account with the new number and verify your identity."
    },
    {
      question: "Why am I not receiving OTP?",
      answer: "If you're not receiving the OTP, please check: 1) Your phone has good network coverage, 2) The phone number is correct, 3) Check your spam folder. If issues persist, contact support."
    }
  ];

  // State for accordion
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // State for contact sales form
  const [salesForm, setSalesForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    requirement: ''
  });

  // Phone number validation
  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digits
    const cleanPhone = phone.replace(/\D/g, '');

    // Check if it's a valid Indian mobile number
    if (cleanPhone.length === 10) {
      const firstDigit = cleanPhone[0];
      // Indian mobile numbers start with 6, 7, 8, or 9
      if (['6', '7', '8', '9'].includes(firstDigit)) {
        return { isValid: true, formatted: cleanPhone };
      }
    }

    return { isValid: false, formatted: cleanPhone };
  };

  // OTP validation
  const validateOTP = (otpCode: string) => {
    const cleanOtp = otpCode.replace(/\D/g, '');
    return cleanOtp.length === 6;
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length <= 3) return cleanPhone;
    if (cleanPhone.length <= 6) return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3)}`;
    return `${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
  };

  // Resend timer countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Handle phone number submission and OTP sending
  const handleSendOTP = async () => {
    setError('');
    setOtpError('');

    const validation = validatePhoneNumber(phoneNumber);

    if (!validation.isValid) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      await sendOTP(validation.formatted);
      setIsOtpSent(true);
      setResendTimer(30); // 30 seconds cooldown
      setIsResendDisabled(true);
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    setOtpError('');

    if (!validateOTP(otp)) {
      setOtpError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(phoneNumber, otp);
      if (result.success) {
        setIsOtpVerified(true);
        setOtpError('');
        // Navigation will be handled by useEffect when isAuthenticated becomes true
      } else {
        // Check if it's a user not registered error
        if (result.error === 'User not registered') {
          setOtpError('User not registered. Please contact support to create an account.');
          setIsOtpSent(false);
          setOtp('');
          setOtpAttempts(0);
        } else {
          setOtpAttempts(prev => prev + 1);
          if (otpAttempts >= 2) {
            setOtpError('Too many failed attempts. Please request a new OTP.');
            setIsOtpSent(false);
            setOtp('');
            setOtpAttempts(0);
          } else {
            setOtpError(result.error || 'Invalid OTP. Please try again.');
          }
        }
      }
    } catch (error: any) {
      setOtpError(error.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (isResendDisabled) return;

    setOtpError('');
    setIsLoading(true);
    try {
      await sendOTP(phoneNumber);
      setResendTimer(30);
      setIsResendDisabled(true);
      setOtp('');
      setOtpAttempts(0);
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to phone number input
  const handleBackToPhone = () => {
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setOtp('');
    setOtpError('');
    setError('');
    setOtpAttempts(0);
    setResendTimer(0);
    setIsResendDisabled(false);
  };

  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError('');
    }
  };

  // Handle individual OTP digit input
  const handleOtpDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = otp.split('');
    newOtp[index] = digit;
    const updatedOtp = newOtp.join('');

    setOtp(updatedOtp);
    setOtpError('');

    // Auto-focus next input if digit was entered
    if (digit && index < 5) {
      // Use multiple timing strategies for better compatibility
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }, 10);
    }

    // Auto-validate when all 6 digits are entered
    if (updatedOtp.length === 6 && updatedOtp.replace(/\s/g, '').length === 6) {
      setTimeout(() => {
        handleAutoVerifyOTP(updatedOtp);
      }, 300);
    }
  };

  // Handle OTP input keydown for navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty, go to previous field
        e.preventDefault();
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      } else if (otp[index]) {
        // If current field has value, clear it first
        const newOtp = otp.split('');
        newOtp[index] = '';
        setOtp(newOtp.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    } else if (e.key === 'Delete') {
      // Handle delete key
      const newOtp = otp.split('');
      newOtp[index] = '';
      setOtp(newOtp.join(''));
    }
  };





  // Auto-verify OTP when all digits are entered
  const handleAutoVerifyOTP = async (otpCode: string) => {
    setOtpError('');
    setIsLoading(true);

    try {
      const isValid = await verifyOTP(phoneNumber, otpCode);
      if (isValid) {
        setIsOtpVerified(true);
        setOtpError('');
        // Redirect to dashboard after successful verification
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setOtpAttempts(prev => prev + 1);
        if (otpAttempts >= 2) {
          setOtpError('Too many failed attempts. Please request a new OTP.');
          setIsOtpSent(false);
          setOtp('');
          setOtpAttempts(0);
          // Focus back to first input
          setTimeout(() => {
            const firstInput = document.getElementById('otp-0');
            firstInput?.focus();
          }, 100);
        } else {
          setOtpError('Invalid OTP. Please try again.');
          // Clear OTP and focus first input
          setOtp('');
          setTimeout(() => {
            const firstInput = document.getElementById('otp-0');
            firstInput?.focus();
          }, 100);
        }
      }
    } catch (error: any) {
      setOtpError('Failed to verify OTP. Please try again.');
      // Clear OTP and focus first input
      setOtp('');
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0');
        firstInput?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };



  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length <= 6) {
      setOtp(pastedData);
      setOtpError('');

      // Focus the next empty field or the last field
      const nextIndex = Math.min(pastedData.length, 5);
      requestAnimationFrame(() => {
        const nextInput = document.getElementById(`otp-${nextIndex}`);
        if (nextInput) {
          nextInput.focus();
        }
      });

      // Auto-verify if all 6 digits are pasted
      if (pastedData.length === 6) {
        setTimeout(() => {
          handleAutoVerifyOTP(pastedData);
        }, 200);
      }
    }
  };

  return (
    <div className="bg-white relative w-screen h-screen md:overflow-hidden" data-name="login page" data-node-id="293:4825">
      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Background Shadow Elements - Scaled proportionally */}
        <div className="absolute w-[93%] h-[87%] left-[3.4%] top-[6.3%] bg-white" data-name="BG" data-node-id="293:4898">
          <div className="absolute inset-0 border border-[#2a2a2f] border-opacity-20" />
        </div>

        {/* Right Side - Login Form or Help Modal */}
        <div className="absolute w-[25%] h-[38%] right-[200px] top-[26.4%] flex flex-col items-center justify-center px-6" data-name="Frame 1171279597" data-node-id="293:5406">
        {!showHelpModal && !showContactSupport && !showContactSales ? (
          // Login Form
          <>
            {/* Logo */}
            <div className="w-20 h-20 mb-8" data-name="Logo" data-node-id="293:4968">
              <svg width="80" height="80" viewBox="0 0 524 524" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="262" cy="262" r="262" fill="url(#paint0_linear_7845_13502)"/>
                <path d="M111.82 321.5C105.992 322.593 100.268 323.061 94.6484 322.905C89.0808 322.801 84.0855 321.838 79.6626 320.017C75.2918 318.144 71.9616 315.152 69.6721 311.041C67.5907 307.191 66.498 303.288 66.394 299.333C66.2899 295.327 66.2378 290.8 66.2378 285.753V213.79H87.4677V284.504C87.4677 287.782 87.4938 290.748 87.5458 293.402C87.6499 296.003 88.1962 298.085 89.1849 299.646C91.0581 302.612 94.05 304.225 98.1607 304.485C102.271 304.745 106.824 304.537 111.82 303.86V321.5ZM51.8765 253.596V237.205H111.82V253.596H51.8765ZM127.482 321.5V237.205H146.215V257.81L144.185 255.157C145.278 252.243 146.735 249.589 148.556 247.195C150.377 244.802 152.615 242.825 155.269 241.263C157.298 240.015 159.509 239.052 161.903 238.376C164.296 237.647 166.768 237.205 169.318 237.049C171.867 236.841 174.417 236.893 176.967 237.205V257.03C174.625 256.301 171.893 256.067 168.771 256.327C165.701 256.535 162.918 257.238 160.42 258.435C157.922 259.579 155.815 261.114 154.098 263.04C152.381 264.913 151.08 267.15 150.195 269.752C149.311 272.302 148.868 275.19 148.868 278.416V321.5H127.482ZM190.252 225.497V206.765H211.482V225.497H190.252ZM190.252 321.5V237.205H211.482V321.5H190.252ZM273.127 323.842C264.749 323.842 257.751 321.89 252.131 317.988C246.511 314.085 242.271 308.778 239.409 302.065C236.599 295.353 235.194 287.782 235.194 279.352C235.194 270.923 236.599 263.352 239.409 256.64C242.219 249.927 246.355 244.62 251.819 240.717C257.282 236.815 264.021 234.863 272.034 234.863C280.099 234.863 287.124 236.789 293.108 240.639C299.092 244.49 303.723 249.771 307.001 256.483C310.331 263.144 311.996 270.767 311.996 279.352C311.996 287.782 310.357 295.353 307.079 302.065C303.853 308.778 299.326 314.085 293.498 317.988C287.67 321.89 280.88 323.842 273.127 323.842ZM231.604 321.5V209.106H252.99V263.742H250.336V321.5H231.604ZM269.693 304.953C274.272 304.953 278.018 303.808 280.932 301.519C283.846 299.229 286.005 296.159 287.41 292.309C288.815 288.406 289.518 284.088 289.518 279.352C289.518 274.669 288.789 270.403 287.332 266.552C285.875 262.649 283.612 259.553 280.542 257.264C277.524 254.922 273.647 253.752 268.912 253.752C264.489 253.752 260.899 254.818 258.141 256.952C255.435 259.085 253.458 262.077 252.209 265.928C250.96 269.778 250.336 274.253 250.336 279.352C250.336 284.452 250.96 288.927 252.209 292.777C253.458 296.628 255.487 299.62 258.297 301.753C261.159 303.886 264.958 304.953 269.693 304.953ZM327.61 321.5V206.765H348.84V321.5H327.61ZM379.889 358.965L396.123 314.319L396.435 327.432L359.751 237.205H381.762L406.426 301.051H401.431L425.939 237.205H447.169L399.557 358.965H379.889Z" fill="white"/>
                <path d="M413.878 334.245H473.684V350.245H407.567L413.878 334.245Z" fill="#AB6AFF"/>
                <path d="M384.256 334.38H318.051V350.38H378.522L384.256 334.38Z" fill="#AB6AFF"/>
                <defs>
                <linearGradient id="paint0_linear_7845_13502" x1="262" y1="-57.8295" x2="255.517" y2="598.37" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9747FF"/>
                <stop offset="0.289538" stopColor="#6420BD"/>
                <stop offset="0.684985" stopColor="#6420BD"/>
                <stop offset="0.966994" stopColor="#9747FF"/>
                </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Description */}
            <div className="text-center text-[#a1a1a1] text-base font-light leading-relaxed mb-8 w-full" data-node-id="293:4972">
              Login to understand your customers like never before.
            </div>

            {/* Login Form */}
            <div className="w-full" data-name="Enter mobile number" data-node-id="293:4973">
              {!isOtpSent ? (
                // Phone Number Input
                <>
                  <div className="mb-6" data-name="Frame 1171279583" data-node-id="293:4974">
                    <div className="text-center text-[#2a2a2f] text-sm font-normal mb-3" data-node-id="293:4975">
                      Enter the registered phone number
                    </div>
                    <div className={`w-full h-12 border flex items-center justify-center px-4 transition-colors ${
                      error ? 'border-red-500' : 'border-[#e9e9e9] focus-within:border-[#6e4eff]'
                    }`} data-name="text input field" data-node-id="293:4976">
                      <input
                        type="tel"
                        value={formatPhoneNumber(phoneNumber)}
                        onChange={handlePhoneChange}
                        className="w-full text-center text-[#2a2a2f] text-lg font-bold tracking-widest bg-transparent outline-none placeholder:text-[#dadada]"
                        placeholder="9876543210"
                        maxLength={12}
                      />
                    </div>
                    {error && (
                      <div className="text-red-500 text-xs mt-2 text-center">
                        {error}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendOTP}
                    disabled={isLoading || !phoneNumber || phoneNumber.length !== 10}
                    className="w-full h-12 bg-[#6e4eff] hover:bg-[#5a3fd9] disabled:bg-[#a1a1a1] flex items-center justify-center gap-2 transition-colors"
                    data-name="Button" data-node-id="293:4978"
                  >
                    <span className="text-white text-base font-semibold">
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.35962 11.0913L18.6165 11.0913C17.2643 9.47141 16.6957 8.09788 16.5803 7.61377L17.761 6.81885C18.0461 7.64267 18.5455 8.42449 19.4211 9.63916C20.034 10.4894 20.8296 11.3523 21.4075 11.8228L21.6409 11.9995C21.0609 12.3994 20.1217 13.388 19.4211 14.3599C18.5454 15.5747 18.0461 16.3572 17.761 17.1812L16.5803 16.3853C16.6957 15.9011 17.2643 14.5276 18.6165 12.9077L2.35962 12.9077L2.35962 11.0913Z" fill="white"/>
                    </svg>
                  </button>
                </>
              ) : (
                // OTP Input
                <>
                  <div className="mb-6" data-name="Frame 1171279583" data-node-id="293:4974">
                    <div className="text-center text-[#2a2a2f] text-sm font-normal mb-6" data-node-id="293:4975">
                      Enter the 6-digit OTP sent to {formatPhoneNumber(phoneNumber)}
                    </div>

                    {/* Individual OTP Input Boxes */}
                    <div className="flex gap-3 justify-center mb-4">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div
                          key={index}
                          className={`w-12 h-12 border flex items-center justify-center p-3 relative transition-colors ${
                            otpError ? 'border-red-500' :
                            isLoading ? 'border-[#6e4eff]' :
                            'border-[#e9e9e9] focus-within:border-[#6e4eff]'
                          }`}
                          data-name="otp input field"
                        >
                          <input
                            id={`otp-${index}`}
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={otp[index] || ''}
                            onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                            onPaste={handleOtpPaste}
                            disabled={isLoading}
                            className={`w-full h-full text-center text-[#6e4eff] text-xl font-bold tracking-widest bg-transparent outline-none ${
                              isLoading ? 'opacity-50' : ''
                            }`}
                            maxLength={1}
                            autoComplete="off"
                            autoFocus={index === 0 && isOtpSent && !isOtpVerified}
                          />
                          {isLoading && index === 5 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <svg className="animate-spin h-4 w-4 text-[#6e4eff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {otpError && (
                      <div className="text-red-500 text-xs mt-2 text-center">
                        {otpError}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleVerifyOTP}
                      disabled={isLoading || !otp || otp.length !== 6}
                      className="w-full h-12 bg-[#6e4eff] hover:bg-[#5a3fd9] disabled:bg-[#a1a1a1] flex items-center justify-center gap-2 transition-colors"
                      data-name="Button" data-node-id="293:4978"
                    >
                      <span className="text-white text-base font-semibold">
                        {isLoading ? 'Verifying...' : isOtpVerified ? 'Verified!' : 'Verify OTP'}
                      </span>
                      {!isOtpVerified && !isLoading && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2.35962 11.0913L18.6165 11.0913C17.2643 9.47141 16.6957 8.09788 16.5803 7.61377L17.761 6.81885C18.0461 7.64267 18.5455 8.42449 19.4211 9.63916C20.034 10.4894 20.8296 11.3523 21.4075 11.8228L21.6409 11.9995C21.0609 12.3994 20.1217 13.388 19.4211 14.3599C18.5454 15.5747 18.0461 16.3572 17.761 17.1812L16.5803 16.3853C16.6957 15.9011 17.2643 14.5276 18.6165 12.9077L2.35962 12.9077L2.35962 11.0913Z" fill="white"/>
                        </svg>
                      )}
                      {isLoading && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </button>

                    <div className="flex gap-3">
                      <button
                        onClick={handleBackToPhone}
                        className="flex-1 h-10 border border-[#e9e9e9] hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6e4eff" strokeWidth="2">
                          <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                        <span className="text-[#6e4eff] text-sm font-medium">
                          Back
                        </span>
                      </button>

                      <button
                        onClick={handleResendOTP}
                        disabled={isResendDisabled || isLoading}
                        className="flex-1 h-10 border border-[#e9e9e9] hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 flex items-center justify-center gap-2 transition-colors"
                      >
                        <span className="text-[#6e4eff] text-sm font-medium">
                          {isResendDisabled ? `Resend (${resendTimer}s)` : 'Resend OTP'}
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : showContactSupport ? (
          // Contact Support Page
          <div className="w-full flex flex-col gap-[54px] items-start justify-start">
            {/* Back Button */}
          <button
              onClick={() => setShowContactSupport(false)}
              className="h-12 flex items-center justify-start gap-2 hover:bg-gray-50 transition-colors px-4 py-3"
              data-name="Button" data-node-id="801:30676"
            >
              <div className="flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.6413 11.0913L5.38348 11.0913C6.73574 9.47136 7.30519 8.0979 7.42059 7.61377L6.23895 6.81885C5.9538 7.64266 5.45443 8.42447 4.5788 9.63916C3.96586 10.4894 3.17036 11.3524 2.59247 11.8228L2.35907 11.9995C2.93905 12.3994 3.87817 13.388 4.5788 14.3599C5.45458 15.5748 5.95382 16.3572 6.23895 17.1812L7.42059 16.3853C7.30519 15.9011 6.73574 14.5277 5.38348 12.9077L21.6413 12.9077L21.6413 11.0913Z" fill="#6E4EFF"/>
                </svg>
              </div>
              <span className="text-[#2a2a2f] text-base font-semibold">
                Back to login
              </span>
            </button>

            {/* Contact Support Content */}
            <div className="w-full flex flex-col gap-10 items-start justify-start">
              {/* Header */}
              <div className="w-full flex flex-col gap-6 items-center justify-start">
                <div className="w-full flex flex-col gap-2 items-center justify-start text-center">
                  <h2 className="text-[#2a2a2f] text-2xl font-semibold leading-[1.4]">
                    Contact support?
                  </h2>
                  <p className="text-[#a1a1a1] text-base leading-[1.4]">
                    Find answers to common questions
                  </p>
                </div>
              </div>

              {/* Contact Options */}
              <div className="w-full flex flex-col gap-6 items-start justify-start">
                {/* Email Contact */}
                <div className="w-full bg-[#fbfbfb] border border-[#e9e9e9] p-4">
                  <div className="w-full flex flex-col gap-2 items-center justify-start">
                    <h3 className="text-[#2a2a2f] text-xl leading-[1.4] text-center">
                      Email
                    </h3>
                    <div className="w-full flex items-center justify-center">
                      <a
                        href="mailto:info@tabapp.club"
                        className="text-[#a1a1a1] text-base leading-[1.4] text-center hover:text-[#6e4eff] transition-colors"
                      >
                        info@tabapp.club
                      </a>
                    </div>
                  </div>
                </div>

                {/* Phone Contact */}
                <div className="w-full bg-[#fbfbfb] border border-[#e9e9e9] p-4">
                  <div className="w-full flex flex-col gap-2 items-center justify-start">
                    <h3 className="text-[#2a2a2f] text-xl leading-[1.4] text-center">
                      Contact
                    </h3>
                    <div className="w-full flex items-center justify-center">
                      <a
                        href="tel:+918977719997"
                        className="text-[#a1a1a1] text-base leading-[1.4] text-center hover:text-[#6e4eff] transition-colors"
                      >
                        +91 8977719997
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showContactSales ? (
          // Contact Sales Page
          <div className="w-full flex flex-col gap-12 items-start justify-start">
            {/* Back Button */}
            <button
              onClick={() => setShowContactSales(false)}
              className="h-12 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors px-4 py-3"
              data-name="Button" data-node-id="801:30685"
            >
              <div className="flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.6413 11.0913L5.38348 11.0913C6.73574 9.47136 7.30519 8.0979 7.42059 7.61377L6.23895 6.81885C5.9538 7.64266 5.45443 8.42447 4.5788 9.63916C3.96586 10.4894 3.17036 11.3524 2.59247 11.8228L2.35907 11.9995C2.93905 12.3994 3.87817 13.388 4.5788 14.3599C5.45458 15.5748 5.95382 16.3572 6.23895 17.1812L7.42059 16.3853C7.30519 15.9011 6.73574 14.5277 5.38348 12.9077L21.6413 12.9077L21.6413 11.0913Z" fill="#6E4EFF"/>
                </svg>
              </div>
              <span className="text-[#2a2a2f] text-base font-semibold">
                Back to login
              </span>
            </button>

            {/* Contact Sales Content */}
            <div className="w-full flex flex-col gap-10 items-start justify-start">
              {/* Header */}
              <div className="w-full flex flex-col gap-6 items-center justify-start">
                <div className="w-full flex flex-col gap-2 items-center justify-start text-center">
                  <h2 className="text-[#2a2a2f] text-2xl font-semibold leading-[1.4]">
                    Contact tab sales
                  </h2>
                  <p className="text-[#a1a1a1] text-base leading-[1.4]">
                    Get in touch with our sales team
                  </p>
                </div>

                {/* Form Fields */}
                <div className="w-full flex flex-col gap-2 items-start justify-start">
                  {/* Full Name */}
                  <div className="w-full h-12 border border-[#e9e9e9] flex items-center px-4">
                    <input
                      type="text"
                      value={salesForm.fullName}
                      onChange={(e) => setSalesForm({...salesForm, fullName: e.target.value})}
                      className="w-full text-[#2a2a2f] text-sm bg-transparent outline-none"
                      placeholder="Full name*"
                    />
                  </div>

                  {/* Email */}
                  <div className="w-full h-12 border border-[#e9e9e9] flex items-center px-4">
                    <input
                      type="email"
                      value={salesForm.email}
                      onChange={(e) => setSalesForm({...salesForm, email: e.target.value})}
                      className="w-full text-[#2a2a2f] text-sm bg-transparent outline-none"
                      placeholder="Email"
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="w-full h-12 border border-[#e9e9e9] flex items-center px-4">
                    <input
                      type="tel"
                      value={salesForm.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setSalesForm({...salesForm, phoneNumber: value});
                      }}
                      className="w-full text-[#2a2a2f] text-sm bg-transparent outline-none"
                      placeholder="Phone number*"
                    />
                  </div>

                  {/* Requirement/Report an issue */}
                  <div className="w-full h-[99px] border border-[#e9e9e9] flex items-start p-4">
                    <textarea
                      value={salesForm.requirement}
                      onChange={(e) => setSalesForm({...salesForm, requirement: e.target.value})}
                      className="w-full h-full text-[#2a2a2f] text-sm bg-transparent outline-none resize-none"
                      placeholder="Requirement/Report an issue"
                    />
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={() => {
                  // Handle form submission
                  // Reset form
                  setSalesForm({
                    fullName: '',
                    email: '',
                    phoneNumber: '',
                    requirement: ''
                  });
                  // Show success message or redirect
                }}
                className="w-full h-12 bg-[#a1a1a1] hover:bg-[#8a8a8a] flex items-center justify-center gap-2 transition-colors"
                data-name="Button" data-node-id="303:6103"
              >
                <span className="text-white text-base font-semibold">
                  Send
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.35962 11.0913L18.6165 11.0913C17.2643 9.47141 16.6957 8.09788 16.5803 7.61377L17.761 6.81885C18.0461 7.64267 18.5455 8.42449 19.4211 9.63916C20.034 10.4894 20.8296 11.3523 21.4075 11.8228L21.6409 11.9995C21.0609 12.3994 20.1217 13.388 19.4211 14.3599C18.5454 15.5747 18.0461 16.3572 17.761 17.1812L16.5803 16.3853C16.6957 15.9011 17.2643 14.5276 18.6165 12.9077L2.35962 12.9077L2.35962 11.0913Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Help Modal Content
          <div className="w-full flex flex-col gap-12 items-start justify-start">
            {/* Back Button - Left Aligned */}
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full h-12 flex items-center justify-start gap-2 hover:bg-gray-50 transition-colors"
              data-name="Button" data-node-id="293:5985"
            >
              <div className="flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.6413 11.0913L5.38348 11.0913C6.73574 9.47136 7.30519 8.0979 7.42059 7.61377L6.23895 6.81885C5.9538 7.64266 5.45443 8.42447 4.5788 9.63916C3.96586 10.4894 3.17036 11.3524 2.59247 11.8228L2.35907 11.9995C2.93905 12.3994 3.87817 13.388 4.5788 14.3599C5.45458 15.5748 5.95382 16.3572 6.23895 17.1812L7.42059 16.3853C7.30519 15.9011 6.73574 14.5277 5.38348 12.9077L21.6413 12.9077L21.6413 11.0913Z" fill="#6E4EFF"/>
                </svg>
              </div>
              <span className="text-[#2a2a2f] text-base font-semibold">
                Back to login
              </span>
            </button>

            {/* Help Content */}
            <div className="w-full flex flex-col gap-10 items-start justify-start">
              {/* Header */}
              <div className="w-full flex flex-col gap-6 items-center justify-start">
                <div className="w-full flex flex-col gap-2 items-center justify-start text-center">
                  <h2 className="text-[#2a2a2f] text-base font-bold leading-[1.4]">
                    Need help?
                  </h2>
                  <p className="text-[#a1a1a1] text-sm leading-[1.4]">
                    Find answers to common questions
                  </p>
                </div>

                {/* FAQ Items with Accordion */}
                <div className="w-full flex flex-col gap-2 items-start justify-start">
                  {faqItems.map((item, index) => (
                    <div
                      key={index}
                      className="w-full border border-[#e9e9e9] overflow-hidden transition-all duration-300 ease-in-out"
                    >
                      {/* Question Header */}
                      <button
                        onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                        className="w-full h-12 flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-[#a1a1a1] text-sm text-left">{item.question}</span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a1a1a1"
                strokeWidth="2"
                          className={`transition-transform duration-300 ease-in-out ${
                            expandedItem === index ? 'rotate-180' : 'rotate-0'
                          }`}
                        >
                          <path d="M6 9l6 6 6-6"/>
            </svg>
          </button>

                      {/* Answer Content */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          expandedItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                        style={{
                          transformOrigin: 'top',
                          transform: expandedItem === index ? 'scaleY(1)' : 'scaleY(0)'
                        }}
                      >
                        <div className="px-4 pb-4 pt-2">
                          <p className="text-[#2a2a2f] text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Support Section */}
              <div className="w-full bg-[#fbfbfb] border border-[#e9e9e9] p-4">
                <div className="w-full flex flex-col gap-2 items-center justify-start">
                  <h3 className="text-[#2a2a2f] text-base font-bold leading-[1.4] text-center">
                    Still need help?
                  </h3>
                  <button
                    onClick={() => setShowContactSupport(true)}
                    className="flex items-center gap-2 text-[#a1a1a1] hover:text-[#6e4eff] transition-colors"
                  >
                    <span className="text-sm">Contact support</span>
                    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.85876 11.0913L19.1166 11.0913C17.7643 9.47135 17.1949 8.0979 17.0795 7.61377L18.2611 6.81885C18.5463 7.64266 19.0456 8.42448 19.9213 9.63916C20.5342 10.4894 21.3297 11.3524 21.9076 11.8228L22.141 11.9995C21.561 12.3994 20.6219 13.388 19.9213 14.3599C19.0455 15.5748 18.5462 16.3572 18.2611 17.1812L17.0795 16.3853C17.1949 15.9011 17.7643 14.5277 19.1166 12.9077L2.85876 12.9077L2.85876 11.0913Z" fill="#2A2A2F"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Right Buttons - Only show when not in help modal or contact sales */}
      {!showHelpModal && !showContactSales && (
        <div className="absolute top-[8.9%] right-[4.4%] flex gap-3" data-name="Frame 1171279609" data-node-id="800:30478">
        <button
          onClick={() => setShowHelpModal(true)}
          className="bg-white h-9 px-3 border border-[#e9e9e9] flex items-center gap-2 hover:bg-gray-50 transition-colors"
          data-name="Button" data-node-id="800:30479"
        >
          <div className="w-5 h-5 flex items-center justify-center" data-name="formkit:help" data-node-id="800:30482">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 18.75C5.175 18.75 1.25 14.825 1.25 10C1.25 5.175 5.175 1.25 10 1.25C14.825 1.25 18.75 5.175 18.75 10C18.75 14.825 14.825 18.75 10 18.75ZM10 2.5C5.8625 2.5 2.5 5.8625 2.5 10C2.5 14.1375 5.8625 17.5 10 17.5C14.1375 17.5 17.5 14.1375 17.5 10C17.5 5.8625 14.1375 2.5 10 2.5Z" fill="#6E4EFF"/>
              <path d="M10 5.625C8.6125 5.625 7.5 6.7375 7.5 8.125H8.75C8.75 7.4375 9.3125 6.875 10 6.875C10.6875 6.875 11.25 7.4375 11.25 8.125C11.25 9.375 9.375 9.225 9.375 11.25H10.625C10.625 9.85 12.5 9.6875 12.5 8.125C12.5 6.7375 11.3875 5.625 10 5.625Z" fill="#6E4EFF"/>
              <path d="M10.0001 14.525C10.4281 14.525 10.7751 14.178 10.7751 13.75C10.7751 13.322 10.4281 12.975 10.0001 12.975C9.57208 12.975 9.2251 13.322 9.2251 13.75C9.2251 14.178 9.57208 14.525 10.0001 14.525Z" fill="#6E4EFF"/>
              <path d="M8.125 8.75C8.47018 8.75 8.75 8.47018 8.75 8.125C8.75 7.77982 8.47018 7.5 8.125 7.5C7.77982 7.5 7.5 7.77982 7.5 8.125C7.5 8.47018 7.77982 8.75 8.125 8.75Z" fill="#6E4EFF"/>
              <path d="M10 11.875C10.3452 11.875 10.625 11.5952 10.625 11.25C10.625 10.9048 10.3452 10.625 10 10.625C9.65482 10.625 9.375 10.9048 9.375 11.25C9.375 11.5952 9.65482 11.875 10 11.875Z" fill="#6E4EFF"/>
            </svg>
          </div>
          <span className="text-[#6e4eff] text-xs font-medium">
            Need Help?
          </span>
        </button>
        <button
          onClick={() => setShowContactSales(true)}
          className="bg-white h-9 px-3 border border-[#e9e9e9] flex items-center gap-2 hover:bg-gray-50 transition-colors"
          data-name="Button" data-node-id="800:30493"
        >
          <div className="w-4 h-4 flex items-center justify-center" data-name="svg-icon → SVG" data-node-id="800:30494">
            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M13.4062 1.76562H1.59375C1.50673 1.76562 1.42327 1.8002 1.36173 1.86173C1.3002 1.92327 1.26562 2.00673 1.26562 2.09375V13.9062C1.26562 13.9933 1.3002 14.0767 1.36173 14.1383C1.42327 14.1998 1.50673 14.2344 1.59375 14.2344H13.4062C13.4933 14.2344 13.5767 14.1998 13.6383 14.1383C13.6998 14.0767 13.7344 13.9933 13.7344 13.9062V2.09375C13.7344 2.00673 13.6998 1.92327 13.6383 1.86173C13.5767 1.8002 13.4933 1.76562 13.4062 1.76562ZM1.59375 0.78125C1.24565 0.78125 0.911814 0.919531 0.665672 1.16567C0.419531 1.41181 0.28125 1.74565 0.28125 2.09375V13.9062C0.28125 14.2543 0.419531 14.5882 0.665672 14.8343C0.911814 15.0805 1.24565 15.2188 1.59375 15.2188H13.4062C13.7543 15.2188 14.0882 15.0805 14.3343 14.8343C14.5805 14.5882 14.7188 14.2543 14.7188 13.9062V2.09375C14.7188 1.74565 14.5805 1.41181 14.3343 1.16567C14.0882 0.919531 13.7543 0.78125 13.4062 0.78125H1.59375ZM7.5 10.1328C7.63054 10.1328 7.75573 10.1847 7.84803 10.277C7.94033 10.3693 7.99219 10.4945 7.99219 10.625V12.5938C7.99219 12.7243 7.94033 12.8495 7.84803 12.9418C7.75573 13.0341 7.63054 13.0859 7.5 13.0859C7.36946 13.0859 7.24427 13.0341 7.15197 12.9418C7.05967 12.8495 7.00781 12.7243 7.00781 12.5938V10.625C7.00781 10.4945 7.05967 10.3693 7.15197 10.277C7.24427 10.1847 7.36946 10.1328 7.5 10.1328ZM4.71094 11.9375C4.71094 11.807 4.65908 11.6818 4.56678 11.5895C4.47448 11.4972 4.34929 11.4453 4.21875 11.4453C4.08821 11.4453 3.96302 11.4972 3.87072 11.5895C3.77842 11.6818 3.72656 11.807 3.72656 11.9375V12.5938C3.72656 12.7243 3.77842 12.8495 3.87072 12.9418C3.96302 13.0341 4.08821 13.0859 4.21875 13.0859C4.34929 13.0859 4.47448 13.0341 4.56678 12.9418C4.65908 12.8495 4.71094 12.7243 4.71094 12.5938V11.9375ZM10.7812 11.4453C10.9118 11.4453 11.037 11.4972 11.1293 11.5895C11.2216 11.6818 11.2734 11.807 11.2734 11.9375V12.5938C11.2734 12.7243 11.2216 12.8495 11.1293 12.9418C11.037 13.0341 10.9118 13.0859 10.7812 13.0859C10.6507 13.0859 10.5255 13.0341 10.4332 12.9418C10.3409 12.8495 10.2891 12.7243 10.2891 12.5938V11.9375C10.2891 11.807 10.3409 11.6818 10.4332 11.5895C10.5255 11.4972 10.6507 11.4453 10.7812 11.4453ZM2.88656 7.98031C2.83821 8.02537 2.79942 8.07971 2.77252 8.14008C2.74562 8.20046 2.73115 8.26563 2.72999 8.33172C2.72882 8.39781 2.74098 8.46345 2.76573 8.52474C2.79049 8.58602 2.82733 8.64169 2.87407 8.68843C2.92081 8.73517 2.97648 8.77201 3.03776 8.79677C3.09905 8.82152 3.16469 8.83368 3.23078 8.83251C3.29687 8.83135 3.36204 8.81688 3.42242 8.78998C3.48279 8.76308 3.53713 8.7243 3.58219 8.67594L5.53125 6.72688L7.15219 8.34781C7.24447 8.43998 7.36957 8.49175 7.5 8.49175C7.63043 8.49175 7.75553 8.43998 7.84781 8.34781L12.1134 4.08219C12.1618 4.03713 12.2006 3.98279 12.2275 3.92242C12.2544 3.86204 12.2688 3.79687 12.27 3.73078C12.2712 3.66469 12.259 3.59905 12.2343 3.53776C12.2095 3.47648 12.1727 3.42081 12.1259 3.37407C12.0792 3.32733 12.0235 3.29049 11.9622 3.26573C11.9009 3.24098 11.8353 3.22882 11.7692 3.22999C11.7031 3.23115 11.638 3.24562 11.5776 3.27252C11.5172 3.29942 11.4629 3.33821 11.4178 3.38656L7.5 7.30437L5.87906 5.68344C5.78678 5.59127 5.66168 5.5395 5.53125 5.5395C5.40082 5.5395 5.27572 5.59127 5.18344 5.68344L2.88656 7.98031Z" fill="#6E4EFF"/>
            </svg>
          </div>
          <span className="text-[#6e4eff] text-xs font-medium">
            Contact tab sales
          </span>
        </button>
      </div>
      )}

      {/* Left Side - Carousel Section with Animation */}
      <div className="absolute left-[3.4%] top-[6.3%] w-[46.9%] h-[87%] bg-[#f6f6f6] border border-black flex flex-col items-center justify-center overflow-hidden" data-name="Frame 1171279608" data-node-id="340:6578">
        <div className="w-[61.4%] h-[54.6%] flex flex-col items-center justify-center relative" data-name="Frame 1171279594" data-node-id="340:6579">
          {/* Carousel Content with Animation */}
          <div className="relative w-full h-full">
            {carouselSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="text-center text-[#2a2a2f] mb-8" data-name="Frame 1171279594" data-node-id="340:6590">
                  <div className="text-2xl font-semibold leading-tight mb-4 transition-all duration-300" data-node-id="340:6591">
                    {slide.title}
                  </div>
                  <div className="text-base font-normal leading-relaxed max-w-[80%] mx-auto transition-all duration-300" data-node-id="340:6592">
                    {slide.description}
                  </div>
                </div>
                <div className="w-64 h-56 flex items-center justify-center transition-all duration-300" data-name="caitiao问卷101caitiao20230608-01" data-node-id="340:6594">
                  <Image
                    src={slide.image}
                    alt={`${slide.title} Illustration`}
                    width={256}
                    height={224}
                    className="max-w-full max-h-full object-contain"
                    priority={currentSlide === index}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elegant Pagination Dots */}
        <div className="flex gap-2 mt-6" data-name="Container" data-node-id="340:6584">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className="relative group transition-all duration-300 ease-out"
              data-name={`Slide ${index + 1}`}
            >
              {/* Dot with elegant design */}
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[#6e4eff] scale-125'
                  : 'bg-[#d1d5db] hover:bg-[#9ca3af] '
              }`}>
                {/* Subtle glow for active dot */}
                {index === currentSlide && (
                  <div className="absolute inset-0 rounded-full bg-[#6e4eff] opacity-30 blur-sm"></div>
                )}
              </div>

              {/* Minimal tooltip */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {carouselSlides[index].title}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Privacy Section - Only show when not in help modal or contact sales */}
      {!showHelpModal && !showContactSales && (
        <div className="absolute bottom-[10.6%] right-[200px] w-[25.3%] text-center" data-name="Frame 1171279610" data-node-id="801:30694">
          <div className="text-[#2a2a2f] text-sm font-semibold mb-2" data-node-id="801:30695">
            🔒 Your data stays private. Always.
          </div>
          <div className="text-[#a1a1a1] text-xs font-normal leading-relaxed" data-node-id="801:30696">
            At Tab, we never share your personal information. Your data is encrypted and secure.{' '}
            <a href="#" className="underline hover:no-underline text-[#a1a1a1]">
              Read our Privacy Policy
            </a>
          </div>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen bg-[#f6f6f6]">
        {/* Mobile Header */}
        <div className="flex justify-end items-center p-4">
          {/* Mobile Top Buttons */}
          {!showHelpModal && !showContactSales && (
            <div className="flex gap-2">
              <button
                onClick={() => setShowHelpModal(true)}
                className="bg-white h-8 px-2 border border-[#e9e9e9] flex items-center gap-1 hover:bg-gray-50 transition-colors text-xs"
              >
                <div className="w-3 h-3 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18.75C5.175 18.75 1.25 14.825 1.25 10C1.25 5.175 5.175 1.25 10 1.25C14.825 1.25 18.75 5.175 18.75 10C18.75 14.825 14.825 18.75 10 18.75ZM10 2.5C5.8625 2.5 2.5 5.8625 2.5 10C2.5 14.1375 5.8625 17.5 10 17.5C14.1375 17.5 17.5 14.1375 17.5 10C17.5 5.8625 14.1375 2.5 10 2.5Z" fill="#6E4EFF"/>
                    <path d="M10 5.625C8.6125 5.625 7.5 6.7375 7.5 8.125H8.75C8.75 7.4375 9.3125 6.875 10 6.875C10.6875 6.875 11.25 7.4375 11.25 8.125C11.25 9.375 9.375 9.225 9.375 11.25H10.625C10.625 9.85 12.5 9.6875 12.5 8.125C12.5 6.7375 11.3875 5.625 10 5.625Z" fill="#6E4EFF"/>
                    <path d="M10.0001 14.525C10.4281 14.525 10.7751 14.178 10.7751 13.75C10.7751 13.322 10.4281 12.975 10.0001 12.975C9.57208 12.975 9.2251 13.322 9.2251 13.75C9.2251 14.178 9.57208 14.525 10.0001 14.525Z" fill="#6E4EFF"/>
                  </svg>
                </div>
                <span className="text-[#6e4eff] text-xs font-medium">Help</span>
              </button>
              <button
                onClick={() => setShowContactSales(true)}
                className="bg-white h-8 px-2 border border-[#e9e9e9] flex items-center gap-1 hover:bg-gray-50 transition-colors text-xs"
              >
                <div className="w-3 h-3 flex items-center justify-center">
                  <svg width="12" height="13" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.4062 1.76562H1.59375C1.50673 1.76562 1.42327 1.8002 1.36173 1.86173C1.3002 1.92327 1.26562 2.00673 1.26562 2.09375V13.9062C1.26562 13.9933 1.3002 14.0767 1.36173 14.1383C1.42327 14.1998 1.50673 14.2344 1.59375 14.2344H13.4062C13.4933 14.2344 13.5767 14.1998 13.6383 14.1383C13.6998 14.0767 13.7344 13.9933 13.7344 13.9062V2.09375C13.7344 2.00673 13.6998 1.92327 13.6383 1.86173C13.5767 1.8002 13.4933 1.76562 13.4062 1.76562ZM1.59375 0.78125C1.24565 0.78125 0.911814 0.919531 0.665672 1.16567C0.419531 1.41181 0.28125 1.74565 0.28125 2.09375V13.9062C0.28125 14.2543 0.419531 14.5882 0.665672 14.8343C0.911814 15.0805 1.24565 15.2188 1.59375 15.2188H13.4062C13.7543 15.2188 14.0882 15.0805 14.3343 14.8343C14.5805 14.5882 14.7188 14.2543 14.7188 13.9062V2.09375C14.7188 1.74565 14.5805 1.41181 14.3343 1.16567C14.0882 0.919531 13.7543 0.78125 13.4062 0.78125H1.59375ZM7.5 10.1328C7.63054 10.1328 7.75573 10.1847 7.84803 10.277C7.94033 10.3693 7.99219 10.4945 7.99219 10.625V12.5938C7.99219 12.7243 7.94033 12.8495 7.84803 12.9418C7.75573 13.0341 7.63054 13.0859 7.5 13.0859C7.36946 13.0859 7.24427 13.0341 7.15197 12.9418C7.05967 12.8495 7.00781 12.7243 7.00781 12.5938V10.625C7.00781 10.4945 7.05967 10.3693 7.15197 10.277C7.24427 10.1847 7.36946 10.1328 7.5 10.1328ZM4.71094 11.9375C4.71094 11.807 4.65908 11.6818 4.56678 11.5895C4.47448 11.4972 4.34929 11.4453 4.21875 11.4453C4.08821 11.4453 3.96302 11.4972 3.87072 11.5895C3.77842 11.6818 3.72656 11.807 3.72656 11.9375V12.5938C3.72656 12.7243 3.77842 12.8495 3.87072 12.9418C3.96302 13.0341 4.08821 13.0859 4.21875 13.0859C4.34929 13.0859 4.47448 13.0341 4.56678 12.9418C4.65908 12.8495 4.71094 12.7243 4.71094 12.5938V11.9375ZM10.7812 11.4453C10.9118 11.4453 11.037 11.4972 11.1293 11.5895C11.2216 11.6818 11.2734 11.807 11.2734 11.9375V12.5938C11.2734 12.7243 11.2216 12.8495 11.1293 12.9418C11.037 13.0341 10.9118 13.0859 10.7812 13.0859C10.6507 13.0859 10.5255 13.0341 10.4332 12.9418C10.3409 12.8495 10.2891 12.7243 10.2891 12.5938V11.9375C10.2891 11.807 10.3409 11.6818 10.4332 11.5895C10.5255 11.4972 10.6507 11.4453 10.7812 11.4453ZM2.88656 7.98031C2.83821 8.02537 2.79942 8.07971 2.77252 8.14008C2.74562 8.20046 2.73115 8.26563 2.72999 8.33172C2.72882 8.39781 2.74098 8.46345 2.76573 8.52474C2.79049 8.58602 2.82733 8.64169 2.87407 8.68843C2.92081 8.73517 2.97648 8.77201 3.03776 8.79677C3.09905 8.82152 3.16469 8.83368 3.23078 8.83251C3.29687 8.83135 3.36204 8.81688 3.42242 8.78998C3.48279 8.76308 3.53713 8.7243 3.58219 8.67594L5.53125 6.72688L7.15219 8.34781C7.24447 8.43998 7.36957 8.49175 7.5 8.49175C7.63043 8.49175 7.75553 8.43998 7.84781 8.34781L12.1134 4.08219C12.1618 4.03713 12.2006 3.98279 12.2275 3.92242C12.2544 3.86204 12.2688 3.79687 12.27 3.73078C12.2712 3.66469 12.259 3.59905 12.2343 3.53776C12.2095 3.47648 12.1727 3.42081 12.1259 3.37407C12.0792 3.32733 12.0235 3.29049 11.9622 3.26573C11.9009 3.24098 11.8353 3.22882 11.7692 3.22999C11.7031 3.23115 11.638 3.24562 11.5776 3.27252C11.5172 3.29942 11.4629 3.33821 11.4178 3.38656L7.5 7.30437L5.87906 5.68344C5.78678 5.59127 5.66168 5.5395 5.53125 5.5395C5.40082 5.5395 5.27572 5.59127 5.18344 5.68344L2.88656 7.98031Z" fill="#6E4EFF"/>
                  </svg>
                </div>
                <span className="text-[#6e4eff] text-xs font-medium">Sales</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Login Form */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {!showHelpModal && !showContactSupport && !showContactSales ? (
              // Mobile Login Form
              <>
                {/* Logo */}
                <div className="w-16 h-16 mb-6">
                  <svg width="64" height="64" viewBox="0 0 524 524" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="262" cy="262" r="262" fill="url(#paint0_linear_7845_13502_mobile)"/>
                    <path d="M111.82 321.5C105.992 322.593 100.268 323.061 94.6484 322.905C89.0808 322.801 84.0855 321.838 79.6626 320.017C75.2918 318.144 71.9616 315.152 69.6721 311.041C67.5907 307.191 66.498 303.288 66.394 299.333C66.2899 295.327 66.2378 290.8 66.2378 285.753V213.79H87.4677V284.504C87.4677 287.782 87.4938 290.748 87.5458 293.402C87.6499 296.003 88.1962 298.085 89.1849 299.646C91.0581 302.612 94.05 304.225 98.1607 304.485C102.271 304.745 106.824 304.537 111.82 303.86V321.5ZM51.8765 253.596V237.205H111.82V253.596H51.8765ZM127.482 321.5V237.205H146.215V257.81L144.185 255.157C145.278 252.243 146.735 249.589 148.556 247.195C150.377 244.802 152.615 242.825 155.269 241.263C157.298 240.015 159.509 239.052 161.903 238.376C164.296 237.647 166.768 237.205 169.318 237.049C171.867 236.841 174.417 236.893 176.967 237.205V257.03C174.625 256.301 171.893 256.067 168.771 256.327C165.701 256.535 162.918 257.238 160.42 258.435C157.922 259.579 155.815 261.114 154.098 263.04C152.381 264.913 151.08 267.15 150.195 269.752C149.311 272.302 148.868 275.19 148.868 278.416V321.5H127.482ZM190.252 225.497V206.765H211.482V225.497H190.252ZM190.252 321.5V237.205H211.482V321.5H190.252ZM273.127 323.842C264.749 323.842 257.751 321.89 252.131 317.988C246.511 314.085 242.271 308.778 239.409 302.065C236.599 295.353 235.194 287.782 235.194 279.352C235.194 270.923 236.599 263.352 239.409 256.64C242.219 249.927 246.355 244.62 251.819 240.717C257.282 236.815 264.021 234.863 272.034 234.863C280.099 234.863 287.124 236.789 293.108 240.639C299.092 244.49 303.723 249.771 307.001 256.483C310.331 263.144 311.996 270.767 311.996 279.352C311.996 287.782 310.357 295.353 307.079 302.065C303.853 308.778 299.326 314.085 293.498 317.988C287.67 321.89 280.88 323.842 273.127 323.842ZM231.604 321.5V209.106H252.99V263.742H250.336V321.5H231.604ZM269.693 304.953C274.272 304.953 278.018 303.808 280.932 301.519C283.846 299.229 286.005 296.159 287.41 292.309C288.815 288.406 289.518 284.088 289.518 279.352C289.518 274.669 288.789 270.403 287.332 266.552C285.875 262.649 283.612 259.553 280.542 257.264C277.524 254.922 273.647 253.752 268.912 253.752C264.489 253.752 260.899 254.818 258.141 256.952C255.435 259.085 253.458 262.077 252.209 265.928C250.96 269.778 250.336 274.253 250.336 279.352C250.336 284.452 250.96 288.927 252.209 292.777C253.458 296.628 255.487 299.62 258.297 301.753C261.159 303.886 264.958 304.953 269.693 304.953ZM327.61 321.5V206.765H348.84V321.5H327.61ZM379.889 358.965L396.123 314.319L396.435 327.432L359.751 237.205H381.762L406.426 301.051H401.431L425.939 237.205H447.169L399.557 358.965H379.889Z" fill="white"/>
                    <path d="M413.878 334.245H473.684V350.245H407.567L413.878 334.245Z" fill="#AB6AFF"/>
                    <path d="M384.256 334.38H318.051V350.38H378.522L384.256 334.38Z" fill="#AB6AFF"/>
                    <defs>
                    <linearGradient id="paint0_linear_7845_13502_mobile" x1="262" y1="-57.8295" x2="255.517" y2="598.37" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#9747FF"/>
                    <stop offset="0.289538" stopColor="#6420BD"/>
                    <stop offset="0.684985" stopColor="#6420BD"/>
                    <stop offset="0.966994" stopColor="#9747FF"/>
                    </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Description */}
                <div className="text-center text-[#a1a1a1] text-sm font-light leading-relaxed mb-6">
                  Login to understand your customers like never before.
                </div>

                {/* Login Form */}
                <div className="w-full max-w-sm">
                  {!isOtpSent ? (
                    // Phone Number Input
                    <>
                      <div className="mb-4">
                        <div className="text-center text-[#2a2a2f] text-sm font-normal mb-3">
                          Enter the registered phone number
                        </div>
                        <div className={`w-full h-12 border flex items-center justify-center px-4 transition-colors ${
                          error ? 'border-red-500' : 'border-[#e9e9e9] focus-within:border-[#6e4eff]'
                        }`}>
                          <input
                            type="tel"
                            value={formatPhoneNumber(phoneNumber)}
                            onChange={handlePhoneChange}
                            className="w-full text-center text-[#2a2a2f] text-lg font-bold tracking-widest bg-transparent outline-none placeholder:text-[#dadada]"
                            placeholder="9876543210"
                            maxLength={12}
                          />
                        </div>
                        {error && (
                          <div className="text-red-500 text-xs mt-2 text-center">
                            {error}
                          </div>
                        )}
                      </div>

                      {/* Login Button */}
                      <button
                        onClick={handleSendOTP}
                        disabled={isLoading || !phoneNumber}
                        className="w-full h-12 bg-[#6e4eff] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#5a3fd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            Login
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.35962 11.0913L18.6165 11.0913C17.2643 9.47141 16.6957 8.09788 16.5803 7.61377L17.761 6.81885C18.0461 7.64267 18.5455 8.42449 19.4211 9.63916C20.034 10.4894 20.8296 11.3523 21.4075 11.8228L21.6409 11.9995C21.0609 12.3994 20.1217 13.388 19.4211 14.3599C18.5454 15.5747 18.0461 16.3572 17.761 17.1812L16.5803 16.3853C16.6957 15.9011 17.2643 14.5276 18.6165 12.9077L2.35962 12.9077L2.35962 11.0913Z" fill="white"/>
                            </svg>
                          </>
                        )}
                      </button>
                    </>
                  ) : (
                    // OTP Input
                    <>
                      <div className="mb-6">
                        <div className="text-center text-[#2a2a2f] text-sm font-normal mb-3">
                          Enter the OTP sent to {formatPhoneNumber(phoneNumber)}
                        </div>

                        {/* Individual OTP Input Boxes */}
                        <div className="flex gap-3 justify-center mb-4">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <div
                              key={index}
                              className={`w-12 h-12 border flex items-center justify-center p-3 relative transition-colors ${
                                otpError ? 'border-red-500' :
                                isLoading ? 'border-[#6e4eff]' :
                                'border-[#e9e9e9] focus-within:border-[#6e4eff]'
                              }`}
                              data-name="otp input field"
                            >
                              <input
                                id={`otp-${index}`}
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={otp[index] || ''}
                                onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={handleOtpPaste}
                                disabled={isLoading}
                                className={`w-full h-full text-center text-[#6e4eff] text-xl font-bold tracking-widest bg-transparent outline-none ${
                                  isLoading ? 'opacity-50' : ''
                                }`}
                                maxLength={1}
                                autoComplete="off"
                                autoFocus={index === 0 && isOtpSent && !isOtpVerified}
                              />
                              {isLoading && index === 5 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="animate-spin h-4 w-4 text-[#6e4eff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {otpError && (
                          <div className="text-red-500 text-xs text-center mb-4">
                            {otpError}
                          </div>
                        )}
                      </div>

                      {/* Resend OTP */}
                      <div className="text-center mb-4">
                        {resendTimer > 0 ? (
                          <span className="text-[#a1a1a1] text-sm">
                            Resend OTP in {resendTimer}s
                          </span>
                        ) : (
                          <button
                            onClick={handleResendOTP}
                            disabled={isResendDisabled}
                            className="text-[#6e4eff] text-sm font-medium hover:underline disabled:opacity-50"
                          >
                            Resend OTP
                          </button>
                        )}
                      </div>

                      {/* Back Button */}
                      <button
                        onClick={handleBackToPhone}
                        className="w-full h-10 text-[#6e4eff] font-medium border border-[#6e4eff] hover:bg-[#6e4eff] hover:text-white transition-colors mb-4"
                      >
                        Back to Phone Number
                      </button>
                    </>
                  )}
                </div>

                {/* Privacy Section */}
                <div className="text-center mt-6">
                  <div className="text-[#2a2a2f] text-sm font-semibold mb-2">
                    🔒 Your data stays private. Always.
                  </div>
                  <div className="text-[#a1a1a1] text-xs font-normal leading-relaxed">
                    At Tab, we never share your personal information. Your data is encrypted and secure.{' '}
                    <a href="#" className="underline hover:no-underline text-[#a1a1a1]">
                      Read our Privacy Policy
                    </a>
                  </div>
                </div>
              </>
            ) : showContactSupport ? (
              // Mobile Contact Support
              <div className="w-full max-w-sm">
                <button
                  onClick={() => setShowContactSupport(false)}
                  className="w-full h-12 flex items-center justify-start gap-2 hover:bg-gray-50 transition-colors mb-6"
                >
                  <div className="flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.6413 11.0913L5.38348 11.0913C6.73574 9.47136 7.30519 8.0979 7.42059 7.61377L6.23895 6.81885C5.9538 7.64266 5.45443 8.42447 4.5788 9.63916C3.96586 10.4894 3.17036 11.3524 2.59247 11.8228L2.35907 11.9995C2.93905 12.3994 3.87817 13.388 4.5788 14.3599C5.45458 15.5748 5.95382 16.3572 6.23895 17.1812L7.42059 16.3853C7.30519 15.9011 6.73574 14.5277 5.38348 12.9077L21.6413 12.9077L21.6413 11.0913Z" fill="#6E4EFF"/>
                    </svg>
                  </div>
                  <span className="text-[#2a2a2f] text-base font-semibold">
                    Back to login
                  </span>
                </button>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-[#2a2a2f] mb-4">Contact Support</h2>
                  <p className="text-sm text-[#a1a1a1] mb-6">Get help from our support team</p>

                  <div className="space-y-4">
                    <a href="mailto:support@tabapp.club" className="block w-full h-12 bg-[#6e4eff] text-white font-semibold flex items-center justify-center hover:bg-[#5a3fd9] transition-colors">
                      Email Support
                    </a>
                    <a href="tel:+911234567890" className="block w-full h-12 border border-[#6e4eff] text-[#6e4eff] font-semibold flex items-center justify-center hover:bg-[#6e4eff] hover:text-white transition-colors">
                      Call Support
                    </a>
                  </div>
                </div>
              </div>
            ) : showContactSales ? (
              // Mobile Contact Sales
              <div className="w-full max-w-sm">
                <button
                  onClick={() => setShowContactSales(false)}
                  className="w-full h-12 flex items-center justify-start gap-2 hover:bg-gray-50 transition-colors mb-6"
                >
                  <div className="flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.6413 11.0913L5.38348 11.0913C6.73574 9.47136 7.30519 8.0979 7.42059 7.61377L6.23895 6.81885C5.9538 7.64266 5.45443 8.42447 4.5788 9.63916C3.96586 10.4894 3.17036 11.3524 2.59247 11.8228L2.35907 11.9995C2.93905 12.3994 3.87817 13.388 4.5788 14.3599C5.45458 15.5748 5.95382 16.3572 6.23895 17.1812L7.42059 16.3853C7.30519 15.9011 6.73574 14.5277 5.38348 12.9077L21.6413 12.9077L21.6413 11.0913Z" fill="#6E4EFF"/>
                    </svg>
                  </div>
                  <span className="text-[#2a2a2f] text-base font-semibold">
                    Back to login
                  </span>
                </button>

                 <div className="text-center">
                   <h2 className="text-xl font-bold text-[#2a2a2f] mb-4">Contact Sales</h2>
                   <p className="text-sm text-[#a1a1a1] mb-6">Get in touch with our sales team</p>

                   <form onSubmit={(e) => { e.preventDefault(); }}>
                     <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={salesForm.fullName}
                        onChange={(e) => setSalesForm({...salesForm, fullName: e.target.value})}
                        className="w-full h-12 px-4 border border-[#e9e9e9] text-[#2a2a2f] placeholder:text-[#dadada]"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={salesForm.email}
                        onChange={(e) => setSalesForm({...salesForm, email: e.target.value})}
                        className="w-full h-12 px-4 border border-[#e9e9e9] text-[#2a2a2f] placeholder:text-[#dadada]"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={salesForm.phoneNumber}
                        onChange={(e) => setSalesForm({...salesForm, phoneNumber: e.target.value})}
                        className="w-full h-12 px-4 border border-[#e9e9e9] text-[#2a2a2f] placeholder:text-[#dadada]"
                        required
                      />
                      <textarea
                        placeholder="Tell us about your requirements"
                        value={salesForm.requirement}
                        onChange={(e) => setSalesForm({...salesForm, requirement: e.target.value})}
                        className="w-full h-24 px-4 py-3 border border-[#e9e9e9] text-[#2a2a2f] placeholder:text-[#dadada] resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-12 bg-[#6e4eff] text-white font-semibold hover:bg-[#5a3fd9] transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // Mobile Help Modal
              <div className="w-full max-w-sm">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="w-full h-12 flex items-center justify-start gap-2 hover:bg-gray-50 transition-colors mb-6"
                >
                  <div className="flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.6413 11.0913L5.38348 11.0913C6.73574 9.47136 7.30519 8.0979 7.42059 7.61377L6.23895 6.81885C5.9538 7.64266 5.45443 8.42447 4.5788 9.63916C3.96586 10.4894 3.17036 11.3524 2.59247 11.8228L2.35907 11.9995C2.93905 12.3994 3.87817 13.388 4.5788 14.3599C5.45458 15.5748 5.95382 16.3572 6.23895 17.1812L7.42059 16.3853C7.30519 15.9011 6.73574 14.5277 5.38348 12.9077L21.6413 12.9077L21.6413 11.0913Z" fill="#6E4EFF"/>
                    </svg>
                  </div>
                  <span className="text-[#2a2a2f] text-base font-semibold">
                    Back to login
                  </span>
                </button>

                <div className="text-center">
                  <h2 className="text-lg font-bold text-[#2a2a2f] mb-2">Need help?</h2>
                  <p className="text-sm text-[#a1a1a1] mb-6">Find answers to common questions</p>

                  <div className="space-y-3 mb-6">
                    {faqItems.map((item, index) => (
                      <div key={index} className="border border-[#e9e9e9]">
                        <button
                          onClick={() => setExpandedItem(expandedItem === index ? null : index)}
                          className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-[#2a2a2f]">{item.question}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              expandedItem === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            expandedItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                          style={{
                            transformOrigin: 'top',
                            transform: expandedItem === index ? 'scaleY(1)' : 'scaleY(0)'
                          }}
                        >
                          <div className="p-4 pt-0 text-sm text-[#a1a1a1] leading-relaxed">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <h3 className="text-base font-bold text-[#2a2a2f] mb-2">Still need help?</h3>
                    <button
                      onClick={() => setShowContactSupport(true)}
                      className="w-full h-12 bg-[#6e4eff] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#5a3fd9] transition-colors"
                    >
                      <span className="text-sm">Contact support</span>
                      <svg width="20" height="20" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.85876 11.0913L19.1166 11.0913C17.7643 9.47135 17.1949 8.0979 17.0795 7.61377L18.2611 6.81885C18.5463 7.64266 19.0456 8.42448 19.9213 9.63916C20.5342 10.4894 21.3297 11.3524 21.9076 11.8228L22.141 11.9995C21.561 12.3994 20.6219 13.388 19.9213 14.3599C19.0455 15.5748 18.5462 16.3572 18.2611 17.1812L17.0795 16.3853C17.1949 15.9011 17.7643 14.5277 19.1166 12.9077L2.85876 12.9077L2.85876 11.0913Z" fill="white"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
