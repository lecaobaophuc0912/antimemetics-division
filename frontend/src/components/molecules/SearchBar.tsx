import React from 'react';
import { SearchInput } from '../atoms/SearchInput';
import { FilterChip } from '../atoms/FilterChip';
import { useTodosTranslations, useCommonTranslations } from '../../hooks/useTranslations';

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
    const t = useTodosTranslations();
    const tc = useCommonTranslations();

    const filterOptions = [
        { value: 'all', label: t('allTasks'), count: undefined },
        { value: 'pending', label: tc('pending'), count: undefined },
        { value: 'in-progress', label: tc('processing'), count: undefined },
        { value: 'completed', label: tc('completed'), count: undefined },
    ];

    return (
        <div className={`space-y-4 ${className}`}>
            <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder={t('searchTaskMatrix')}
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