import { GetMessageListRequest, MessageListResponse } from "@/declaration/message";
import axiosInstance from "./axios";

class MessageService {
    async getListMesage(data: GetMessageListRequest): Promise<MessageListResponse> {
        const response = await axiosInstance.post<MessageListResponse>('/messenger/messages', data);
        return response.data;
    }
}
export const messageService = new MessageService();
export default messageService; 