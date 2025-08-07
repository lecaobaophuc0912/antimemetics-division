import React from 'react';
import { SearchBar } from '../molecules/SearchBar';
import { SearchResults } from '../molecules/SearchResults';
import type { Todo } from '@/declaration';

interface TodoSearchProps {
    todos: Todo[];
    filteredTodos: Todo[];
    searchValue: string;
    onSearchChange: (value: string) => void;
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onClearSearch: () => void;
    onClearFilter: () => void;
    className?: string;
}

export const TodoSearch: React.FC<TodoSearchProps> = ({
    todos,
    filteredTodos,
    searchValue,
    onSearchChange,
    activeFilter,
    onFilterChange,
    onClearSearch,
    onClearFilter,
    className = '',
}) => {
    return (
        <div className={`mb-6 ${className}`}>
            <SearchBar
                searchValue={searchValue}
                onSearchChange={onSearchChange}
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
                showFilters={true}
            />

            <SearchResults
                totalCount={todos.length}
                filteredCount={filteredTodos.length}
                searchValue={searchValue}
                activeFilter={activeFilter}
                onClearSearch={onClearSearch}
                onClearFilter={onClearFilter}
            />
        </div>
    );
}; 