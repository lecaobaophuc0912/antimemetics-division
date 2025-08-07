import React from 'react';
import { Button } from '../atoms/Button';

interface TodoHeaderProps {
    onAddClick: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ onAddClick }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-4xl font-bold text-white mb-2">My Todos</h2>
                    <p className="text-gray-400">Manage your tasks and stay organized</p>
                </div>
                <Button onClick={onAddClick} variant="primary" className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Todo</span>
                </Button>
            </div>
        </div>
    );
}; 