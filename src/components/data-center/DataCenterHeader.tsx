'use client';

interface DataCenterHeaderProps {
  onImportClick: () => void;
  onExportClick: () => void;
}

const DataCenterHeader = ({ onImportClick, onExportClick }: DataCenterHeaderProps) => {
  return (
    <header className="mb-6 sm:mb-8 lg:mb-12 pt-4 lg:pt-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 min-w-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-[24px] font-bold text-[#2a2a2f] leading-tight tracking-[-0.1px]">
            Data centre
          </h1>
          <p className="text-[14px] font-normal text-[#626266] leading-tight">
            Manage and analyze your user data
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
          <button
            onClick={onImportClick}
            className="flex-1 sm:flex-none px-4 h-9 text-[#9747FF] bg-white border border-[#9747FF] rounded font-semibold text-[14px] leading-[1.4] hover:text-white hover:bg-[#9747FF] focus:ring-[#9747FF]/50  transition-all duration-200 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <ImportIcon />
            <span>Import</span>
          </button>
          <button
            onClick={onExportClick}
            className="flex-1 sm:flex-none px-4 h-9 text-[#9747FF] bg-white border border-[#9747FF] rounded font-semibold text-[14px] leading-[1.4] hover:text-white hover:bg-[#9747FF] focus:ring-[#9747FF]/50  transition-all duration-200 ease-in-out flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <ExportIcon />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const ImportIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clipPath="url(#clip0_89_7401)">
  <path fillRule="evenodd" clipRule="evenodd" d="M8.00004 0.666626C8.36823 0.666626 8.66671 0.965103 8.66671 1.33329V6.66663C8.66671 7.03482 8.36823 7.33329 8.00004 7.33329C7.63185 7.33329 7.33337 7.03482 7.33337 6.66663V1.33329C7.33337 0.965103 7.63185 0.666626 8.00004 0.666626Z" fill="currentColor"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M4.86189 3.52864C5.12224 3.26829 5.54435 3.26829 5.8047 3.52864L7.99996 5.7239L10.1952 3.52864C10.4556 3.26829 10.8777 3.26829 11.138 3.52864C11.3984 3.78899 11.3984 4.2111 11.138 4.47145L8.47136 7.13811C8.21101 7.39846 7.7889 7.39846 7.52855 7.13811L4.86189 4.47145C4.60154 4.2111 4.60154 3.78899 4.86189 3.52864Z" fill="currentColor"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M2.66663 9.99996C2.29844 9.99996 1.99996 10.2984 1.99996 10.6666V13.3333C1.99996 13.7015 2.29844 14 2.66663 14H13.3333C13.7015 14 14 13.7015 14 13.3333V10.6666C14 10.2984 13.7015 9.99996 13.3333 9.99996H2.66663ZM0.666626 10.6666C0.666626 9.56206 1.56206 8.66663 2.66663 8.66663H13.3333C14.4379 8.66663 15.3333 9.56206 15.3333 10.6666V13.3333C15.3333 14.4379 14.4379 15.3333 13.3333 15.3333H2.66663C1.56206 15.3333 0.666626 14.4379 0.666626 13.3333V10.6666Z" fill="currentColor"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M3.33337 12C3.33337 11.6319 3.63185 11.3334 4.00004 11.3334H4.00671C4.3749 11.3334 4.67337 11.6319 4.67337 12C4.67337 12.3682 4.3749 12.6667 4.00671 12.6667H4.00004C3.63185 12.6667 3.33337 12.3682 3.33337 12Z" fill="currentColor"/>
  <path fillRule="evenodd" clipRule="evenodd" d="M6 12C6 11.6319 6.29848 11.3334 6.66667 11.3334H6.67333C7.04152 11.3334 7.34 11.6319 7.34 12C7.34 12.3682 7.04152 12.6667 6.67333 12.6667H6.66667C6.29848 12.6667 6 12.3682 6 12Z" fill="currentColor"/>
  </g>
  <defs>
  <clipPath id="clip0_89_7401">
  <rect width="16" height="16" fill="white"/>
  </clipPath>
  </defs>
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_89_7406)">
<path fillRule="evenodd" clipRule="evenodd" d="M7.52855 0.861888C7.7889 0.601539 8.21101 0.601539 8.47136 0.861888L11.138 3.52855C11.3984 3.7889 11.3984 4.21101 11.138 4.47136C10.8777 4.73171 10.4556 4.73171 10.1952 4.47136L7.99996 2.2761L5.8047 4.47136C5.54435 4.73171 5.12224 4.73171 4.86189 4.47136C4.60154 4.21101 4.60154 3.7889 4.86189 3.52855L7.52855 0.861888Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M8.00004 0.666626C8.36823 0.666626 8.66671 0.965103 8.66671 1.33329V6.66663C8.66671 7.03482 8.36823 7.33329 8.00004 7.33329C7.63185 7.33329 7.33337 7.03482 7.33337 6.66663V1.33329C7.33337 0.965103 7.63185 0.666626 8.00004 0.666626Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M2.66663 9.99996C2.29844 9.99996 1.99996 10.2984 1.99996 10.6666V13.3333C1.99996 13.7015 2.29844 14 2.66663 14H13.3333C13.7015 14 14 13.7015 14 13.3333V10.6666C14 10.2984 13.7015 9.99996 13.3333 9.99996H2.66663ZM0.666626 10.6666C0.666626 9.56206 1.56206 8.66663 2.66663 8.66663H13.3333C14.4379 8.66663 15.3333 9.56206 15.3333 10.6666V13.3333C15.3333 14.4379 14.4379 15.3333 13.3333 15.3333H2.66663C1.56206 15.3333 0.666626 14.4379 0.666626 13.3333V10.6666Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M3.33337 12C3.33337 11.6319 3.63185 11.3334 4.00004 11.3334H4.00671C4.3749 11.3334 4.67337 11.6319 4.67337 12C4.67337 12.3682 4.3749 12.6667 4.00671 12.6667H4.00004C3.63185 12.6667 3.33337 12.3682 3.33337 12Z" fill="currentColor"/>
<path fillRule="evenodd" clipRule="evenodd" d="M6 12C6 11.6319 6.29848 11.3334 6.66667 11.3334H6.67333C7.04152 11.3334 7.34 11.6019 7.34 12C7.34 12.3682 7.04152 12.6667 6.67333 12.6667H6.66667C6.29848 12.6667 6 12.3682 6 12Z" fill="currentColor"/>
</g>
<defs>
<clipPath id="clip0_89_7406">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
);

export default DataCenterHeader;
