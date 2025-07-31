import type { Conversation, CreateConversationRequest, Message, UpdateConversationProductRequest } from "@/types/chat.types";

const API_BASE_URL = 'https://localhost:7273/api/chat';

export class ChatApiService {
  
  async getConversations(userId: string): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/conversations?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }
    return response.json();
  }

  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }
    return response.json();
  }

  async updateConversationProduct(request: UpdateConversationProductRequest): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${request.conversationId}/product`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId: request.productId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update conversation product context');
    }
    return response.json();
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch conversation');
    }
    return response.json();
  }

  async getConversationMessages(
    conversationId: string,
    userId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<Message[]> {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/messages?userId=${userId}&page=${page}&pageSize=${pageSize}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    return response.json();
  }

  async getUnreadMessageCount(conversationId: string, userId: string): Promise<number> {
    const response = await fetch(
      `${API_BASE_URL}/conversations/${conversationId}/unread-count?userId=${userId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread count');
    }
    return response.json();
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/messages/${messageId}/read?userId=${userId}`,
      {
        method: 'POST',
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }
  }

  async editMessage(messageId: string, content: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to edit message');
    }
    return response.json();
  }

  async deleteMessage(messageId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/messages/${messageId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete message');
    }
  }
} 