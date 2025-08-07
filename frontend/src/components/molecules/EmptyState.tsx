import React from 'react';
import Image from 'next/image';
import { Button } from '../atoms/Button';

interface EmptyStateProps {
    onCreateClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => {
    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 glass border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 neon-glow overflow-hidden">
                <Image
                    src="/antimemetics-division-logo.png"
                    alt="Antimemetics Division Logo"
                    width={48}
                    height={48}
                    className="object-contain filter brightness-110 contrast-125"
                />
            </div>
            <h3 className="text-xl font-semibold text-green-400 mb-2 neon-glow">NEURAL TASK MATRIX EMPTY</h3>
            <p className="text-cyan-300 mb-6 terminal-text">Initialize your first neural task to begin consciousness synchronization!</p>
            <Button onClick={onCreateClick} variant="primary">
                INITIALIZE FIRST TASK
            </Button>
        </div>
    );
}; 