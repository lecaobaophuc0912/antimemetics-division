import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../atoms/Button';
import { useTodosTranslations, useCommonTranslations } from "../../hooks/useTranslations";
import { MessageTextarea } from '../atoms/MessageTextArea';
import { SendButton } from '../atoms/SendButton';
import { EmojiButton } from '../atoms/EmojiButton';

interface InputMessageProps {
    onSend: () => void;
}

export const InputMessage: React.FC<InputMessageProps> = ({ onSend }) => {
    const t = useTodosTranslations();
    const tc = useCommonTranslations();

    const [message, setMessage] = useState<string>('')

    const onChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const onClickSend = () => {
        console.log('onClickSend');
    }

    const onClickEmoji = () => {
        console.log('onClickEmoji');
    }

    return (
        <div className="flex w-full h-[136px] px-2 py-4">
            <MessageTextarea className='flex-1' value={message} onChange={onChangeMessage} />
            <div className="flex flex-col justify-center">
                <SendButton onClick={onClickSend} />
                <EmojiButton onClick={onClickEmoji} />
            </div>
        </div>
    );
}; 