import type { User } from ".";

// Chat types
export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  timestamp: string;
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: string;
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: ChatMessage;
  lastMessageAt: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  conversationType: 'buyer_seller' | 'support';
  productContext?: {
    productId: string;
    productName: string;
    productImage: string;
    productPrice: number;
  };
}

export interface ChatRoom {
  conversationId: string;
  participants: string[];
  isActive: boolean;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface MessageDeliveryStatus {
  messageId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: string;
}

// SignalR Connection types
export interface SignalRConnection {
  isConnected: boolean;
  connectionId?: string;
  reconnectAttempts: number;
  lastError?: string;
}

// Chat Context types
export interface ChatContextType {
  // Connection state
  connection: SignalRConnection;
  
  // Conversations
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  
  // UI state
  isLoading: boolean;
  isTyping: boolean;
  typingUsers: TypingIndicator[];
  
  // Actions
  connectSignalR: () => Promise<void>;
  disconnectSignalR: () => Promise<void>;
  joinConversation: (conversationId: string) => Promise<void>;
  leaveConversation: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, messageType?: 'text' | 'image' | 'file') => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  markAsRead: (conversationId: string, messageIds: string[]) => Promise<void>;  setTyping: (conversationId: string, isTyping: boolean) => void;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string, page?: number) => Promise<void>;
  createConversation: (participantIds: string | string[], productId?: string) => Promise<Conversation>;
  setActiveConversation: (conversation: Conversation | null) => void;
}