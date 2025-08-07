import React from 'react';

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  className?: string;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  active,
  onClick,
  count,
  className = '',
}) => {
  const baseClasses = 'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border';
  const activeClasses = active 
    ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
    : 'bg-gray-800/50 text-gray-300 border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50';
  
  const classes = `${baseClasses} ${activeClasses} ${className}`;

  return (
    <button onClick={onClick} className={classes}>
      <span className="flex items-center space-x-2">
        <span>{label}</span>
        {count !== undefined && (
          <span className={`px-2 py-0.5 rounded-full text-xs ${active ? 'bg-blue-700' : 'bg-gray-700'}`}>
            {count}
          </span>
        )}
      </span>
    </button>
  );
}; 