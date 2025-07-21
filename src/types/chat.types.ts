export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  messageType: string;
  timestamp: string;
  isRead: boolean;
  isEdited: boolean;
  editedAt?: string;
  replyToMessageId?: string;
  isOptimistic?: boolean; // For optimistic UI updates
}

// SignalR Event Data Types
export interface SignalRMessageData {
  id?: string;
  conversationId?: string;
  senderId?: string;
  senderName?: string;
  senderAvatar?: string;
  content?: string;
  messageType?: string;
  timestamp?: string;
  isRead?: boolean;
}

export interface SignalREditedMessageData {
  id: string;
  content: string;
  isEdited: boolean;
  editedAt: string;
}

export interface SignalRTypingData {
  conversationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isTyping: boolean;
}

export interface SignalRMessageDeliveredData {
  MessageId: string;
  Status: string;
  Timestamp: string;
}

export interface Conversation {
  id: string;
  conversationType: string;
  productId?: string;
  lastMessageAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  productContext?: ProductContext;
}

export interface ConversationParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  joinedAt: string;
  lastReadAt: string;
  isOnline: boolean;
}

export interface ProductContext {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  sellerId: string;
  sellerName: string;
}

export interface CreateMessageDto {
  conversationId: string;
  senderId: string;
  content: string;
  messageType: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  messageType: string;
}

export interface CreateConversationRequest {
  userIds: string[];
  productId?: string;
}

export interface UpdateConversationProductRequest {
  conversationId: string;
  productId: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeenAt: string;
} 