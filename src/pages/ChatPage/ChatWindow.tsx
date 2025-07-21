import React, { useState, useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './ChatWindow.css';
import type { Conversation, Message } from '@/types/chat.types';
import type { SignalRService } from '@/services/signalRService';

interface ChatWindowProps {
  conversation: Conversation;
  messages: Message[];
  currentUserId: string;
  signalRService: SignalRService;
  loading: boolean;
  onMessagesUpdate: (updater: (prevMessages: Message[]) => Message[]) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  signalRService,
  loading,
  onMessagesUpdate
}) => {  const [messageText, setMessageText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<Array<{userId: string, userName: string, userAvatar?: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Filter messages for the current conversation
  const conversationMessages = messages.filter(message => 
    message.conversationId === conversation.id
  );
  console.log(`📊 ChatWindow - Total messages: ${messages.length}, Filtered for conversation ${conversation.id}: ${conversationMessages.length}`);
  // Auto-scroll to bottom function - more targeted approach
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };  // Auto-scroll when conversation changes (entering a new chat)
  useEffect(() => {
    // Only scroll when we have a conversation, with a delay for DOM updates
    if (conversation.id) {
      setTimeout(scrollToBottom, 100);
    }
  }, [conversation.id]);

  // Auto-scroll when new messages are added (not on every change)
  useEffect(() => {
    // Only scroll if there are messages and we're not in loading state
    if (conversationMessages.length > 0 && !loading) {
      setTimeout(scrollToBottom, 50);
    }
  }, [conversationMessages.length, loading]);

  // Auto-scroll when typing users appear (to show typing indicator)
  useEffect(() => {
    if (typingUsers.length > 0) {
      setTimeout(scrollToBottom, 50);
    }
  }, [typingUsers.length]);
  useEffect(() => {
    // Setup typing listeners
    signalRService.onUserTyping((data) => {
      if (data.conversationId === conversation.id && data.userId !== currentUserId) {
        setTypingUsers(prev => {
          if (data.isTyping) {
            // Check if user is already in the typing list
            const userExists = prev.some(user => user.userId === data.userId);
            if (!userExists) {
              // Get user avatar from conversation participants or use a default
              const participant = conversation.participants.find(p => p.userId === data.userId);
              return [...prev, {
                userId: data.userId,
                userName: data.userName,
                userAvatar: data.userAvatar || participant?.userAvatar || ''
              }];
            }
            return prev;
          } else {
            return prev.filter(user => user.userId !== data.userId);
          }
        });
      }
    });
  }, [conversation.id, currentUserId, signalRService, conversation.participants]);

  // Cleanup typing indicator when conversation changes or component unmounts
  useEffect(() => {
    return () => {
      if (isTyping) {
        signalRService.setTyping(conversation.id, false);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [conversation.id, isTyping, signalRService]);const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const messageContent = messageText.trim();
    const tempMessageId = `temp-${Date.now()}-${Math.random()}`;
    
    // Create optimistic message (show immediately)
    const optimisticMessage: Message = {
      id: tempMessageId,
      conversationId: conversation.id,
      senderId: currentUserId,
      senderName: 'You', // We'll update this when we get the real message
      senderAvatar: '',
      content: messageContent,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
      isEdited: false,
      isOptimistic: true // Flag to identify optimistic messages
    };

    // Add optimistic message immediately
    const addOptimisticMessage = (prevMessages: Message[]) => {
      // Check if we already have this message (to prevent duplicates)
      const messageExists = prevMessages.some(msg => 
        msg.content === messageContent && 
        msg.senderId === currentUserId && 
        Math.abs(new Date(msg.timestamp).getTime() - new Date(optimisticMessage.timestamp).getTime()) < 5000
      );
      
      if (messageExists) {
        console.log('Similar message already exists, skipping optimistic update');
        return prevMessages;
      }
      
      console.log('Adding optimistic message:', optimisticMessage);
      return [...prevMessages, optimisticMessage];
    };    try {
      // Show message immediately (optimistic update)
      onMessagesUpdate(addOptimisticMessage);
        // Clear input and stop typing
      setMessageText('');
      handleTypingStop();

      // Send message via SignalR
      await signalRService.sendMessage({
        conversationId: conversation.id,
        content: messageContent,
        messageType: 'text'
      });
      
      console.log('✅ Message sent successfully via SignalR');
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Remove optimistic message on error
      onMessagesUpdate((prevMessages: Message[]) => 
        prevMessages.filter(msg => msg.id !== tempMessageId)
      );
      
      // Restore message text
      setMessageText(messageContent);
      alert('Failed to send message');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleTypingStart();
  };
  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      signalRService.setTyping(conversation.id, true);
      console.log('Started typing indicator');
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
    if (isTyping) {
      setIsTyping(false);
      signalRService.setTyping(conversation.id, false);
      console.log('Stopped typing indicator');
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const getConversationTitle = (): string => {
    // Always show the other participants' names as the main title
    const otherParticipants = conversation.participants.filter(
      p => p.userId !== currentUserId
    );
    
    if (otherParticipants.length === 0) {
      return 'Self Chat';
    }
    
    return otherParticipants.map(p => p.userName || p.userId).join(', ');
  };

  const getConversationSubtitle = (): string => {
    if (conversation.productContext) {
      return `Discussing: ${conversation.productContext.productName}`;
    }
    return '';
  };

  const getOnlineParticipants = (): number => {
    return conversation.participants.filter(p => p.isOnline).length;
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="conversation-info">
          <h3>{getConversationTitle()}</h3>
          {getConversationSubtitle() && (
            <div className="conversation-subtitle">
              {getConversationSubtitle()}
            </div>
          )}
          <span className="participant-count">
            {getOnlineParticipants()} of {conversation.participants.length} online
          </span>
        </div>
        
        {conversation.productContext && (
          <div className="product-info">
            <img 
              src={conversation.productContext.productImage} 
              alt={conversation.productContext.productName}
              className="product-thumbnail"
            />
            <div className="product-details">
              <span className="product-price">
                ${conversation.productContext.productPrice}
              </span>
              <span className="seller-name">
                by {conversation.productContext.sellerName}
              </span>
            </div>
          </div>
        )}
      </div>      <div className="messages-container" ref={messagesContainerRef}>
        {loading && conversationMessages.length === 0 ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {conversationMessages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              conversationMessages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  signalRService={signalRService}
                />
              ))
            )}              {typingUsers.length > 0 && (
                <div className="typing-indicators">
                  {typingUsers.map((user) => (
                    <div key={user.userId} className="typing-indicator">
                      <div className="typing-avatar">
                        {user.userAvatar ? (
                          <img src={user.userAvatar} alt={user.userName} />
                        ) : (
                          <div className="default-avatar">
                            {user.userName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="typing-bubble">
                        <div className="typing-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="input-container">
          <input
            type="text"
            value={messageText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={loading}
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={!messageText.trim() || loading}
            className="send-button"
          >
            Send
          </button>
        </div>
        {isTyping && (
          <div className="user-typing-indicator">
            <span>You are typing</span>
            <div className="typing-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatWindow; 