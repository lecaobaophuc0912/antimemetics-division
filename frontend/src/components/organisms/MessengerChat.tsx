import { useEffect, useState } from "react";
import { SeperatorLine } from "../atoms/SeperatorLine";
import { MessengerChatList } from "./ChatMessageList";
import { ChatBasicInfo } from "./MessengerBubble";
import { MessengerChatHeader } from "./MessengerChatHeader";
import { ChatContent } from "@/declaration/message";
import { SendButton } from "../atoms/SendButton";
import { InputMessage } from "../molecules/InputMessage";

export type MessengerChatProps = {
    isOpen: boolean;
    onClose: () => void
    basicInfo: ChatBasicInfo;
}

export const MessengerChat: React.FC<MessengerChatProps> = ({ isOpen, basicInfo, onClose }) => {
    const [listMessage, setListMessage] = useState<ChatContent[]>([]);

    useEffect(() => {
        if (basicInfo) {
            getListChatMessage(basicInfo);
        }
    }, [basicInfo])

    const getListChatMessage = async (info: ChatBasicInfo) => {
        const avatarA = "http://localhost:3001/uploads/avatars/1764060301647-84952353.jpg";
        const avatarB = info.avatar;

        const messages: ChatContent[] = [
            { message: "Hello! How can I help you today?", avatar: avatarA, displayName: 'John', isCurrentUser: false },
            { message: "I'm looking for some information about your service.", avatar: avatarB, displayName: 'Admin', isCurrentUser: true },
            { message: "Sure! What would you like to know?", avatar: avatarA, displayName: 'John', isCurrentUser: false },
            { message: "Do you support international shipping?", avatar: avatarB, displayName: 'Admin', isCurrentUser: true },
            { message: "Yes, we ship to over 50 countries worldwide.", avatar: avatarA, displayName: 'John', isCurrentUser: false },
            {
                message: "Great! How long does shipping usually take? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
                avatar: avatarB,
                displayName: 'Admin',
                isCurrentUser: true
            },
            { message: "It varies, but typically between 5–12 days.", avatar: avatarA, displayName: 'John', isCurrentUser: false },
            { message: "Okay, sounds good. What about refunds?", avatar: avatarB, displayName: 'Admin', isCurrentUser: true },
            { message: "Refunds are processed within 3–5 business days.", avatar: avatarA, displayName: 'John', isCurrentUser: false },
            { message: "Thanks! That answers all my questions.", avatar: avatarB, displayName: 'Admin', isCurrentUser: true }
        ];

        const mockValue: ChatContent[] = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(messages);
            }, 400);
        });

        setListMessage(mockValue);
    };

    const onSend = () => {

    }

    return (
        isOpen ? <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-xl shadow-lg w-2/3 h-[calc(100vh * 0.9)]">
                <MessengerChatHeader basicInfo={basicInfo} />

                <SeperatorLine />
                <MessengerChatList listMessage={listMessage} />
                <InputMessage onSend={onSend} />
            </div>
        </div> : null
    )
}