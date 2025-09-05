"use client";

// Icons used in the header
const PlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4.5V17.5M4.5 11H17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ImportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2V7.25M8 7.25L5.75 5M8 7.25L10.25 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.75 8.75V12.25C2.75 12.6642 3.08579 13 3.5 13H12.5C12.9142 13 13.25 12.6642 13.25 12.25V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.75 11.25H2.5M13.5 11.25H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 11V3.75M8 3.75L5.75 6M8 3.75L10.25 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.75 8.75V12.25C2.75 12.6642 3.08579 13 3.5 13H12.5C12.9142 13 13.25 12.6642 13.25 12.25V8.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M1.75 11.25H2.5M13.5 11.25H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface CohortsHeaderProps {
  onImportClick: () => void;
  onExportClick: () => void;
  onCreateCohort: () => void;
}

export function CohortsHeader({ onImportClick, onExportClick, onCreateCohort }: CohortsHeaderProps) {
  return (
    <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 mb-4">
      {/* Main header with title and buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        {/* Title and supporting text */}
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[20px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
            Cohorts
          </h1>
          <p className="text-[14px] text-[#2A2A2F] font-normal">
            Manage and analyze customer segments with detailed insights
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-3.5">
          {/* Create Cohort Button */}
          {/* <button
            onClick={onCreateCohort}
            className="w-full sm:w-auto h-8 sm:h-8 bg-white border border-[#e9e9e9] rounded-md px-3 sm:px-[13px] py-1 sm:py-px flex items-center justify-center sm:justify-start gap-1 sm:gap-0 hover:bg-gray-50 transition-colors group"
          >
            <span className="text-sm sm:text-[13.5625px] font-medium text-[#2a2a2f] leading-[19.6px] whitespace-nowrap">
              Create Cohort
            </span>
            <div className="w-5 h-5 sm:w-[22px] sm:h-[22px] flex items-center justify-center ml-0 sm:ml-[-4px]">
              <PlusIcon />
            </div>
          </button> */}

          {/* Import/Export buttons */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Import Button */}
            {/* <button
              onClick={onImportClick}
              className="flex-1 sm:flex-none h-8 bg-white border border-[#e9e9e9] rounded px-2 sm:px-2 py-0.5 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <ImportIcon />
              <span className="text-sm sm:text-[14px] font-medium text-[#2a2a2f] leading-[1.4] whitespace-nowrap">
                Import
              </span>
            </button> */}

            {/* Export Button */}
            {/* <button
              onClick={onExportClick}
              className="flex-1 sm:flex-none h-8 bg-white border border-[#e9e9e9] rounded px-2 sm:px-2 py-0.5 flex items-center justify-center gap-1 hover:bg-gray-50 transition-colors"
            >
              <ExportIcon />
              <span className="text-sm sm:text-[14px] font-medium text-[#2a2a2f] leading-[1.4] whitespace-nowrap">
                Export
              </span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
