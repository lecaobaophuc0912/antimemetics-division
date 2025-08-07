import React from 'react';
import { TodoCard } from '../molecules/TodoCard';
import { EmptyState } from '../molecules/EmptyState';
import { LoadingSpinner } from '../molecules/LoadingSpinner';
import { Todo } from '../../services/api';

interface TodoListProps {
    todos: Todo[];
    loading: boolean;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onCreateClick: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
    todos,
    loading,
    onEdit,
    onDelete,
    onCreateClick,
}) => {
    if (loading) {
        return <LoadingSpinner />;
    }

    if (todos.length === 0) {
        return <EmptyState onCreateClick={onCreateClick} />;
    }

    return (
        <div className="space-y-4">
            {todos.map((todo) => (
                <TodoCard
                    key={todo.id}
                    todo={todo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}; 