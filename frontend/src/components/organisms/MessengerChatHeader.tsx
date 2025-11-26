import React from 'react';
import { Button } from '../atoms/Button';
import { useTodosTranslations } from '../../hooks/useTranslations';
import { Avatar } from '../atoms';
import { ChatBasicInfo } from './MessengerBubble';

interface MessengerChatHeaderProps {
    basicInfo: ChatBasicInfo;
}

export const MessengerChatHeader: React.FC<MessengerChatHeaderProps> = ({
    basicInfo,
}) => {
    const t = useTodosTranslations();

    return (
        <div className="p-4 h-[72px]">
            <div className="flex justify-between items-center">
                <div className="flex justify-start items-center gap-4">
                    <Avatar
                        src={basicInfo.avatar}
                        alt="avatar"
                        size="lg"
                        className="border border-green-500/40"
                        defaultText={basicInfo.name}
                    />
                    <div className="gap-2">
                        <span className="font-bold text-cyan-300 terminal-text text-sm">{basicInfo.name}</span>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"> </div>
                            <span className="text-italic text-cyan-300 terminal-text text-sm">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 