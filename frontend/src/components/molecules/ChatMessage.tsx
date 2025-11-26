import React from 'react';
import { Avatar } from '../atoms';
import { ChatContent } from '@/declaration/message';

interface ChatMessageProps {
    content: ChatContent
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content }) => {
    return (
        <div className={`flex m-4 gap-2 ${content.isCurrentUser ? 'flex-row' : 'flex-row-reverse'}`}>
            <Avatar
                src={content.avatar}
                alt="avatar"
                size="sm"
                className="border border-green-500/40"
                defaultText={content.displayName}
            />
            <div
                className={`
                px-4 py-2
                rounded-[24px]
                ${content.isCurrentUser ? 'bg-[#1ebc91]' : 'bg-[#F4A08A]'}
                text-white
                text-base
                leading-relaxed
                whitespace-pre-wrap
                break-words`}
            >
                {content.message}
            </div>
        </div>
    );
}; 