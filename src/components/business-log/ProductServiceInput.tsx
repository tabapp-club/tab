'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';

interface ProductServiceInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function ProductServiceInput({
  value,
  onChange,
  placeholder = "Enter product/service name",
  required = false
}: ProductServiceInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load previous products/services from localStorage
  useEffect(() => {
    const loadPreviousProducts = () => {
      try {
        const stored = localStorage.getItem('businessLogEntries');
        if (stored) {
          const entries = JSON.parse(stored);
          const allProducts = entries
            .flatMap((entry: any) => entry.products || [])
            .map((product: any) => product.name)
            .filter((name: string) => name && name.trim() !== '');

          // Remove duplicates and sort by frequency
          const productCounts = allProducts.reduce((acc: Record<string, number>, product: string) => {
            acc[product] = (acc[product] || 0) + 1;
            return acc;
          }, {});

          const uniqueProducts = Object.keys(productCounts)
            .sort((a, b) => productCounts[b] - productCounts[a])
            .slice(0, 20); // Show top 20 most used products

          setSuggestions(uniqueProducts);
        }
      } catch (error) {
        console.error('Error loading previous products:', error);
      }
    };

    loadPreviousProducts();
  }, []);

  // Generate new suggestions based on common business terms
  const generateNewSuggestions = (keyword: string) => {
    const commonProducts = [
      'Consultation', 'Repair', 'Installation', 'Maintenance', 'Design',
      'Development', 'Training', 'Support', 'Cleaning', 'Delivery',
      'Photography', 'Writing', 'Marketing', 'Analysis', 'Testing',
      'Planning', 'Management', 'Audit', 'Review', 'Assessment'
    ];

    const commonServices = [
      'Website Design', 'Mobile App', 'SEO Services', 'Content Writing',
      'Social Media', 'Email Marketing', 'Graphic Design', 'Video Production',
      'Data Analysis', 'Business Consulting', 'Financial Planning',
      'Legal Services', 'HR Services', 'IT Support', 'Cloud Services'
    ];

    const allSuggestions = [...commonProducts, ...commonServices];

    return allSuggestions
      .filter(item =>
        item.toLowerCase().includes(keyword.toLowerCase()) &&
        item.toLowerCase() !== keyword.toLowerCase()
      )
      .slice(0, 8);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 1) {
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    const filteredSuggestions = value.length > 1
      ? generateNewSuggestions(value)
      : suggestions;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const getFilteredSuggestions = () => {
    if (value.length <= 1) {
      return suggestions.slice(0, 8);
    }
    return generateNewSuggestions(value);
  };

  const filteredSuggestions = getFilteredSuggestions();

  return (
    <div className="relative" ref={suggestionsRef}>
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => value.length > 1 && setShowSuggestions(true)}
        placeholder={placeholder}
        required={required}
        className="w-full"
      />

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{suggestion}</span>
                  {index < suggestions.length && (
                    <span className="text-xs text-gray-500">Previous</span>
                  )}
                </div>
              </button>
            ))}

            {value.length > 1 && filteredSuggestions.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Press Enter to add &quot;{value}&quot; to the list
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
