'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { TemplateData } from './TemplatesClient';

// Template type icons
const InvoiceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2h12v12H2V2zm0 0v12M6 6h4M6 8h4M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2h10v12l-2-2-2 2-2-2-2 2V2zM6 6h4M6 8h4M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const QuoteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2h10v12H3V2zm0 0v12M6 6h4M6 8h4M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4h8M4 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const EstimateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 2h10v12H3V2zm0 0v12M6 6h4M6 8h4M6 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4h8M4 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 8h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 6C10.69 6 11.25 5.44 11.25 4.75C11.25 4.06 10.69 3.5 10 3.5C9.31 3.5 8.75 4.06 8.75 4.75C8.75 5.44 9.31 6 10 6Z" fill="#a1a1a1"/>
    <path d="M10 11.25C10.69 11.25 11.25 10.69 11.25 10C11.25 9.31 10.69 8.75 10 8.75C9.31 8.75 8.75 9.31 8.75 10C8.75 10.69 9.31 11.25 10 11.25Z" fill="#a1a1a1"/>
    <path d="M10 16.5C10.69 16.5 11.25 15.94 11.25 15.25C11.25 14.56 10.69 14 10 14C9.31 14 8.75 14.56 8.75 15.25C8.75 15.94 9.31 16.5 10 16.5Z" fill="#a1a1a1"/>
  </svg>
);

interface TemplateCardProps {
  template: TemplateData;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const handleMoreClick = () => {
    if (moreButtonRef.current) {
      const rect = moreButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 120, // 120px is approximate dropdown width
      });
    }
    setShowDropdown(!showDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showDropdown]);

  const getTypeIcon = (type: TemplateData['type']) => {
    switch (type) {
      case 'invoice':
        return <InvoiceIcon />;
      case 'receipt':
        return <ReceiptIcon />;
      case 'quote':
        return <QuoteIcon />;
      case 'estimate':
        return <EstimateIcon />;
      default:
        return <InvoiceIcon />;
    }
  };

  const getStatusColor = (status: TemplateData['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: TemplateData['category']) => {
    switch (category) {
      case 'professional':
        return 'text-blue-600';
      case 'modern':
        return 'text-purple-600';
      case 'minimal':
        return 'text-gray-600';
      case 'creative':
        return 'text-pink-600';
      default:
        return 'text-gray-600';
    }
  };

  const dropdownMenu = showDropdown && (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        zIndex: 9999,
      }}
      className="bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px]"
    >
      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <ViewIcon />
        Preview
      </button>
      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <EditIcon />
        Edit Template
      </button>
      <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
        <DuplicateIcon />
        Duplicate
      </button>
      {template.isDefault && (
        <button className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          <StarIcon />
          Default Template
        </button>
      )}
      <hr className="my-1" />
      <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
        <DeleteIcon />
        Delete
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 lg:p-6 hover:shadow-md transition-all duration-200 min-w-0 relative w-full">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full min-w-0">
          {/* Preview Image */}
          <div className="flex-shrink-0 w-full lg:w-48 h-32 lg:h-36 bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-gray-500 text-sm font-medium">Template Preview</div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-gray-600">
                    {getTypeIcon(template.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {template.name}
                    </h3>
                    {template.isDefault && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-md border border-blue-200 flex-shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">
                    {template.type} • {template.category}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(template.status)}`}>
                  {template.status}
                </span>
                <button
                  ref={moreButtonRef}
                  onClick={handleMoreClick}
                  className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <MoreIcon />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium">{template.usage}</span>
                  <span>times used</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Last used:</span>
                  <span className="font-medium">{template.lastUsed}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Created:</span>
                  <span className="font-medium">{template.createdDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="px-3 py-2 text-sm font-medium text-[#7856FF] hover:bg-purple-50 rounded-md transition-colors">
                  Use Template
                </button>
                <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render dropdown using portal */}
      {showDropdown && dropdownMenu && createPortal(dropdownMenu, document.body)}
    </>
  );
}

// Action Icons
const ViewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2.5C3.5 2.5 0.5 5.5 0.5 7s3 4.5 6.5 4.5 6.5-2 6.5-4.5-3-4.5-6.5-4.5z" stroke="currentColor" strokeWidth="1"/>
    <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 1.5a2 2 0 012.83 2.83L4.5 13.17l-3.67.33.33-3.67L10 1.5z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const DuplicateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 4.5h5.5v5.5M2.5 6.5h5.5v5.5h-5.5z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1l1.5 4.5H13l-3.5 2.5 1.5 4.5L7 10.5 3.5 12l1.5-4.5L1 5.5h4.5L7 1z" stroke="currentColor" strokeWidth="1" fill="none"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5 3.5L2.5 3.5M5.5 1.5h3M9.5 5.5v6h-5v-6M6.5 7.5v2M7.5 7.5v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);
