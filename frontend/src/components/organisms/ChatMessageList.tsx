import { ChatContent } from "@/declaration/message";
import { ChatMessage } from "../molecules/ChatMessage";


export type MessengerChatListProps = {
    listMessage: Array<ChatContent>
}

export const MessengerChatList: React.FC<MessengerChatListProps> = ({ listMessage }) => {
    return (
        <div className="w-full h-[calc((100vh*0.9)-72px-136px)] overflow-y-auto p-2">
            {
                listMessage.map(item => {
                    return <ChatMessage content={item} />
                })

            }
        </div>
    )
}