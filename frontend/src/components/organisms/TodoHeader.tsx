import React from 'react';
import { Button } from '../atoms/Button';
import { useTodosTranslations } from '../../hooks/useTranslations';

interface TodoHeaderProps {
    onAddClick: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({ onAddClick }) => {
    const t = useTodosTranslations();

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-4xl font-bold text-green-400 mb-2 neon-glow">{t('neuralTaskMatrix')}</h2>
                    <p className="text-cyan-300 terminal-text">{t('synchronizeQuantumNetwork')}</p>
                </div>
                <Button onClick={onAddClick} variant="primary" className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{t('initializeTask')}</span>
                </Button>
            </div>
        </div>
    );
}; 