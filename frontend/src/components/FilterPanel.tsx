import React, { FC, useState } from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';

interface FilterPanelProps {
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
  onClear: () => void;
  categories: string[];
  cities: string[];
  districts: string[];
  wards: string[];
  eventTypes: string[];
}

const FilterPanel: FC<FilterPanelProps> = ({ filters, onFiltersChange, onClear, categories, cities, districts, wards, eventTypes }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onClear();
    setIsOpen(false);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== '').length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Category', key: 'category', options: categories },
              { label: 'City', key: 'city', options: cities },
              { label: 'District', key: 'district', options: districts },
              { label: 'Ward', key: 'ward', options: wards },
              { label: 'Event Type', key: 'eventType', options: eventTypes },
              { label: 'Price', key: 'priceRange', options: ['Free', 'Paid', '$0 - $50', '$50 - $100', '$100+'] },
              { label: 'Time', key: 'timeRange', options: ['Today', 'Tomorrow', 'This week', 'This month', 'Next month'] },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <select
                  value={filters[key] || ''}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All {label.toLowerCase()}</option>
                  {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2">
            <button onClick={clearAllFilters} className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Clear All
            </button>
            <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
