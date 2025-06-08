import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '@/apis/chat';
import { chatSignalR } from '@/services/chatSignalR';
import { useApp } from './useApp';
import type {
    Conversation,
    Message,
    UserStatus,
    TypingIndicator,
    SendMessageRequest,
    CreateConversationRequest
} from '@/types';
import toast from 'react-hot-toast';

export function useChat() {
    const { user, isAuthenticated } = useApp();

    // State
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userStatuses, setUserStatuses] = useState<Map<string, UserStatus>>(new Map());
    const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator[]>>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // Refs
    const typingTimeoutRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    // API functions
    const loadConversations = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await chatApi.getConversations();
            if (response.success) {
                setConversations(response.data);
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
            toast.error('Failed to load conversations');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadMessages = useCallback(async (conversationId: string) => {
        try {
            setIsMessagesLoading(true);
            const response = await chatApi.getMessages(conversationId);
            if (response.success) {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error('Failed to load messages:', error);
            toast.error('Failed to load messages');
        } finally {
            setIsMessagesLoading(false);
        }
    }, []);

    const updateConversationLastMessage = useCallback((message: Message) => {
        setConversations(prev => prev.map(conv =>
            conv.id === message.conversationId
                ? {
                    ...conv,
                    lastMessage: message,
                    lastMessageId: message.id,
                    unreadCount: conv.id === currentConversation?.id ? 0 : conv.unreadCount + 1
                }
                : conv
        ));
    }, [currentConversation]);

    const setupSignalRListeners = useCallback(() => {
        // Message events
        chatSignalR.onReceiveMessage((message: Message) => {
            setMessages(prev => [...prev, message]);
            updateConversationLastMessage(message);
        });

        chatSignalR.onMessageEdited((message: Message) => {
            setMessages(prev => prev.map(msg =>
                msg.id === message.id ? message : msg
            ));
        });

        chatSignalR.onMessageDeleted((messageId: string) => {
            setMessages(prev => prev.filter(msg => msg.id !== messageId));
        });

        // Typing events
        chatSignalR.onUserTyping((data: TypingIndicator) => {
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                const conversationTyping = newMap.get(data.conversationId) || [];
                const existingIndex = conversationTyping.findIndex(t => t.userId === data.userId);

                if (existingIndex >= 0) {
                    conversationTyping[existingIndex] = data;
                } else {
                    conversationTyping.push(data);
                }

                newMap.set(data.conversationId, conversationTyping);
                return newMap;
            });

            // Clear typing timeout
            const timeoutKey = `${data.conversationId}-${data.userId}`;
            const existingTimeout = typingTimeoutRef.current.get(timeoutKey);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }

            // Set new timeout to auto-remove typing indicator
            const timeout = setTimeout(() => {
                setTypingUsers(prev => {
                    const newMap = new Map(prev);
                    const conversationTyping = newMap.get(data.conversationId) || [];
                    newMap.set(data.conversationId,
                        conversationTyping.filter(t => t.userId !== data.userId)
                    );
                    return newMap;
                });
                typingTimeoutRef.current.delete(timeoutKey);
            }, 3000);

            typingTimeoutRef.current.set(timeoutKey, timeout);
        });

        chatSignalR.onUserStoppedTyping((data: TypingIndicator) => {
            setTypingUsers(prev => {
                const newMap = new Map(prev);
                const conversationTyping = newMap.get(data.conversationId) || [];
                newMap.set(data.conversationId,
                    conversationTyping.filter(t => t.userId !== data.userId)
                );
                return newMap;
            });

            // Clear timeout
            const timeoutKey = `${data.conversationId}-${data.userId}`;
            const existingTimeout = typingTimeoutRef.current.get(timeoutKey);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
                typingTimeoutRef.current.delete(timeoutKey);
            }
        });

        // User status events
        chatSignalR.onUserOnline((status: UserStatus) => {
            setUserStatuses(prev => new Map(prev.set(status.userId, status)));
        });

        chatSignalR.onUserOffline((status: UserStatus) => {
            setUserStatuses(prev => new Map(prev.set(status.userId, status)));
        });

        // Conversation events
        chatSignalR.onMessageRead((conversationId: string) => {
            if (currentConversation?.id === conversationId) {
                setMessages(prev => prev.map(msg => ({
                    ...msg,
                    isRead: true
                })));
            }
        });
    }, [currentConversation, updateConversationLastMessage]);

    const initializeSignalR = useCallback(async () => {
        try {
            await chatSignalR.start();
            setIsConnected(true);
            setupSignalRListeners();
            await loadConversations();
        } catch (error) {
            console.error('Failed to initialize SignalR:', error);
            toast.error('Failed to connect to chat service');
        }
    }, [setupSignalRListeners, loadConversations]);

    const cleanupSignalR = useCallback(async () => {
        chatSignalR.removeAllListeners();
        await chatSignalR.stop();
        setIsConnected(false);
    }, []);

    // Initialize SignalR connection
    useEffect(() => {
        let isMounted = true;

        (async () => {
            if (isAuthenticated && user && isMounted) {
                await initializeSignalR();
            }
        })();

        return () => {
            isMounted = false;
            cleanupSignalR(); // Do not await here
        };
    }, [isAuthenticated, user, initializeSignalR, cleanupSignalR]);


    const markAsRead = useCallback(async (conversationId: string) => {
        try {
            await chatApi.markAsRead(conversationId);
            await chatSignalR.markAsRead(conversationId);

            setConversations(prev => prev.map(conv =>
                conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
            ));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, []);

    const selectConversation = useCallback(async (conversation: Conversation) => {
        const prevConversationId = currentConversation?.id;
        if (prevConversationId) {
            await chatSignalR.leaveConversation(prevConversationId);
        }

        setCurrentConversation(conversation);
        await loadMessages(conversation.id);
        await chatSignalR.joinConversation(conversation.id);
        await markAsRead(conversation.id);
    }, [currentConversation, loadMessages, markAsRead]);


    const sendMessage = useCallback(async (content: string, receiverId: string) => {
        if (!currentConversation || !user) return null;

        try {
            const messageData: SendMessageRequest = {
                conversationId: currentConversation.id,
                content: content.trim(),
                messageType: 'text',
                receiverId
            };

            const response = await chatApi.sendMessage(messageData);
            if (response.success) {
                // Message will be added via SignalR
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message');
            return null;
        }
    }, [currentConversation, user]);

    const editMessage = useCallback(async (messageId: string, content: string) => {
        try {
            const response = await chatApi.editMessage({ messageId, content });
            if (response.success) {
                // Message will be updated via SignalR
                return response.data;
            }
            return null;
        } catch (error) {
            console.error('Failed to edit message:', error);
            toast.error('Failed to edit message');
            return null;
        }
    }, []);

    const deleteMessage = useCallback(async (messageId: string) => {
        try {
            await chatApi.deleteMessage({ messageId });
            // Message will be removed via SignalR
        } catch (error) {
            console.error('Failed to delete message:', error);
            toast.error('Failed to delete message');
        }
    }, []);

    const createConversation = useCallback(async (participantIds: string[], productId?: string, initialMessage?: string) => {
        try {
            const data: CreateConversationRequest = {
                participantIds,
                ...(productId && { productId }),
                ...(initialMessage && { initialMessage })
            };

            const response = await chatApi.createConversation(data);
            if (response.success) {
                const newConversation = response.data;
                setConversations(prev => [newConversation, ...prev]);
                return newConversation;
            }
            return null;
        } catch (error) {
            console.error('Failed to create conversation:', error);
            toast.error('Failed to create conversation');
            return null;
        }
    }, []);

    const sendTyping = useCallback(async (conversationId: string) => {
        if (chatSignalR.isConnected) {
            await chatSignalR.sendTyping(conversationId);
        }
    }, []);

    const stopTyping = useCallback(async (conversationId: string) => {
        if (chatSignalR.isConnected) {
            await chatSignalR.stopTyping(conversationId);
        }
    }, []);

    // Helper functions
    const getUnreadCount = useCallback(() => {
        return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
    }, [conversations]);

    const getUserStatus = useCallback((userId: string): UserStatus | null => {
        return userStatuses.get(userId) || null;
    }, [userStatuses]);

    const getTypingUsers = useCallback((conversationId: string): TypingIndicator[] => {
        return typingUsers.get(conversationId) || [];
    }, [typingUsers]);

    return {
        // State
        conversations,
        currentConversation,
        messages,
        isLoading,
        isMessagesLoading,
        isConnected,

        // Actions
        selectConversation,
        sendMessage,
        editMessage,
        deleteMessage,
        createConversation,
        markAsRead,
        sendTyping,
        stopTyping,
        loadConversations,

        // Helpers
        getUnreadCount,
        getUserStatus,
        getTypingUsers
    };
}
