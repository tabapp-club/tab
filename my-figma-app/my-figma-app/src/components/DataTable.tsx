'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import React from 'react'; // Added missing import for React.useEffect

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

interface UserData {
  id: string;
  mobile: string;
  categories: string[];
  userType: string;
  visits: number;
  status: string;
  addedOn: string;
}

interface DataTableProps {
  searchTerm?: string;
  data?: UserData[];
}

const DataTable = ({ searchTerm = '', data = [] }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSort = (key: keyof UserData) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  const handleMenuToggle = (index: number) => {
    setOpenMenu(openMenu === index ? null : index);
  };

  const handleAction = (action: string, user: UserData) => {
    console.log(`${action} for user:`, user);
    setOpenMenu(null);
    // Here you can implement the actual action logic
  };

  const filteredData = useMemo(() => {
    return data.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchLower)
    );
  });
  }, [searchTerm, data]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key as keyof UserData];
    const bValue = b[sortConfig.key as keyof UserData];
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  }, [filteredData, sortConfig]);

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) return <SortIcon />;
    return sortConfig.direction === 'asc' ? <SortUpIcon /> : <SortDownIcon />;
  };

  const columns = [
    { key: 'id', label: 'User ID', width: 'w-24 sm:w-32 lg:w-36', flex: 'flex-shrink-0' },
    { key: 'mobile', label: 'Mobile number', width: 'w-32 sm:w-40 lg:w-44', flex: 'flex-shrink-0' },
    { key: 'categories', label: 'Category', width: 'w-24 sm:w-32 lg:w-36', flex: 'flex-grow' },
    { key: 'userType', label: 'User type', width: 'w-20 sm:w-24 lg:w-32', flex: 'flex-shrink-0', centered: true },
    { key: 'visits', label: 'No of visits', width: 'w-30 sm:w-34 lg:w-38', flex: 'flex-shrink-0', centered: true },
    { key: 'status', label: 'Status', width: 'w-20 sm:w-24 lg:w-32', flex: 'flex-shrink-0', centered: true },
    { key: 'addedOn', label: 'Added on', width: 'w-24 sm:w-28 lg:w-32', flex: 'flex-shrink-0' },
    { key: 'actions', label: '', width: 'w-12 sm:w-16 lg:w-20', flex: 'flex-shrink-0', centered: true }
  ];

  return (
    <div className="bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="bg-[#f6f6f6] border-b border-[#e9e9e9] flex min-w-max">
            {columns.map((col) => (
              <div key={col.key} className={`${col.width} ${col.flex || ''} flex items-center gap-1 px-2 sm:px-3 lg:px-4 h-8 sm:h-10 ${col.key !== 'actions' ? 'border-r border-[#e9e9e9]' : ''} ${col.centered ? 'justify-center' : ''}`}>
                {col.key !== 'actions' ? (
                  <button onClick={() => handleSort(col.key as keyof UserData)} className="flex items-center gap-1 text-[#626266] hover:text-[#2a2a2f] transition-colors w-full">
                    <span className="text-xs sm:text-sm font-normal truncate">{col.label}</span>
                    {getSortIcon(col.key)}
                  </button>
                ) : (
                  <span className="text-xs sm:text-sm font-normal text-[#626266]">Actions</span>
                )}
              </div>
            ))}
          </div>

          {/* Table Body */}
          <div>
            {sortedData.length === 0 ? (
              <div className="text-center py-8 text-[#a1a1a1]">No data available.</div>
            ) : (
              sortedData.map((user, index) => (
              <div key={index} onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)} className={`flex border-b border-[#e9e9e9] transition-colors min-w-max ${hoveredRow === index ? 'bg-gray-50' : 'bg-white'}`}>
                {columns.map(col => (
                  <div key={col.key} className={`${col.width} ${col.flex || ''} flex items-center px-2 sm:px-3 lg:px-4 h-[50px] sm:h-[60px] lg:h-[66px] ${col.key !== 'actions' ? 'border-r border-[#e9e9e9]' : ''} ${col.centered ? 'justify-center' : ''}`}>
                    {col.key === 'actions' ? (
                      <div className="relative data-table-actions" ref={menuRef}>
                        <button
                          onClick={() => handleMenuToggle(index)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Open menu"
                        >
                          <KebabMenuIcon />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenu === index && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-[#e9e9e9] rounded-md shadow-lg z-50 min-w-[160px] sm:min-w-[180px] menu-dropdown">
                            <div className="py-1">
                              <button
                                onClick={() => handleAction('view', user)}
                                className="w-full px-3 py-2 text-left text-sm text-[#2a2a2f] hover:bg-gray-50 flex items-center gap-2 menu-item"
                              >
                                <ViewIcon />
                                <span>View Details</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : col.key === 'categories' ? (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 max-w-full">
                        {user.categories.slice(0, 2).map((cat, idx) => (
                          <span key={cat + '-' + idx} className="bg-[#fcfcfc] border border-[#e9e9e9] rounded px-1 sm:px-1.5 py-0.5 sm:py-1 text-xs font-medium whitespace-nowrap">
                            {cat}
                          </span>
                        ))}
                        {user.categories.length > 2 && (
                          <span className="bg-[#f0f0f0] border border-[#d0d0d0] rounded px-1 sm:px-1.5 py-0.5 sm:py-1 text-xs font-medium whitespace-nowrap">
                            +{user.categories.length - 2}
                          </span>
                        )}
                      </div>
                    ) : col.key === 'status' ? (
                      <span className={`px-1 sm:px-1.5 py-0.5 sm:py-1 text-xs font-medium rounded whitespace-nowrap ${user.status === 'Active' ? 'bg-[#eafff1] text-[#04b440] border border-[rgba(23,198,83,0.2)]' : 'bg-[rgba(213,32,32,0.15)] text-[#f04646] border border-[#ffc9c9]'}`}>
                        {user.status}
                      </span>
                    ) : (
                      <span className="text-xs sm:text-sm font-medium text-[#2a2a2f] truncate max-w-full">{user[col.key as keyof UserData]}</span>
                    )}
                  </div>
                ))}
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon components
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortUpIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortDownIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const KebabMenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="4" r="1.5" fill="#626266"/>
    <circle cx="8" cy="8" r="1.5" fill="#626266"/>
    <circle cx="8" cy="12" r="1.5" fill="#626266"/>
  </svg>
);

const ViewIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 3C4.5 3 1.73 5.61 1 8C1.73 10.39 4.5 13 8 13C11.5 13 14.27 10.39 15 8C14.27 5.61 11.5 3 8 3Z" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M11.5 2.5L13.5 4.5L5.5 12.5H3.5V10.5L11.5 2.5Z" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExportIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V12" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 4H14M5.5 4V3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V4M12.5 4V13C12.5 13.5523 12.0523 14 11.5 14H4.5C3.94772 14 3.5 13.5523 3.5 13V4H12.5Z" stroke="#f04646" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default DataTable;
