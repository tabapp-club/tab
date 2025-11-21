'use client';

import React, { useState, useRef, useEffect, memo } from 'react';

type Variable = {
  id: string;
  variable: string;
  value: string;
  fallback: string;
};

interface VirtualVariableListProps {
  variables: Variable[];
  isMounted: boolean;
  onVariableChange: (index: number, field: 'value' | 'fallback', value: string) => void;
  onRemoveVariable: (id: string) => void;
}

const ITEM_HEIGHT = 80; // Approximate height of each variable item
const BUFFER_SIZE = 2; // Number of items to render outside viewport

export const VirtualVariableList = memo(({ 
  variables, 
  isMounted, 
  onVariableChange, 
  onRemoveVariable 
}: VirtualVariableListProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(400);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Only use virtual scrolling if we have more than 10 variables
  const useVirtualScrolling = variables.length > 10;

  if (!useVirtualScrolling) {
    // Render all items normally for small lists
    return (
      <div className="space-y-3">
        {variables.map((variable, index) => (
          <VariableItem
            key={variable.id}
            variable={variable}
            index={index}
            isMounted={isMounted}
            onVariableChange={onVariableChange}
            onRemoveVariable={onRemoveVariable}
          />
        ))}
      </div>
    );
  }

  // Virtual scrolling logic
  const totalHeight = variables.length * ITEM_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER_SIZE);
  const endIndex = Math.min(
    variables.length - 1,
    Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + BUFFER_SIZE
  );

  const visibleVariables = variables.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      className="max-h-[400px] overflow-y-auto"
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${startIndex * ITEM_HEIGHT}px)` }}>
          <div className="space-y-3">
            {visibleVariables.map((variable, idx) => (
              <VariableItem
                key={variable.id}
                variable={variable}
                index={startIndex + idx}
                isMounted={isMounted}
                onVariableChange={onVariableChange}
                onRemoveVariable={onRemoveVariable}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualVariableList.displayName = 'VirtualVariableList';

// Memoized variable item component
const VariableItem = memo(({ 
  variable, 
  index, 
  isMounted, 
  onVariableChange, 
  onRemoveVariable 
}: {
  variable: Variable;
  index: number;
  isMounted: boolean;
  onVariableChange: (index: number, field: 'value' | 'fallback', value: string) => void;
  onRemoveVariable: (id: string) => void;
}) => {
  return (
    <div className="bg-white rounded-lg p-4 border border-[rgba(151,71,255,0.2)]">
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-[#101828]">Variable</label>
          <input
            type="text"
            value={variable.variable}
            readOnly
            className="w-full px-4 py-2 border border-[rgba(151,71,255,0.2)] rounded text-[14px] font-normal text-[#6a7282] bg-gray-50"
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-[#101828]">Value</label>
          {isMounted ? (
            <select
              value={variable.value || 'name'}
              onChange={(e) => onVariableChange(index, 'value', e.target.value)}
              className="w-full px-4 py-2 border border-[rgba(151,71,255,0.2)] rounded text-[14px] font-normal text-[#101828] bg-white hover:border-[#9747FF]/30 focus:border-[#9747FF] focus:ring-2 focus:ring-[#9747FF]/20 focus:outline-none transition-colors"
            >
              <option value="name">Name</option>
            </select>
          ) : (
            <div className="px-4 py-2 border border-[rgba(151,71,255,0.2)] rounded text-[14px] font-normal bg-white flex items-center text-[#6a7282]">
              Name
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-xs font-medium text-[#101828]">Fallback value</label>
          <input
            type="text"
            value={variable.fallback}
            onChange={(e) => onVariableChange(index, 'fallback', e.target.value)}
            placeholder="Enter fallback value"
            className="w-full px-4 py-2 border border-[rgba(151,71,255,0.2)] rounded text-[14px] font-normal text-[#101828] bg-white placeholder:text-[#6a7282] focus:outline-none focus:ring-2 focus:ring-[#9747FF]/20 focus:border-[#9747FF] transition-all"
          />
        </div>
        <button
          onClick={() => onRemoveVariable(variable.id)}
          className="mt-6 p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Remove variable"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
});

VariableItem.displayName = 'VariableItem';

