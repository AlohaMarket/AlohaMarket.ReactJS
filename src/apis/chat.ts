import { api } from './client';
import { API_ENDPOINTS } from '@/constants';
import type {
    ApiResponse,
    PaginatedResponse,
} from '@/types';

import type {
    Conversation,
    ChatMessage,
} from '@/types/chat.type';

interface CreateConversationData {
    participantIds: string | string[]; // Support both single participant and group
    productId?: string;
    conversationType?: 'buyer_seller' | 'support';
}

interface SendMessageData {
    conversationId: string;
    content: string;
    messageType: 'text' | 'image' | 'file';
    replyToMessageId?: string;
}

interface GetMessagesParams {
    page?: number;
    limit?: number;
    before?: string; // timestamp for pagination
}

interface GetConversationsParams {
    page?: number;
    limit?: number;
    type?: 'buyer_seller' | 'support';
}

export const chatApi = {
    // Conversations
    getConversations: async (params?: GetConversationsParams): Promise<PaginatedResponse<Conversation>> => {
        return api.get<PaginatedResponse<Conversation>>(API_ENDPOINTS.chat.conversations, { params });
    },

    getConversation: async (conversationId: string): Promise<Conversation> => {
        return api.get<Conversation>(`${API_ENDPOINTS.chat.conversations}/${conversationId}`);
    },

    createConversation: async (data: CreateConversationData): Promise<ApiResponse<Conversation>> => {
        return api.post<ApiResponse<Conversation>>(API_ENDPOINTS.chat.conversations, data);
    },

    deleteConversation: async (conversationId: string): Promise<ApiResponse<null>> => {
        return api.delete<ApiResponse<null>>(`${API_ENDPOINTS.chat.conversations}/${conversationId}`);
    },

    // Messages
    getMessages: async (
        conversationId: string,
        params?: GetMessagesParams
    ): Promise<PaginatedResponse<ChatMessage>> => {
        return api.get<PaginatedResponse<ChatMessage>>(
            `${API_ENDPOINTS.chat.conversations}/${conversationId}/messages`,
            { params }
        );
    },

    sendMessage: async (data: SendMessageData): Promise<ApiResponse<ChatMessage>> => {
        return api.post<ApiResponse<ChatMessage>>(API_ENDPOINTS.chat.messages, data);
    },

    editMessage: async (messageId: string, content: string): Promise<ApiResponse<ChatMessage>> => {
        return api.put<ApiResponse<ChatMessage>>(`${API_ENDPOINTS.chat.messages}/${messageId}`, {
            content,
        });
    },

    deleteMessage: async (messageId: string): Promise<ApiResponse<null>> => {
        return api.delete<ApiResponse<null>>(`${API_ENDPOINTS.chat.messages}/${messageId}`);
    },

    markAsRead: async (conversationId: string, messageIds: string[]): Promise<ApiResponse<null>> => {
        return api.post<ApiResponse<null>>(`${API_ENDPOINTS.chat.conversations}/${conversationId}/read`, {
            messageIds,
        });
    },

    // File upload for images/attachments
    uploadFile: async (file: File, conversationId: string): Promise<ApiResponse<{ url: string; fileName: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('conversationId', conversationId);

        return api.post<ApiResponse<{ url: string; fileName: string }>>(
            API_ENDPOINTS.chat.upload,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
    },

    // Search messages
    searchMessages: async (
        query: string,
        conversationId?: string
    ): Promise<PaginatedResponse<ChatMessage>> => {
        return api.get<PaginatedResponse<ChatMessage>>(API_ENDPOINTS.chat.search, {
            params: { query, conversationId },
        });
    },

    // Get conversation by participant and product (for creating buyer-seller chats)
    getOrCreateConversation: async (
        participantId: string,
        productId?: string
    ): Promise<ApiResponse<Conversation>> => {
        return api.post<ApiResponse<Conversation>>(API_ENDPOINTS.chat.getOrCreate, {
            participantId,
            productId,
        });
    },

    // Block/unblock user
    blockUser: async (userId: string): Promise<ApiResponse<null>> => {
        return api.post<ApiResponse<null>>(`${API_ENDPOINTS.chat.block}/${userId}`);
    },

    unblockUser: async (userId: string): Promise<ApiResponse<null>> => {
        return api.delete<ApiResponse<null>>(`${API_ENDPOINTS.chat.block}/${userId}`);
    },

    // Report conversation/message
    reportMessage: async (messageId: string, reason: string): Promise<ApiResponse<null>> => {
        return api.post<ApiResponse<null>>(`${API_ENDPOINTS.chat.report}/message`, {
            messageId,
            reason,
        });
    },

    reportConversation: async (conversationId: string, reason: string): Promise<ApiResponse<null>> => {
        return api.post<ApiResponse<null>>(`${API_ENDPOINTS.chat.report}/conversation`, {
            conversationId,
            reason,
        });
    },
};
