'use client';

import { useMemo, useEffect } from 'react';
import { TemplateCard } from './TemplateCard';
import { TemplateData } from './TemplatesClient';
import Pagination from '../Pagination';

// Mock template data
const templatesMockData: TemplateData[] = [
  {
    id: '1',
    name: 'Professional Invoice Template',
    type: 'invoice',
    category: 'professional',
    status: 'active',
    usage: 45,
    lastUsed: '2 days ago',
    createdDate: '15 Jul, 2024',
    description: 'Clean and professional invoice template with company branding and detailed line items',
    previewImage: '/api/placeholder/400/200',
    isDefault: true,
    tags: ['professional', 'clean', 'branded']
  },
  {
    id: '2',
    name: 'Modern Receipt Template',
    type: 'receipt',
    category: 'modern',
    status: 'active',
    usage: 32,
    lastUsed: '1 week ago',
    createdDate: '10 Jul, 2024',
    description: 'Contemporary receipt design with modern typography and color scheme',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['modern', 'contemporary', 'colorful']
  },
  {
    id: '3',
    name: 'Minimal Quote Template',
    type: 'quote',
    category: 'minimal',
    status: 'active',
    usage: 28,
    lastUsed: '3 days ago',
    createdDate: '8 Jul, 2024',
    description: 'Minimalist quote template focusing on content with clean white space',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['minimal', 'clean', 'simple']
  },
  {
    id: '4',
    name: 'Creative Estimate Template',
    type: 'estimate',
    category: 'creative',
    status: 'draft',
    usage: 0,
    lastUsed: 'Never',
    createdDate: '20 Jul, 2024',
    description: 'Creative estimate template with unique design elements and visual appeal',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['creative', 'unique', 'visual']
  },
  {
    id: '5',
    name: 'Standard Invoice Template',
    type: 'invoice',
    category: 'professional',
    status: 'active',
    usage: 67,
    lastUsed: 'Yesterday',
    createdDate: '5 Jul, 2024',
    description: 'Standard invoice template suitable for most business types',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['standard', 'versatile', 'business']
  },
  {
    id: '6',
    name: 'Elegant Receipt Template',
    type: 'receipt',
    category: 'professional',
    status: 'active',
    usage: 23,
    lastUsed: '5 days ago',
    createdDate: '12 Jul, 2024',
    description: 'Elegant receipt design with sophisticated typography and layout',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['elegant', 'sophisticated', 'premium']
  },
  {
    id: '7',
    name: 'Bold Quote Template',
    type: 'quote',
    category: 'creative',
    status: 'active',
    usage: 19,
    lastUsed: '1 week ago',
    createdDate: '18 Jul, 2024',
    description: 'Bold and impactful quote template with strong visual elements',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['bold', 'impactful', 'strong']
  },
  {
    id: '8',
    name: 'Simple Estimate Template',
    type: 'estimate',
    category: 'minimal',
    status: 'archived',
    usage: 8,
    lastUsed: '2 weeks ago',
    createdDate: '25 Jun, 2024',
    description: 'Simple and straightforward estimate template for basic needs',
    previewImage: '/api/placeholder/400/200',
    isDefault: false,
    tags: ['simple', 'basic', 'straightforward']
  }
];

interface TemplatesListProps {
  searchTerm?: string;
  onTemplatesUpdate?: (templates: TemplateData[]) => void;
}

export function TemplatesList({
  searchTerm = '',
  onTemplatesUpdate
}: TemplatesListProps) {
  // Filter templates based on search term
  const filteredTemplates = useMemo(() => {
    return templatesMockData.filter(template => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        template.name.toLowerCase().includes(searchLower) ||
        template.type.toLowerCase().includes(searchLower) ||
        template.category.toLowerCase().includes(searchLower) ||
        template.status.toLowerCase().includes(searchLower) ||
        template.description.toLowerCase().includes(searchLower) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    });
  }, [searchTerm]);

  // Update parent component with filtered templates
  useEffect(() => {
    if (onTemplatesUpdate) {
      onTemplatesUpdate(filteredTemplates);
    }
  }, [filteredTemplates, onTemplatesUpdate]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Templates List */}
      <div className="flex-1 p-2 sm:p-3 lg:p-4 xl:p-6 min-h-0">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 max-w-sm">
              {searchTerm
                ? `No templates match "${searchTerm}". Try adjusting your search or filters.`
                : "You don't have any templates yet. Create your first template to get started."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4 w-full min-w-0">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredTemplates.length > 0 && (
        <div className="border-t border-gray-200 bg-white">
          <Pagination
            currentPage={1}
            itemsPerPage={8}
            totalItems={filteredTemplates.length}
          />
        </div>
      )}
    </div>
  );
}

export type { TemplateData };
