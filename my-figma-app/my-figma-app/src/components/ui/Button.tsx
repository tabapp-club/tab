"use client";

import React from 'react';
import Link from 'next/link';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  href,
  className = '',
  onClick,
  type = 'button',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  // Base styles with standardized height (36px), corner radius (4px), and font
  const baseStyles = `
    h-9 px-4 rounded font-semibold text-[14px] leading-[1.4] 
    inline-flex items-center justify-center gap-2 
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    whitespace-nowrap relative overflow-hidden
  `;

  // Variant styles with gradient effects
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-[#6E4EFF] to-[#8B6AFF] text-white
      hover:from-[#5D3EE8] hover:to-[#7A59FF] hover:shadow-lg hover:scale-[1.02]
      focus:ring-[#6E4EFF]/50 active:scale-[0.98]
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent 
      before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-gradient-to-r from-gray-100 to-gray-200 text-[#2a2a2f]
      hover:from-gray-200 hover:to-gray-300 hover:shadow-md hover:scale-[1.02]
      focus:ring-gray-300 active:scale-[0.98]
    `,
    outline: `
      text-[#6E4EFF] bg-white border border-[#6E4EFF] rounded-md
      hover:text-white hover:bg-[#6E4EFF] focus:ring-[#6E4EFF]/50 active:scale-[0.98]
      transition-all duration-200 ease-in-out
    `,
    ghost: `
      text-[#6E4EFF] bg-transparent hover:bg-[#6E4EFF]/10
      hover:scale-[1.02] focus:ring-[#6E4EFF]/50 active:scale-[0.98]
    `,
    danger: `
      bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white
      hover:from-[#DC2626] hover:to-[#EF4444] hover:shadow-lg hover:scale-[1.02]
      focus:ring-red-500/50 active:scale-[0.98]
    `,
  };

  // Size modifications (keeping height at 36px but adjusting padding)
  const sizeStyles = {
    sm: 'px-3 text-[13px]',
    md: 'px-4 text-[14px]',
    lg: 'px-6 text-[14px]',
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const buttonContent = (
    <div className="relative z-10 flex items-center justify-center gap-2">
      {loading && <LoadingSpinner />}
      {!loading && icon && iconPosition === 'left' && icon}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      {!loading && icon && iconPosition === 'right' && icon}
    </div>
  );

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...props}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClassName}
      {...props}
    >
      {buttonContent}
    </button>
  );
};

export default Button;
