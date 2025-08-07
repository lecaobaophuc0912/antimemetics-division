import React from 'react';

interface SearchResultsProps {
    totalCount: number;
    filteredCount: number;
    searchValue: string;
    activeFilter: string;
    onClearSearch: () => void;
    onClearFilter: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
    totalCount,
    filteredCount,
    searchValue,
    activeFilter,
    onClearSearch,
    onClearFilter,
}) => {
    const hasSearch = searchValue.trim().length > 0;
    const hasFilter = activeFilter !== 'all';
    const hasActiveFilters = hasSearch || hasFilter;

    if (!hasActiveFilters) return null;

    return (
        <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/50 rounded-xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-300">
                        Showing <span className="font-semibold text-white">{filteredCount}</span> of{' '}
                        <span className="font-semibold text-white">{totalCount}</span> todos
                    </div>

                    {hasSearch && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Search:</span>
                            <span className="px-2 py-1 bg-blue-600/50 text-blue-200 rounded text-sm">
                                "{searchValue}"
                            </span>
                            <button
                                onClick={onClearSearch}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {hasFilter && (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Filter:</span>
                            <span className="px-2 py-1 bg-purple-600/50 text-purple-200 rounded text-sm capitalize">
                                {activeFilter}
                            </span>
                            <button
                                onClick={onClearFilter}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => {
                        onClearSearch();
                        onClearFilter();
                    }}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                    Clear all filters
                </button>
            </div>
        </div>
    );
}; 