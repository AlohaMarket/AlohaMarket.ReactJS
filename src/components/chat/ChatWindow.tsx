import { useState, useRef, useEffect } from 'react';
import type { Conversation, ChatMessage } from '@/types/chat.type';
import { useAuth } from '@/hooks/useApp';
import { useChat } from '@/contexts/ChatContext';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Info, 
  ShoppingBag,
  Star,
  DollarSign 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
  conversation: Conversation;
  className?: string;
}

export function ChatWindow({ conversation, className }: ChatWindowProps) {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    markAsRead, 
    setTyping, 
    typingUsers, 
    connection 
  } = useChat();
  
  const [isTyping, setIsTyping] = useState(false);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
  const conversationTypingUsers = typingUsers.filter(
    t => t.conversationId === conversation.id && t.userId !== user?.id
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when conversation is active
  useEffect(() => {
    const unreadMessages = messages.filter(msg => 
      !msg.isRead && msg.senderId !== user?.id
    );
    
    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg.id);
      markAsRead(conversation.id, messageIds);
    }
  }, [messages, conversation.id, user?.id, markAsRead]);

  const handleSendMessage = async (content: string, messageType: 'text' | 'image' | 'file' = 'text') => {
    if (!content.trim() || !connection.isConnected) return;

    try {
      await sendMessage(conversation.id, content, messageType);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTypingStart = () => {
    if (!isTyping) {
      setIsTyping(true);
      setTyping(conversation.id, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTyping(conversation.id, false);
    }, 3000);
  };

  const handleTypingStop = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    setTyping(conversation.id, false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className={cn('flex flex-col bg-white', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Participant Avatar */}
          <div className="relative">
            {otherParticipants[0]?.avatar ? (
              <img
                src={otherParticipants[0].avatar}
                alt={otherParticipants[0].name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {otherParticipants[0]?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
          </div>

          {/* Participant Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {otherParticipants.map(p => p.name).join(', ')}
            </h2>
            <p className="text-sm text-gray-500">
              {connection.isConnected ? 'Online' : 'Offline'}
            </p>
          </div>

          {/* Product Info Button */}
          {conversation.productContext && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProductInfo(!showProductInfo)}
              className="ml-2"
            >
              <ShoppingBag className="h-4 w-4 mr-1" />
              Product
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="p-2">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="p-2">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="p-2">
            <Info className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="p-2">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Product Context Banner */}
      {conversation.productContext && showProductInfo && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={conversation.productContext.productImage}
              alt={conversation.productContext.productName}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {conversation.productContext.productName}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className="flex items-center text-green-600 font-semibold">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatPrice(conversation.productContext.productPrice)}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  <span className="text-sm text-gray-600">4.5</span>
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline">
              View Product
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          messages={messages.filter(msg => msg.conversationId === conversation.id)}
          currentUserId={user?.id || ''}
          className="flex-1 overflow-y-auto p-4"
        />
        
        {/* Typing Indicator */}
        {conversationTypingUsers.length > 0 && (
          <div className="px-4 pb-2">
            <TypingIndicator users={conversationTypingUsers} />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white">
        <MessageInput
          onSendMessage={handleSendMessage}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
          disabled={!connection.isConnected}
          placeholder={
            connection.isConnected 
              ? "Type your message..." 
              : "Connecting to chat..."
          }
        />
      </div>
    </div>
  );
}
