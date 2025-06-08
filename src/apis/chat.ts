import { api } from './client';
import type {
  Conversation,
  Message,
  SendMessageRequest,
  CreateConversationRequest,
  EditMessageRequest,
  DeleteMessageRequest,
  ApiResponse,
  PaginatedResponse
} from '@/types';

export const chatApi = {
  // Conversations
  getConversations: () =>
    api.get<ApiResponse<Conversation[]>>('/conversations'),

  getConversation: (conversationId: string) =>
    api.get<ApiResponse<Conversation>>(`/conversations/${conversationId}`),

  createConversation: (data: CreateConversationRequest) =>
    api.post<ApiResponse<Conversation>>('/conversations', data),

  deleteConversation: (conversationId: string) =>
    api.delete<ApiResponse<void>>(`/conversations/${conversationId}`),

  // Messages
  getMessages: (conversationId: string, page = 1, limit = 50) =>
    api.get<ApiResponse<PaginatedResponse<Message>>>(
      `/conversations/${conversationId}/messages`,
      {
        params: { page, limit }
      }
    ),

  sendMessage: (data: SendMessageRequest) =>
    api.post<ApiResponse<Message>>('/messages', data),

  editMessage: (data: EditMessageRequest) =>
    api.put<ApiResponse<Message>>(`/messages/${data.messageId}`, {
      content: data.content
    }),

  deleteMessage: (data: DeleteMessageRequest) =>
    api.delete<ApiResponse<void>>(`/messages/${data.messageId}`),

  // Mark as read
  markAsRead: (conversationId: string) =>
    api.post<ApiResponse<void>>(`/conversations/${conversationId}/read`),

  // Search messages
  searchMessages: (query: string, conversationId?: string) =>
    api.get<ApiResponse<Message[]>>('/messages/search', {
      params: { query, conversationId }
    })
};
