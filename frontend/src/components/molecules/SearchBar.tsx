import React from 'react';
import { SearchInput } from '../atoms/SearchInput';
import { FilterChip } from '../atoms/FilterChip';

interface SearchBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    showFilters?: boolean;
    className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    searchValue,
    onSearchChange,
    activeFilter,
    onFilterChange,
    showFilters = true,
    className = '',
}) => {
    const filterOptions = [
        { value: 'all', label: 'All', count: undefined },
        { value: 'pending', label: 'Pending', count: undefined },
        { value: 'in-progress', label: 'In Progress', count: undefined },
        { value: 'completed', label: 'Completed', count: undefined },
    ];

    return (
        <div className={`space-y-4 ${className}`}>
            <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search by title, description, or status..."
                className="w-full"
            />

            {showFilters && (
                <div className="flex flex-wrap gap-2">
                    {filterOptions.map((filter) => (
                        <FilterChip
                            key={filter.value}
                            label={filter.label}
                            active={activeFilter === filter.value}
                            onClick={() => onFilterChange(filter.value)}
                            count={filter.count}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}; 