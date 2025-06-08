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
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  signalRService,
  loading
}) => {
  const [messageText, setMessageText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Setup typing listeners
    signalRService.onUserTyping((conversationId, userId, userName, isTyping) => {
      if (conversationId === conversation.id && userId !== currentUserId) {
        setTypingUsers(prev => {
          if (isTyping) {
            return prev.includes(userName) ? prev : [...prev, userName];
          } else {
            return prev.filter(user => user !== userName);
          }
        });
      }
    });
  }, [conversation.id, currentUserId, signalRService]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      await signalRService.sendMessage({
        conversationId: conversation.id,
        content: messageText.trim(),
        messageType: 'text'
      });
      
      setMessageText('');
      handleTypingStop();
    } catch (error) {
      console.error('Failed to send message:', error);
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
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (isTyping) {
      setIsTyping(false);
      signalRService.setTyping(conversation.id, false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const getConversationTitle = (): string => {
    if (conversation.productContext) {
      return conversation.productContext.productName;
    }
    
    const otherParticipants = conversation.participants.filter(
      p => p.userId !== currentUserId
    );
    
    if (otherParticipants.length === 0) {
      return 'Self Chat';
    }
    
    return otherParticipants.map(p => p.userName || p.userId).join(', ');
  };

  const getOnlineParticipants = (): number => {
    return conversation.participants.filter(p => p.isOnline).length;
  };

  return (
    <div className="chat-window">
      <div className="chat-window-header">
        <div className="conversation-info">
          <h3>{getConversationTitle()}</h3>
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
      </div>

      <div className="messages-container">
        {loading && messages.length === 0 ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="no-messages">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === currentUserId}
                  signalRService={signalRService}
                />
              ))
            )}
            
            {typingUsers.length > 0 && (
              <div className="typing-indicator">
                <span>{typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
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
      </form>
    </div>
  );
};

export default ChatWindow; 