import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';
import type {
  ChatContextType,
  Conversation,
  ChatMessage,
  TypingIndicator,
  SignalRConnection,
  MessageDeliveryStatus
} from '@/types/chat.type';
import { useAuth } from '@/hooks/useApp';
import { chatApi } from '@/apis/chat';
import { getStoredToken } from '@/utils';
import toast from 'react-hot-toast';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const { isAuthenticated, user } = useAuth();

  // Connection state
  const [hubConnection, setHubConnection] = useState<HubConnection | null>(null);
  const [connection, setConnection] = useState<SignalRConnection>({
    isConnected: false,
    reconnectAttempts: 0,
  });

  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);

  // SignalR connection setup
  const connectSignalR = useCallback(async () => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, skipping SignalR connection');
      return;
    }

    if (hubConnection?.state === HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return;
    }

    try {
      const token = getStoredToken();
      if (!token) {
        throw new Error('No auth token available');
      }

      const newConnection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env['VITE_API_BASE_URL'] || 'http://localhost:5000'}/chathub`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      setupSignalREventHandlers(newConnection);

      await newConnection.start();
      setHubConnection(newConnection);
      const connectionData: SignalRConnection = {
        isConnected: true,
        reconnectAttempts: 0,
      };

      if (newConnection.connectionId) {
        connectionData.connectionId = newConnection.connectionId;
      }

      setConnection(connectionData);

      // Join user to their personal room
      await newConnection.invoke('JoinUserRoom', user.id);

      console.log('SignalR connected successfully');
      toast.success('Chat connected');
    } catch (error) {
      console.error('SignalR connection error:', error);
      setConnection(prev => ({
        ...prev,
        isConnected: false,
        lastError: error instanceof Error ? error.message : 'Connection failed',
        reconnectAttempts: prev.reconnectAttempts + 1,
      }));
      toast.error('Failed to connect to chat');
    }
  }, [isAuthenticated, user]);

  const disconnectSignalR = useCallback(async () => {
    if (hubConnection) {
      try {
        await hubConnection.stop();
        setHubConnection(null);
        setConnection({
          isConnected: false,
          reconnectAttempts: 0,
        });
        console.log('SignalR disconnected');
      } catch (error) {
        console.error('Error disconnecting SignalR:', error);
      }
    }
  }, [hubConnection]);

  // Setup SignalR event handlers
  const setupSignalREventHandlers = (connection: HubConnection) => {
    // Receive new message
    connection.on('ReceiveMessage', (message: ChatMessage) => {
      setMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message].sort((a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

      // Update conversation last message
      setConversations(prev => prev.map(conv =>
        conv.id === message.conversationId
          ? {
            ...conv,
            lastMessage: message,
            lastMessageAt: message.timestamp,
            unreadCount: message.senderId !== user?.id ? conv.unreadCount + 1 : conv.unreadCount
          }
          : conv
      ));

      // Show notification if not in active conversation
      if (!activeConversation || activeConversation.id !== message.conversationId) {
        if (message.senderId !== user?.id) {
          toast(`New message from ${message.senderName}`, {
            icon: '💬',
            duration: 3000,
          });
        }
      }
    });

    // Typing indicators
    connection.on('UserTyping', (indicator: TypingIndicator) => {
      setTypingUsers(prev => {
        if (indicator.userId === user?.id) return prev;

        const filtered = prev.filter(t =>
          !(t.conversationId === indicator.conversationId && t.userId === indicator.userId)
        );

        if (indicator.isTyping) {
          return [...filtered, indicator];
        }
        return filtered;
      });
    });

    // Message delivery status
    connection.on('MessageDelivered', (status: MessageDeliveryStatus) => {
      setMessages(prev => prev.map(msg =>
        msg.id === status.messageId
          ? { ...msg, isRead: status.status === 'read' }
          : msg
      ));
    });

    // User joined/left conversation
    connection.on('UserJoinedConversation', (conversationId: string, userId: string) => {
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    connection.on('UserLeftConversation', (conversationId: string, userId: string) => {
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Connection events
    connection.onreconnecting(() => {
      setConnection(prev => ({ ...prev, isConnected: false }));
      console.log('SignalR reconnecting...');
    }); connection.onreconnected(() => {
      setConnection(prev => {
        const newState: SignalRConnection = {
          ...prev,
          isConnected: true,
          reconnectAttempts: 0
        };
        // Remove lastError property instead of setting to undefined
        delete (newState as any).lastError;
        return newState;
      });
      console.log('SignalR reconnected');
      toast.success('Chat reconnected');
    });

    connection.onclose(() => {
      setConnection(prev => ({ ...prev, isConnected: false }));
      console.log('SignalR connection closed');
    });
  };

  // Chat actions
  const joinConversation = useCallback(async (conversationId: string) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('Not connected to chat');
    }

    try {
      await hubConnection.invoke('JoinConversation', conversationId);
      console.log(`Joined conversation: ${conversationId}`);
    } catch (error) {
      console.error('Error joining conversation:', error);
      toast.error('Failed to join conversation');
      throw error;
    }
  }, [hubConnection]);

  const leaveConversation = useCallback(async (conversationId: string) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
      return;
    }

    try {
      await hubConnection.invoke('LeaveConversation', conversationId);
      console.log(`Left conversation: ${conversationId}`);
    } catch (error) {
      console.error('Error leaving conversation:', error);
    }
  }, [hubConnection]);

  const sendMessage = useCallback(async (
    conversationId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' = 'text'
  ) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('Not connected to chat');
    }

    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const messageData = {
        conversationId,
        content,
        messageType,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
      };

      await hubConnection.invoke('SendMessage', messageData);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }, [hubConnection, user]);

  const editMessage = useCallback(async (messageId: string, newContent: string) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('Not connected to chat');
    }

    try {
      await hubConnection.invoke('EditMessage', messageId, newContent);
    } catch (error) {
      console.error('Error editing message:', error);
      toast.error('Failed to edit message');
      throw error;
    }
  }, [hubConnection]);

  const deleteMessage = useCallback(async (messageId: string) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('Not connected to chat');
    }

    try {
      await hubConnection.invoke('DeleteMessage', messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
      throw error;
    }
  }, [hubConnection]);

  const markAsRead = useCallback(async (conversationId: string, messageIds: string[]) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected) {
      return;
    }

    try {
      await hubConnection.invoke('MarkAsRead', conversationId, messageIds);

      // Update local state
      setMessages(prev => prev.map(msg =>
        messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
      ));

      setConversations(prev => prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [hubConnection]);

  const setTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (!hubConnection || hubConnection.state !== HubConnectionState.Connected || !user) {
      return;
    }

    try {
      hubConnection.invoke('SetTyping', conversationId, isTyping);
      setIsTyping(isTyping);
    } catch (error) {
      console.error('Error setting typing status:', error);
    }
  }, [hubConnection, user]);

  // API actions
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      const response = await chatApi.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadMessages = useCallback(async (conversationId: string, page: number = 1) => {
    try {
      setIsLoading(true);
      const response = await chatApi.getMessages(conversationId, { page, limit: 50 });

      if (page === 1) {
        setMessages(response.data);
      } else {
        setMessages(prev => [...response.data, ...prev]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  }, []); const createConversation = useCallback(async (participantIds: string | string[], productId?: string): Promise<Conversation> => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    try {
      const data: any = {
        participantIds,
        conversationType: productId ? 'buyer_seller' : 'support',
      };

      if (productId) {
        data.productId = productId;
      }

      const response = await chatApi.createConversation(data);

      const newConversation = response.data;
      setConversations(prev => [newConversation, ...prev]);

      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
      throw error;
    }
  }, [isAuthenticated]);

  // Effects
  useEffect(() => {
    if (isAuthenticated && user) {
      connectSignalR();
      loadConversations();
    } else {
      disconnectSignalR();
      setConversations([]);
      setMessages([]);
      setActiveConversation(null);
    }

    return () => {
      disconnectSignalR();
    };
  }, [isAuthenticated, user, connectSignalR, disconnectSignalR, loadConversations]);

  // Auto-connect when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated && !connection.isConnected) {
        connectSignalR();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [isAuthenticated, connection.isConnected, connectSignalR]);
  // Join/leave active conversation
  useEffect(() => {
    if (activeConversation && connection.isConnected) {
      joinConversation(activeConversation.id);
      loadMessages(activeConversation.id);

      return () => {
        leaveConversation(activeConversation.id);
      };
    }
    // Return empty cleanup function if conditions not met
    return () => { };
  }, [activeConversation, connection.isConnected, joinConversation, leaveConversation, loadMessages]);

  const value: ChatContextType = {
    // Connection state
    connection,

    // Conversations
    conversations,
    activeConversation,
    messages,

    // UI state
    isLoading,
    isTyping,
    typingUsers,

    // Actions
    connectSignalR,
    disconnectSignalR,
    joinConversation,
    leaveConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    setTyping,
    loadConversations,
    loadMessages,
    createConversation,
    setActiveConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
