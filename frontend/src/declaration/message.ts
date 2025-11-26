export interface ChatContent {
    message: string;
    avatar: string;
    displayName: string;
    isCurrentUser: boolean;
}

export interface GetMessageListRequest {
    chatId: string;
}

export interface MessageListResponse {
    data: ChatContent[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    timestamp: string;
    path: string;
}