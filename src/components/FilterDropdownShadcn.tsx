'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

interface FilterSection {
  title: string;
  options: FilterOption[];
}

interface FilterDropdownShadcnProps {
  title: string;
  options: FilterOption[];
  sections?: FilterSection[];
  onSelectionChange: (selectedIds: string[]) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  selectedCount: number;
  singleSelect?: boolean;
}

const FilterDropdownShadcn = ({
  title,
  options,
  sections,
  onSelectionChange,
  selectedCount,
  singleSelect = false
}: FilterDropdownShadcnProps) => {
  const [open, setOpen] = React.useState(false);

  const handleCheckedChange = (optionId: string, checked: boolean) => {
    if (singleSelect) {
      // For single select, if checking a new item, uncheck all others
      if (checked) {
        onSelectionChange([optionId]);
      } else {
        // If unchecking, clear selection
        onSelectionChange([]);
      }
    } else {
      // For multi-select, toggle the specific option
      const currentlySelected = options.filter(opt => opt.checked).map(opt => opt.id);
      
      if (checked) {
        // Add if not already selected
        if (!currentlySelected.includes(optionId)) {
          onSelectionChange([...currentlySelected, optionId]);
        }
      } else {
        // Remove if currently selected
        onSelectionChange(currentlySelected.filter(id => id !== optionId));
      }
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`h-10 px-3 border rounded-md flex items-center justify-between gap-2 w-28 sm:w-32 flex-shrink-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none ${
            selectedCount > 0
              ? 'border-[#9747FF] bg-[#9747FF]/5'
              : 'border-[#e9e9e9]'
          }`}
        >
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-[13.453px] font-normal text-[#2a2a2f] truncate">
              {title}
            </span>
            {selectedCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-[#9747FF] rounded-full flex-shrink-0">
                {selectedCount}
              </span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-white border border-[#e9e9e9] max-h-[300px] overflow-y-auto p-0 shadow-none" 
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between px-4 py-2">
            <DropdownMenuLabel className="text-[12px] text-[#626266] m-0 block">Filter by {title}</DropdownMenuLabel>
            {!singleSelect && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const allSelected = options.every(opt => opt.checked);
                  if (allSelected) {
                    // Clear all
                    onSelectionChange([]);
                  } else {
                    // Select all
                    onSelectionChange(options.map(opt => opt.id));
                  }
                }}
                className="text-[11px] text-[#9747FF] hover:text-[#6B46E5] font-medium px-2 py-1 rounded hover:bg-[#9747FF]/5 transition-colors"
              >
                {options.every(opt => opt.checked) ? 'Clear All' : 'Select All'}
              </button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="bg-gray-100" />
        {sections && sections.length > 0 ? (
          sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {sectionIndex > 0 && <DropdownMenuSeparator className="bg-gray-100 my-1" />}
              {section.title && (
                <div className="px-4 py-2 bg-gray-50">
                  <span className="text-[11px] font-semibold text-[#626266] uppercase tracking-wide">{section.title}</span>
                </div>
              )}
              {section.options.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.id}
                  checked={option.checked}
                  onCheckedChange={(checked) => handleCheckedChange(option.id, checked)}
                  className="text-[14px] text-[#2a2a2f] tracking-[0.15px] pr-4 py-2 cursor-pointer focus:bg-gray-50 focus:outline-none focus:ring-0"
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          ))
        ) : (
          options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={option.checked}
              onCheckedChange={(checked) => handleCheckedChange(option.id, checked)}
              className="text-[14px] text-[#2a2a2f] tracking-[0.15px] pr-4 py-2 cursor-pointer focus:bg-gray-50 focus:outline-none focus:ring-0"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterDropdownShadcn;

