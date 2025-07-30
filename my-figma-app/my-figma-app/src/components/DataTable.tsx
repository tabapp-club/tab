'use client';

import { useState, useMemo } from 'react';
import RowActionsMenu from './RowActionsMenu';
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
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);

  const handleSort = (key: keyof UserData) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const handleActionMenuToggle = (index: number) => {
    setActiveActionMenu(activeActionMenu === index ? null : index);
  };

  const handleViewCustomerDetails = (user: UserData) => {
    console.log('Viewing customer details for:', user);
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

  // Remove useEffect for onDataChange

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
    { key: 'actions', label: '', width: 'w-12 sm:w-16', flex: 'flex-shrink-0' }
  ];

  return (
    <div className="bg-white rounded-lg overflow-hidden">
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
                ) : null}
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
                    {col.key === 'categories' ? (
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
                    ) : col.key === 'actions' ? (
                      <div className="relative">
                        <button onClick={() => handleActionMenuToggle(index)} className="p-1 sm:p-1.5 rounded-md hover:bg-gray-200">
                          <DotsVerticalIcon />
                        </button>
                        {activeActionMenu === index && (
                          <RowActionsMenu
                            isOpen={activeActionMenu === index}
                            onClose={() => setActiveActionMenu(null)}
                            onViewDetails={() => handleViewCustomerDetails(user)}
                            rowData={user}
                          />
                        )}
                      </div>
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

// Icon components - assuming these are defined elsewhere or will be created
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortUpIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortDownIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DotsVerticalIcon = () => <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 4.5C9.62132 4.5 10.125 3.99632 10.125 3.375C10.125 2.75368 9.62132 2.25 9 2.25C8.37868 2.25 7.875 2.75368 7.875 3.375C7.875 3.99632 8.37868 4.5 9 4.5Z" fill="#a1a1a1"/><path d="M9 9C9.62132 9 10.125 8.49632 10.125 7.875C10.125 7.25368 9.62132 6.75 9 6.75C8.37868 6.75 7.875 7.25368 7.875 7.875C7.875 8.49632 8.37868 9 9 9Z" fill="#a1a1a1"/><path d="M9 13.5C9.62132 13.5 10.125 12.9963 10.125 12.375C10.125 11.7537 9.62132 11.25 9 11.25C8.37868 11.25 7.875 11.7537 7.875 12.375C7.875 12.9963 8.37868 13.5 9 13.5Z" fill="#a1a1a1"/></svg>;

export default DataTable;
