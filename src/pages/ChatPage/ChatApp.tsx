import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import UserLogin from './UserLogin';
import './ChatApp.css';
import { SignalRService } from '@/services/signalRService';
import { ChatApiService } from '@/services/chatApiService';
import type { Conversation, Message } from '@/types/chat.types';

const ChatApp: React.FC = () => {
  const [signalRService] = useState(new SignalRService());
  const [chatApiService] = useState(new ChatApiService());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);  // Setup SignalR event listeners function
  const setupEventListeners = () => {
    signalRService.onReceiveMessage((message: Message) => {
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
          const newMessages = [...prevMessages];
          newMessages[optimisticIndex] = { ...message, isOptimistic: false };
          return newMessages;
        }

        // Check if message already exists to prevent duplicates
        const messageExists = prevMessages.some(msg => msg.id === message.id);
        if (messageExists) {
          return prevMessages;
        }

        return [...prevMessages, message];
      });
    });

    signalRService.onMessageEdited((editedMessage: Message) => {
      setMessages(prevMessages => 
        prevMessages.map(msg => msg.id === editedMessage.id ? editedMessage : msg)
      );
    });

    signalRService.onMessageDeleted((messageId: string) => {
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
    });

    // Handle user status changes (online/offline)
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

    // Handle message delivery status
    signalRService.onMessageDelivered((data: { MessageId: string, Status: string, Timestamp: string }) => {
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
      console.error('SignalR message error:', error);
    });

    signalRService.onConnectionClosed(() => {
      setIsConnected(false);
    });

    signalRService.onReconnected(() => {
      setIsConnected(true);
    });
  };

  useEffect(() => {
    return () => {
      signalRService.stopConnection();
    };
  }, [signalRService]);  const handleLogin = async (userId: string) => {
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
      } catch (apiError) {
        console.warn('Failed to load conversations:', apiError);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
      alert(`Failed to connect to chat service: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signalRService.stopConnection();
    setCurrentUserId('');
    setIsConnected(false);
    setConversations([]);
    setSelectedConversation(null);
    setMessages([]);
  };  const handleConversationSelect = async (conversation: Conversation) => {
    try {
      setLoading(true);
      setSelectedConversation(conversation);
      
      // Clear messages when switching conversations
      setMessages([]);
      
      // Leave previous conversation if any
      if (selectedConversation) {
        await signalRService.leaveConversation(selectedConversation.id);
      }
      
      // Join new conversation
      await signalRService.joinConversation(conversation.id);
      
      // Load messages for this conversation
      const conversationMessages = await chatApiService.getConversationMessages(
        conversation.id,
        currentUserId
      );
      setMessages(conversationMessages.reverse());
    } catch (error) {
      console.error('Failed to load conversation:', error);
      alert('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    try {
      const otherUserId = prompt('Enter user ID to chat with:');
      if (!otherUserId) return;

      const newConversation = await chatApiService.createConversation({
        userIds: [currentUserId, otherUserId],
      });

      setConversations(prev => [newConversation, ...prev]);
      handleConversationSelect(newConversation);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      alert('Failed to create conversation');
    }
  };

  if (!isConnected) {
    return (
      <UserLogin 
        onLogin={handleLogin} 
        loading={loading}
      />
    );
  }

  return (
    <div className="chat-app">
      <div className="chat-header">
        <h1>Aloha Chat</h1>
        <div className="user-info">
          <span>Welcome, {currentUserId}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      
      <div className="chat-container">
        <div className="sidebar">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
            onCreateConversation={handleCreateConversation}
            currentUserId={currentUserId}
          />
        </div>
          <div className="main-chat">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              currentUserId={currentUserId}
              signalRService={signalRService}
              loading={loading}
              onMessagesUpdate={setMessages}
            />
          ) : (
            <div className="no-conversation-selected">
              <h3>Select a conversation to start chatting</h3>
              <p>Choose from your existing conversations or create a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp; 