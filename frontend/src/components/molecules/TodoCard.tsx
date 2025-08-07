import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { IconButton } from '../atoms/IconButton';
import type { Todo } from '@/declaration';

interface TodoCardProps {
    todo: Todo;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const TodoCard: React.FC<TodoCardProps> = ({
    todo,
    onEdit,
    onDelete,
}) => {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'yellow';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'green';
            case 'in-progress': return 'blue';
            case 'pending': return 'gray';
            default: return 'gray';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'CRITICAL';
            case 'medium': return 'STANDARD';
            case 'low': return 'MINIMAL';
            default: return 'UNKNOWN';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'COMPLETED';
            case 'in-progress': return 'PROCESSING';
            case 'pending': return 'PENDING';
            default: return 'UNKNOWN';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <Card>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-bold text-green-400 neon-glow">{todo.title}</h3>
                        <Badge color={getPriorityColor(todo.priority)}>
                            {getPriorityLabel(todo.priority)}
                        </Badge>
                        <Badge color={getStatusColor(todo.status)}>
                            {getStatusLabel(todo.status)}
                        </Badge>
                    </div>
                    <p className="text-cyan-300 mb-4 leading-relaxed terminal-text">{todo.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Synchronization: {formatDate(todo.dueDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Initialized: {formatDate(todo.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                    <IconButton
                        onClick={() => onEdit(todo.id)}
                        variant="edit"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        }
                    />
                    <IconButton
                        onClick={() => onDelete(todo.id)}
                        variant="delete"
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </Card>
    );
}; 