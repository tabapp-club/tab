'use client';

import { useState, useMemo, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  data?: UserData[];
}

const DataTable = memo(({ data = [] }: DataTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<string | null>(null);

  const handleSort = useCallback((key: keyof UserData) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  }, []);

  const router = useRouter();

  const handleAction = useCallback((action: string, user: UserData) => {
    if (action === 'view') {
      router.push(`/customer/${user.id}`, { scroll: false });
    }
  }, [router]);

  // Sort data only (API handles filtering)
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Only sort data, no filtering (API handles search/filtering)
    if (sortConfig.key) {
      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof UserData];
        const bValue = b[sortConfig.key as keyof UserData];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [data, sortConfig]);

  const getSortIcon = useCallback((columnKey: string) => {
    if (sortConfig.key !== columnKey) return <SortIcon />;
    return sortConfig.direction === 'asc' ? <SortUpIcon /> : <SortDownIcon />;
  }, [sortConfig]);

  const columns = useMemo(() => [
    { key: 'id', label: 'User ID', width: 'w-24 sm:w-32 lg:w-36', flex: 'flex-shrink-0' },
    { key: 'mobile', label: 'Mobile number', width: 'w-32 sm:w-40 lg:w-44', flex: 'flex-shrink-0' },
    { key: 'categories', label: 'Category', width: 'w-24 sm:w-32 lg:w-36', flex: 'flex-grow' },
    { key: 'userType', label: 'User type', width: 'w-20 sm:w-24 lg:w-32', flex: 'flex-shrink-0', centered: true },
    { key: 'visits', label: 'No of visits', width: 'w-30 sm:w-34 lg:w-38', flex: 'flex-shrink-0', centered: true },
    { key: 'status', label: 'Status', width: 'w-20 sm:w-24 lg:w-32', flex: 'flex-shrink-0', centered: true },
    { key: 'addedOn', label: 'Added on', width: 'w-24 sm:w-28 lg:w-32', flex: 'flex-shrink-0' },
    { key: 'actions', label: 'Actions', width: 'w-16 sm:w-20 lg:w-24', flex: 'flex-shrink-0', centered: true }
  ], []);

  return (
    <div className="lg:bg-white overflow-hidden">
      {/* Mobile: Card Layout */}
      <div className="lg:hidden">
        {processedData.length === 0 ? (
          <div className="text-center py-8 text-[#a1a1a1]">No data available.</div>
        ) : (
          <div className="space-y-3 p-4">
            {processedData.map((user, index) => (
              <div
                key={index}
                className="bg-white border border-[#e9e9e9] rounded-lg p-4 hover:bg-[#f9fafb] cursor-pointer transition-colors duration-150"
                onClick={() => handleAction('view', user)}
              >
                {/* Header with User ID and Status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[#2a2a2f] text-sm truncate">User ID: {user.id}</h3>
                    <p className="text-xs text-[#6b7280] mt-1">Mobile: {user.mobile}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                    user.status === 'Active'
                      ? 'bg-[#eafff1] text-[#04b440] border border-[rgba(23,198,83,0.2)]'
                      : 'bg-[rgba(213,32,32,0.15)] text-[#f04646] border border-[#ffc9c9]'
                  }`}>
                    {user.status}
                  </span>
                </div>

                {/* Categories */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1.5 relative">
                    {(expandedCategories === user.id ? user.categories : user.categories.slice(0, 3)).map((cat, idx) => (
                      <span key={cat + '-' + idx} className="bg-[#fcfcfc] border border-[#e9e9e9] rounded px-2 py-1 text-xs font-medium whitespace-nowrap">
                        {cat}
                      </span>
                    ))}
                    {user.categories.length > 3 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCategories(expandedCategories === user.id ? null : user.id);
                        }}
                        className="bg-[#f0f0f0] border border-[#d0d0d0] rounded px-2 py-1 text-xs font-medium whitespace-nowrap hover:bg-[#e0e0e0] transition-colors cursor-pointer"
                        title={`Click to ${expandedCategories === user.id ? 'collapse' : 'expand'} all categories`}
                      >
                        {expandedCategories === user.id ? '−' : '+'}{user.categories.length - 3}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom row with User Type, Visits, and Added On */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#6b7280]">User Type:</span>
                    <span className="ml-1 text-[#2a2a2f] font-medium">{user.userType}</span>
                  </div>
                  <div>
                    <span className="text-[#6b7280]">Visits:</span>
                    <span className="ml-1 text-[#2a2a2f] font-medium">{user.visits}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#6b7280]">Added On:</span>
                    <span className="ml-1 text-[#2a2a2f] font-medium">{user.addedOn}</span>
                  </div>
                </div>

                {/* View button */}
                <div className="mt-3 pt-3 border-t border-[#f3f4f6]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction('view', user);
                    }}
                    className="flex items-center gap-2 text-[#9747FF] hover:text-[#6E4EFF] transition-colors text-sm font-medium"
                  >
                    <ViewIcon />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block overflow-x-auto scrollbar-hide">
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
            {processedData.length === 0 ? (
              <div className="text-center py-8 text-[#a1a1a1]">No data available.</div>
            ) : (
              processedData.map((user, index) => (
              <div key={index} onMouseEnter={() => setHoveredRow(index)} onMouseLeave={() => setHoveredRow(null)} className={`flex border-b border-[#e9e9e9] transition-colors min-w-max ${hoveredRow === index ? 'bg-gray-50' : 'bg-white'}`}>
                {columns.map(col => (
                  <div key={col.key} className={`${col.width} ${col.flex || ''} flex items-center px-2 sm:px-3 lg:px-4 h-[50px] sm:h-[60px] lg:h-[66px] ${col.key !== 'actions' ? 'border-r border-[#e9e9e9]' : ''} ${col.centered ? 'justify-center' : ''}`}>
                    {col.key === 'actions' ? (
                      <button
                        onClick={() => handleAction('view', user)}
                        className="p-1 text-[#9747FF] hover:bg-[#9747FF]/5 rounded transition-colors"
                        aria-label="View details"
                      >
                        <ViewIcon />
                      </button>
                    ) : col.key === 'categories' ? (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 max-w-full relative">
                        {/* Desktop: Show up to 2 categories + count */}
                        <div className="flex flex-wrap gap-1.5">
                          {(expandedCategories === user.id ? user.categories : user.categories.slice(0, 2)).map((cat, idx) => (
                            <span key={cat + '-' + idx} className="bg-[#fcfcfc] border border-[#e9e9e9] rounded px-1.5 py-1 text-xs font-medium whitespace-nowrap">
                              {cat}
                            </span>
                          ))}
                          {user.categories.length > 2 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedCategories(expandedCategories === user.id ? null : user.id);
                              }}
                              className="bg-[#f0f0f0] border border-[#d0d0d0] rounded px-1.5 py-1 text-xs font-medium whitespace-nowrap hover:bg-[#e0e0e0] transition-colors cursor-pointer"
                              title={`Click to ${expandedCategories === user.id ? 'collapse' : 'expand'} all categories`}
                            >
                              {expandedCategories === user.id ? '−' : '+'}{user.categories.length - 2}
                            </button>
                          )}
                        </div>
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
});

DataTable.displayName = 'DataTable';

// Icon components
const SortIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortUpIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SortDownIcon = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L7 3L10 6" stroke="#e0e0e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 8L7 11L10 8" stroke="#2a2a2f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;



const ViewIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 3C4.5 3 1.73 5.61 1 8C1.73 10.39 4.5 13 8 13C11.5 13 14.27 10.39 15 8C14.27 5.61 11.5 3 8 3Z" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="8" r="2" stroke="#626266" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);



export default DataTable;
