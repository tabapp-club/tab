import React from 'react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  className = '',
  disabled = false
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div 
      className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={handleClick}
    >
      {checked ? (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.475 10.825L5.025 8.375C4.875 8.225 4.7 8.15 4.5 8.15C4.3 8.15 4.125 8.225 3.975 8.375C3.825 8.525 3.75 8.70415 3.75 8.9125C3.75 9.12085 3.825 9.3 3.975 9.45L6.95 12.45C7.1 12.6 7.275 12.675 7.475 12.675C7.675 12.675 7.85 12.6 8 12.45L14.175 6.25C14.325 6.1 14.4 5.925 14.4 5.725C14.4 5.525 14.325 5.35 14.175 5.2C14.025 5.05 13.8459 4.975 13.6375 4.975C13.4292 4.975 13.25 5.05 13.1 5.2L7.475 10.825ZM1.5 18C1.1 18 0.75 17.85 0.45 17.55C0.15 17.25 0 16.9 0 16.5V1.5C0 1.1 0.15 0.75 0.45 0.45C0.75 0.15 1.1 0 1.5 0H16.5C16.9 0 17.25 0.15 17.55 0.45C17.85 0.75 18 1.1 18 1.5V16.5C18 16.9 17.85 17.25 17.55 17.55C17.25 17.85 16.9 18 16.5 18H1.5Z" fill="#6E4EFF"/>
        </svg>
      ) : (
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.667 0H1.66699C1.26917 0 0.887636 0.158035 0.606332 0.43934C0.325027 0.720644 0.166992 1.10218 0.166992 1.5V16.5C0.166992 16.8978 0.325027 17.2794 0.606332 17.5607C0.887636 17.842 1.26917 18 1.66699 18H16.667C17.0648 18 17.4463 17.842 17.7277 17.5607C18.009 17.2794 18.167 16.8978 18.167 16.5V1.5C18.167 1.10218 18.009 0.720644 17.7277 0.43934C17.4463 0.158035 17.0648 0 16.667 0ZM1.66699 16.5V1.5H16.667V16.5H1.66699Z" fill="#A1A1A1"/>
        </svg>
      )}
    </div>
  );
};

export default CustomCheckbox;
