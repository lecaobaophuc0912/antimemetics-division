import React from 'react';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
    onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No todos yet</h3>
            <p className="text-gray-500 mb-6">Create your first todo to get started!</p>
            <Button onClick={onCreateClick} variant="primary">
                Create Your First Todo
            </Button>
        </div>
    );
}; 