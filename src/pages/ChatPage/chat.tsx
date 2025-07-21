import { useState, useEffect, useRef } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  IconArrowLeft,
  IconDotsVertical,
  IconEdit,
  IconMessages,
  IconPaperclip,
  IconPhone,
  IconPhotoPlus,
  IconPlus,
  IconSearch,
  IconSend,
  IconVideo,
} from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { useApp } from '@/hooks/useApp'
import { SignalRService } from '@/services/signalRService'
import { ChatApiService } from '@/services/chatApiService'
import type { Conversation, Message, CreateConversationRequest } from '@/types/chat.types'
import { MessageItem } from './MessageItem'

export default function Chats() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  
  // Chat state
  const [signalRService] = useState(new SignalRService());
  const [chatApiService] = useState(new ChatApiService());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [autoCreateInProgress, setAutoCreateInProgress] = useState<boolean>(false);

  // UI state
  const [search, setSearch] = useState('')
  const [mobileSelectedUser, setMobileSelectedUser] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  type TypingUser = {
    userId: string;
    userName: string;
    userAvatar?: string;
  };
  
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Parse URL parameters for auto-conversation creation
  const urlParams = new URLSearchParams(location.search);
  const targetUserId = urlParams.get('userId');
  const postId = urlParams.get('postId');

  // Filtered data based on the search query
  const filteredChatList = conversations.filter((conversation) => {
    const otherParticipants = conversation.participants.filter(p => p.userId !== currentUserId);
    const participantNames = otherParticipants.map(p => p.userName || p.userId).join(' ');
    return participantNames.toLowerCase().includes(search.trim().toLowerCase());
  });

  // Current conversation messages grouped by date
  const currentMessage = selectedConversation ? 
    messages
      .filter(message => message.conversationId === selectedConversation.id)
      .reduce((acc: Record<string, Message[]>, obj) => {
        const key = dayjs(obj.timestamp).format('D MMM, YYYY')
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(obj)
        return acc
      }, {}) : {};

  // Setup SignalR event listeners function
  const setupEventListeners = () => {
    
    signalRService.onReceiveMessage((message: Message) => {
      console.log('📨 Received message via SignalR:', message);
      
      setMessages(prevMessages => {
        // Check if this message replaces an optimistic message
        const optimisticIndex = prevMessages.findIndex(msg => 
          msg.isOptimistic && 
          msg.content === message.content && 
          msg.senderId === message.senderId &&
          msg.conversationId === message.conversationId &&
          Math.abs(new Date(msg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 10000
        );

        if (optimisticIndex !== -1) {
          // Replace optimistic message with real message
          const newMessages = [...prevMessages];
          newMessages[optimisticIndex] = { ...message, isOptimistic: false };
          return newMessages;
        }

        // Check if message already exists to prevent duplicates
        const messageExists = prevMessages.some(msg => msg.id === message.id);
        if (messageExists) {
          return prevMessages;
        }

        return [...prevMessages, { ...message, isOptimistic: false }];
      });

      // Update conversation's last message time and move to top
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv => 
          conv.id === message.conversationId 
            ? { ...conv, lastMessageAt: message.timestamp }
            : conv
        );
        
        // Sort conversations by lastMessageAt (most recent first)
        return updatedConversations.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      });
    });

    signalRService.onMessageEdited((editedData) => {
      
      setMessages(prevMessages => 
        prevMessages.map(msg => {
          if (msg.id === editedData.id) {
            return {
              ...msg,
              content: editedData.content,
              isEdited: editedData.isEdited,
              editedAt: editedData.editedAt,
            };
          }
          return msg;
        })
      );
    });

    signalRService.onMessageDeleted((messageId: string) => {
      
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
    });

    // Handle conversation updates
    signalRService.onConversationUpdated((updatedConversation: Conversation) => {
      console.log('🔄 Conversation updated via SignalR:', updatedConversation);
      console.log('🔄 Conversation update details:', {
        conversationId: updatedConversation.id,
        hasProductContext: !!updatedConversation.productContext,
        productContext: updatedConversation.productContext,
        currentSelectedConversation: selectedConversation?.id,
        isCurrentConversation: selectedConversation?.id === updatedConversation.id
      });
      
      // Validate the conversation data
      if (!updatedConversation.id || !updatedConversation.participants) {
        if (updatedConversation.id) {
          refreshConversationData(updatedConversation.id);
        }
        return;
      }
      
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv => 
          conv.id === updatedConversation.id ? updatedConversation : conv
        );
        
        // Sort by lastMessageAt
        const sorted = updatedConversations.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
        
        return sorted;
      });

      // Update selected conversation if it's the one being updated
      setSelectedConversation(prevSelected => {
        if (prevSelected?.id === updatedConversation.id) {
          return updatedConversation;
        }
        return prevSelected;
      });
    });

    // Handle new conversation creation
    signalRService.onConversationCreated((newConversation: Conversation) => {
      
      setConversations(prevConversations => {
        // Check if conversation already exists
        const exists = prevConversations.some(conv => conv.id === newConversation.id);
        if (exists) {
          return prevConversations;
        }
        
        // Add new conversation and sort
        const updatedConversations = [newConversation, ...prevConversations];
        return updatedConversations.sort((a, b) => 
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      });
    });

    // Handle product context updates
    signalRService.onProductContextUpdated((data: { conversationId: string, productContext: any }) => {
      
      // Validate the product context data
      if (!data.productContext || !data.productContext.productName) {
        refreshConversationData(data.conversationId);
        return;
      }
      
      setConversations(prevConversations => {
        const updated = prevConversations.map(conv => 
          conv.id === data.conversationId 
            ? { ...conv, productContext: data.productContext }
            : conv
        );
        return updated;
      });

      // Update selected conversation if it's the one being updated
      setSelectedConversation(prevSelected => {
        if (prevSelected?.id === data.conversationId) {
          const updatedSelected = { ...prevSelected, productContext: data.productContext };
          return updatedSelected;
        }
        return prevSelected;
      });
    });

    // Handle participant changes
    signalRService.onParticipantJoined((data: { conversationId: string, participant: any }) => {
      
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.id === data.conversationId) {
            const participantExists = conv.participants.some(p => p.userId === data.participant.userId);
            if (!participantExists) {
              return {
                ...conv,
                participants: [...conv.participants, data.participant]
              };
            }
          }
          return conv;
        })
      );
    });

    signalRService.onParticipantLeft((data: { conversationId: string, userId: string }) => {
      
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === data.conversationId 
            ? {
                ...conv,
                participants: conv.participants.filter(p => p.userId !== data.userId)
              }
            : conv
        )
      );
    });

    signalRService.onUserStatusChanged((userId: string, isOnline: boolean) => {
      
      setConversations(prevConversations => 
        prevConversations.map(conv => ({
          ...conv,
          participants: conv.participants.map(p => 
            p.userId === userId ? { ...p, isOnline } : p
          )
        }))
      );
    });

    signalRService.onConnectionClosed(() => {
      console.log('🔌 SignalR connection closed');
      setIsConnected(false);
    });

    signalRService.onReconnecting(() => {
      console.log('🔄 SignalR reconnecting...');
      setIsConnected(false);
    });

    signalRService.onReconnected(() => {
      console.log('✅ SignalR reconnected');
      setIsConnected(true);
      
      // Rejoin current conversation if any
      if (selectedConversation) {
        signalRService.joinConversation(selectedConversation.id)
          .catch(error => console.error('Failed to rejoin conversation after reconnect:', error));
      }
    });

    // Setup typing listeners
    signalRService.onUserTyping((data) => {
      if (selectedConversation && data.conversationId === selectedConversation.id && data.userId !== currentUserId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            // Add user to typing list if not already there
            const existingUser = prev.find(u => u.userId === data.userId);
            if (!existingUser) {
              const newUser: TypingUser = { 
                userId: data.userId, 
                userName: data.userName
              };
              if (data.userAvatar) {
                newUser.userAvatar = data.userAvatar;
              }
              return [...prev, newUser];
            }
            return prev;
          } else {
            // Remove user from typing list
            return prev.filter(u => u.userId !== data.userId);
          }
        });
      }
    });

    // Handle message delivery status
    signalRService.onMessageDelivered((data) => {
      console.log('✅ Message delivered via SignalR:', data);
      
      if (data.Status === 'read') {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === data.MessageId ? { ...msg, isRead: true } : msg
          )
        );
      }
    });

    // Handle message errors
    signalRService.onMessageError((error: string) => {
      console.error('❌ SignalR message error:', error);
      // You could show a user-friendly error message here
    });
  };

  const handleLogin = async (userId: string) => {
    try {
      setLoading(true);
      
      await signalRService.startConnection(userId);
      
      // Setup event listeners AFTER connection is established
      setupEventListeners();
      
      setCurrentUserId(userId);
      setIsConnected(true);
      
      // Load conversations
      try {
        const userConversations = await chatApiService.getConversations(userId);
        setConversations(userConversations);
        
        // Auto-select first conversation if available
        if (userConversations.length > 0 && !selectedConversation) {
          await handleConversationSelect(userConversations[0]);
        }
      } catch (apiError) {
        console.error('Failed to load conversations:', apiError);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = async (conversation: Conversation) => {
    try {
      setLoading(true);
      setSelectedConversation(conversation);
      setMobileSelectedUser(conversation);
      
      // Clear messages when switching conversations
      setMessages([]);
      
      // Leave previous conversation if any
      if (selectedConversation) {
        await signalRService.leaveConversation(selectedConversation.id);
      }
      
      // Join new conversation
      await signalRService.joinConversation(conversation.id);
      console.log(`✅ Joined conversation ${conversation.id} via SignalR`);
      
      // Load messages for this conversation
      const conversationMessages = await chatApiService.getConversationMessages(
        conversation.id,
        currentUserId
      );
      setMessages(conversationMessages.reverse());
      
      // Force refresh conversation data to ensure we have the latest product context
      await refreshConversationData(conversation.id);
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshConversationData = async (conversationId: string) => {
    try {
      console.log(`🔄 Refreshing conversation data for ${conversationId}`);
      const latestConversation = await chatApiService.getConversation(conversationId);
      
      // Update the conversation in our local state
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? latestConversation : conv
      ));
      
      // Update selected conversation if it's the current one
      setSelectedConversation(prevSelected => 
        prevSelected?.id === conversationId ? latestConversation : prevSelected
      );
      
    } catch (error) {
      console.error('Failed to refresh conversation data:', error);
    }
  };

  // Auto-login effect when user is authenticated via Keycloak
  useEffect(() => {
    if (user && user.id && !isConnected && !currentUserId) {
      handleLogin(user.id);
    }
  }, [user, isConnected, currentUserId]);

  // Auto-create conversation effect when URL parameters are present
  useEffect(() => {
    if (isConnected && currentUserId && targetUserId && !autoCreateInProgress) {
      console.log('Auto-create conversation triggered:', {
        currentUserId,
        targetUserId,
        postId,
        conversationsCount: conversations.length
      });
      autoCreateConversation();
    }
  }, [isConnected, currentUserId, targetUserId, postId, conversations.length]);

  const autoCreateConversation = async () => {
    if (!targetUserId || !currentUserId) {
      return;
    }

    // Prevent user from chatting with themselves
    if (targetUserId === currentUserId) {
      console.log('Cannot create conversation with yourself');
      navigate('/chat', { replace: true });
      return;
    }

    try {
      setAutoCreateInProgress(true);
      setLoading(true);

      // Check if conversation already exists between these users (regardless of product)
      const existingConversation = conversations.find(conv => 
        conv.participants.some(p => p.userId === targetUserId) &&
        conv.participants.some(p => p.userId === currentUserId)
      );

      if (existingConversation) {
        
        // If we have a new productId and it's different from the current one, update it
        if (postId && existingConversation.productId !== postId) {
          try {
            
            // Try SignalR first for real-time updates
            await signalRService.updateProductContext(existingConversation.id, postId);
            
            await handleConversationSelect(existingConversation);
            
          } catch (signalrError) {
            console.warn('SignalR product update failed, falling back to API:', signalrError);
            
            // Fallback to API call
            try {
              const updatedConversation = await chatApiService.updateConversationProduct({
                conversationId: existingConversation.id,
                productId: postId
              });
              
              // Update the conversation in our local state
              setConversations(prev => prev.map(conv => 
                conv.id === existingConversation.id ? updatedConversation : conv
              ));
              
              // Select the updated conversation
              await handleConversationSelect(updatedConversation);
            } catch (updateError) {
              // Still select the existing conversation even if update fails
              await handleConversationSelect(existingConversation);
            }
          }
        } else {
          console.log('No product update needed, selecting existing conversation');
          await handleConversationSelect(existingConversation);
        }
        
        // Clear URL parameters after successful conversation selection
        navigate('/chat', { replace: true });
        return;
      }

      // Create new conversation
      const createRequest: CreateConversationRequest = {
        userIds: [currentUserId, targetUserId]
      };

      if (postId) {
        createRequest.productId = postId;
      }

      const newConversation = await chatApiService.createConversation(createRequest);
      
      setConversations(prev => {
        const exists = prev.some(conv => conv.id === newConversation.id);
        if (!exists) {
          return [newConversation, ...prev];
        }
        return prev;
      });
      
      await handleConversationSelect(newConversation);
      
      navigate('/chat', { replace: true });
      
    } catch (error) {
      navigate('/chat', { replace: true });
    } finally {
      setLoading(false);
      setAutoCreateInProgress(false);
    }
  };

  useEffect(() => {
    if (!selectedConversation || !isConnected) return;

    const syncInterval = setInterval(async () => {
      try {
        const latestConversation = await chatApiService.getConversation(selectedConversation.id);
        
        const currentProductId = selectedConversation.productContext?.productId;
        const latestProductId = latestConversation.productContext?.productId;
        
        if (currentProductId !== latestProductId) {
          console.log('🔄 Detected product context mismatch, syncing...', {
            current: currentProductId,
            latest: latestProductId
          });
          
          // Update conversations list
          setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation.id ? latestConversation : conv
          ));
          
          // Update selected conversation
          setSelectedConversation(latestConversation);
        }
      } catch (error) {
        console.error('Failed to sync conversation data:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(syncInterval);
  }, [selectedConversation?.id, isConnected, selectedConversation?.productContext?.productId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      signalRService.stopConnection();
    };
  }, [signalRService]);

  // Helper functions for conversation display
  const getConversationTitle = (conversation: Conversation): string => {
    const otherParticipants = conversation.participants.filter(
      p => p.userId !== currentUserId
    );
    
    if (otherParticipants.length === 0) {
      return 'Self Chat';
    }
    
    return otherParticipants.map(p => p.userName || p.userId).join(', ');
  };

  const getConversationSubtitle = (conversation: Conversation): string => {
    if (conversation.productContext) {
      return `Discussing: ${conversation.productContext.productName}`;
    }
    return 'General conversation';
  };

  const getLastMessageTime = (conversation: Conversation): string => {
    const date = new Date(conversation.lastMessageAt);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    const messageContent = messageText.trim();
    const tempMessageId = `temp-${Date.now()}-${Math.random()}`;
    
    // Create optimistic message (show immediately)
    const optimisticMessage: Message = {
      id: tempMessageId,
      conversationId: selectedConversation.id,
      senderId: currentUserId,
      senderName: 'You',
      senderAvatar: '',
      content: messageContent,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isEdited: false,
      isOptimistic: true
    };

    try {
      // Show message immediately (optimistic update)
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      
      // Clear input and stop typing
      setMessageText('');
      handleTypingStop();

      // Send message via SignalR
      await signalRService.sendMessage({
        conversationId: selectedConversation.id,
        content: messageContent,
        messageType: 'text'
      });
      
      console.log('✅ Message sent successfully via SignalR');
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Remove optimistic message on error
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== tempMessageId)
      );
      
      // Restore message text
      setMessageText(messageContent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleTypingStart();
  };

  const handleTypingStart = () => {
    if (!isTyping && selectedConversation) {
      setIsTyping(true);
      signalRService.setTyping(selectedConversation.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000);
  };

  const handleTypingStop = () => {
    if (isTyping && selectedConversation) {
      setIsTyping(false);
      signalRService.setTyping(selectedConversation.id, false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Handle message edit
  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      await signalRService.editMessage(messageId, newContent);
      console.log('✅ Message edited successfully via SignalR');
    } catch (error) {
      console.error('Failed to edit message:', error);
      throw error;
    }
  };

  // Handle message delete
  const handleDeleteMessage = async (messageId: string) => {
    try {
      await signalRService.deleteMessage(messageId);
      console.log('✅ Message deleted successfully via SignalR');
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw error;
    }
  };

  // Auto-scroll to bottom function
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Auto-scroll when conversation changes
  useEffect(() => {
    if (selectedConversation?.id) {
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedConversation?.id]);

  // Auto-scroll when new messages are added
  useEffect(() => {
    if (selectedConversation && messages.filter(m => m.conversationId === selectedConversation.id).length > 0 && !loading) {
      setTimeout(scrollToBottom, 50);
    }
  }, [messages.length, loading, selectedConversation?.id]);

  // If not connected, show loading or login prompt
  if (!isConnected) {
    if (user && !loading) {
      return (
        <Layout fixed>
          <Layout.Body className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Connecting to chat service...</p>
            </div>
          </Layout.Body>
        </Layout>
      );
    }
  }

  return (
    <Layout fixed>
      <Layout.Body className='sm:overflow-hidden h-screen'>
        <section className='flex h-full gap-6'>
          {/* Left Side */}
          <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
            <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
              <div className='flex items-center justify-between py-2'>
                <div className='flex gap-2'>
                  <h1 className='text-2xl font-bold'>Inbox</h1>
                  <IconMessages size={20} />
                </div>

                <Button size='icon' variant='ghost' className='rounded-lg'>
                  <IconEdit size={24} className='stroke-muted-foreground' />
                </Button>
              </div>

              <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
                <IconSearch size={15} className='mr-2 stroke-slate-500' />
                <span className='sr-only'>Search</span>
                <input
                  type='text'
                  className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
                  placeholder='Search chat...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
            </div>

            <div className='-mx-3 h-full overflow-auto p-3'>
              {filteredChatList.map((conversation) => {
                const conversationTitle = getConversationTitle(conversation);
                const conversationSubtitle = getConversationSubtitle(conversation);
                const lastMessageTime = getLastMessageTime(conversation);
                
                return (
                  <Fragment key={conversation.id}>
                    <button
                      type='button'
                      className={cn(
                        `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                        selectedConversation?.id === conversation.id && 'sm:bg-muted'
                      )}
                      onClick={() => {
                        handleConversationSelect(conversation)
                      }}
                    >
                      <div className='flex gap-2'>
                        <Avatar>
                          <AvatarImage 
                            src={conversation.participants.find(p => p.userId !== currentUserId)?.userAvatar} 
                            alt={conversationTitle} 
                          />
                          <AvatarFallback>{conversationTitle.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className='col-start-2 row-span-2 font-medium'>
                            {conversationTitle}
                          </span>
                          <span className='col-start-2 row-span-2 row-start-2 line-clamp-2 text-ellipsis text-muted-foreground'>
                            {conversationSubtitle}
                          </span>
                          <div className="text-xs text-muted-foreground mt-1">
                            {lastMessageTime}
                          </div>
                        </div>
                      </div>
                    </button>
                    <Separator className='my-1' />
                  </Fragment>
                )
              })}
              
            </div>
          </div>

          {/* Right Side */}
          <div
            className={cn(
              'absolute inset-0 left-full z-50 flex w-full flex-1 flex-col rounded-md border bg-primary-foreground shadow-sm transition-all duration-200 sm:static sm:z-auto sm:flex',
              mobileSelectedUser && 'left-0'
            )}
          >
            {/* Top Part */}
            <div className='mb-1 flex flex-none justify-between rounded-t-md bg-secondary p-4 shadow-lg'>
              {/* Left */}
              <div className='flex gap-3'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='-ml-2 h-full sm:hidden'
                  onClick={() => setMobileSelectedUser(null)}
                >
                  <IconArrowLeft />
                </Button>
                {selectedConversation && (
                  <div className='flex items-center gap-3 lg:gap-4'>
                    <div className='w-16 h-12 lg:w-20 lg:h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center'>
                      {selectedConversation.productContext?.productImage ? (
                        <img
                          src={selectedConversation.productContext.productImage}
                          alt={selectedConversation.productContext.productName || 'Product'}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <span className='text-xs font-medium text-muted-foreground'>
                          {selectedConversation.productContext?.productName?.charAt(0).toUpperCase() || 'P'}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className='col-start-2 row-span-2 text-sm font-medium lg:text-base'>
                        {selectedConversation.productContext?.productName || 'No Product'}
                      </span>
                      <span className='col-start-2 row-span-2 row-start-2 line-clamp-1 block max-w-32 text-ellipsis text-nowrap text-xs text-muted-foreground lg:max-w-none lg:text-sm'>
                        {selectedConversation.productContext?.productPrice 
                          ? `VND ${selectedConversation.productContext.productPrice.toLocaleString('vi-VN')}` 
                          : 'Price not available'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right */}
              <div className='-mr-1 flex items-center gap-1 lg:gap-2'>
                <Button
                  size='icon'
                  variant='ghost'
                  className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                  <IconVideo size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='hidden size-8 rounded-full sm:inline-flex lg:size-10'
                >
                  <IconPhone size={22} className='stroke-muted-foreground' />
                </Button>
                <Button
                  size='icon'
                  variant='ghost'
                  className='h-10 rounded-md sm:h-8 sm:w-4 lg:h-10 lg:w-6'
                >
                  <IconDotsVertical className='stroke-muted-foreground sm:size-5' />
                </Button>
              </div>
            </div>

            {/* Conversation */}
            <div className='flex flex-1 flex-col gap-2 rounded-md px-4 pb-4 pt-0 min-h-0'>
              <div className='flex size-full flex-1 min-h-0'>
                <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden min-h-0'>
                  <div 
                    ref={messagesContainerRef}
                    className='chat-flex flex flex-1 w-full flex-col justify-start gap-3 overflow-y-auto py-4 pb-4 pr-4 min-h-96 max-h-[calc(100vh-300px)]'
                  >
                    {loading && Object.keys(currentMessage).length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <>
                        {currentMessage &&
                          Object.keys(currentMessage).map((key) => (
                            <Fragment key={key}>
                              <div className='text-center text-xs text-muted-foreground mb-4 mt-2'>
                                {key}
                              </div>
                              <div className="space-y-3">
                                {currentMessage[key].map((msg, index) => (
                                  <MessageItem
                                    key={`${msg.senderId}-${msg.timestamp}-${index}`}
                                    message={msg}
                                    isOwn={msg.senderId === currentUserId}
                                    onEdit={handleEditMessage}
                                    onDelete={handleDeleteMessage}
                                  />
                                ))}
                              </div>
                            </Fragment>
                          ))}
                        
                        {!selectedConversation && (
                          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <IconMessages size={48} className="mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
                            <p>Select a conversation to start messaging</p>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>
              <form onSubmit={handleSendMessage} className='flex w-full flex-none gap-2'>
                <div className='flex flex-1 items-center gap-2 rounded-md border border-input px-2 py-1 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring lg:gap-4'>
                  <div className='space-x-1'>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='h-8 rounded-md'
                    >
                      <IconPlus size={20} className='stroke-muted-foreground' />
                    </Button>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='hidden h-8 rounded-md lg:inline-flex'
                    >
                      <IconPhotoPlus
                        size={20}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                    <Button
                      size='icon'
                      type='button'
                      variant='ghost'
                      className='hidden h-8 rounded-md lg:inline-flex'
                    >
                      <IconPaperclip
                        size={20}
                        className='stroke-muted-foreground'
                      />
                    </Button>
                  </div>
                  <label className='flex-1'>
                    <span className='sr-only'>Chat Text Box</span>
                    <input
                      type='text'
                      placeholder='Type your messages...'
                      className='h-8 w-full bg-inherit focus-visible:outline-none'
                      value={messageText}
                      onChange={handleInputChange}
                      disabled={loading || !selectedConversation}
                    />
                  </label>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='hidden sm:inline-flex'
                    type="submit"
                    disabled={!messageText.trim() || loading || !selectedConversation}
                  >
                    <IconSend size={20} />
                  </Button>
                </div>
                <Button
                  className='h-full sm:hidden'
                  rightSection={<IconSend size={18} />}
                  type="submit"
                  disabled={!messageText.trim() || loading || !selectedConversation}
                >
                  Send
                </Button>
              </form>
              
              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  {typingUsers.map(user => user.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
              )}
            </div>
          </div>
        </section>
      </Layout.Body>
    </Layout>
  )
}
