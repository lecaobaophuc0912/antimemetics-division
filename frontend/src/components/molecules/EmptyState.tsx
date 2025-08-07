import React from 'react';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
    onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 glass border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 neon-glow">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2 neon-glow">NEURAL TASK MATRIX EMPTY</h3>
            <p className="text-cyan-300 mb-6 terminal-text">Initialize your first neural task to begin consciousness synchronization!</p>
            <Button onClick={onCreateClick} variant="primary">
                INITIALIZE FIRST TASK
            </Button>
        </div>
    );
}; 