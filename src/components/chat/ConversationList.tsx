import { useState } from 'react';
import { useAuth } from '@/hooks/useApp';
import { formatDistanceToNow } from 'date-fns';
import { Search, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { Conversation } from '@/types/chat.type';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
}

export function ConversationList({
  conversations,
  activeConversation,
  onSelectConversation,
  isLoading,
}: ConversationListProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
    const participantNames = otherParticipants.map(p => p.name.toLowerCase()).join(' ');
    const productName = conversation.productContext?.productName?.toLowerCase() || '';
    
    return participantNames.includes(searchQuery.toLowerCase()) || 
           productName.includes(searchQuery.toLowerCase());
  });

  const getConversationTitle = (conversation: Conversation) => {
    const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
    return otherParticipants.map(p => p.name).join(', ') || 'Unknown';
  };

  const getConversationSubtitle = (conversation: Conversation) => {
    if (conversation.productContext) {
      return conversation.productContext.productName;
    }
    return conversation.conversationType === 'support' ? 'Support Chat' : 'General';
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    
    const content = conversation.lastMessage.content;
    const maxLength = 50;
    
    if (conversation.lastMessage.messageType === 'image') {
      return '📷 Image';
    }
    if (conversation.lastMessage.messageType === 'file') {
      return '📎 File';
    }
    
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Start a conversation to connect with sellers or buyers'
              }
            </p>
            {!searchQuery && (
              <Button size="sm" variant="outline">
                Start New Chat
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conversation) => {
              const isActive = activeConversation?.id === conversation.id;
              const otherParticipants = conversation.participants.filter(p => p.id !== user?.id);
              const hasUnread = conversation.unreadCount > 0;

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`
                    flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors
                    ${isActive ? 'bg-primary-50 border-r-2 border-primary-500' : ''}
                    ${hasUnread ? 'bg-blue-50' : ''}
                  `}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mr-3">
                    <div className="relative">
                      {otherParticipants[0]?.avatar ? (
                        <img
                          src={otherParticipants[0].avatar}
                          alt={otherParticipants[0].name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-medium text-lg">
                            {getConversationTitle(conversation).charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        hasUnread ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {getConversationTitle(conversation)}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {conversation.productContext && (
                          <ShoppingBag className="h-3 w-3 text-gray-400" />
                        )}
                        {hasUnread && (
                          <div className="bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>

                    <p className={`text-xs text-gray-500 mb-1 truncate ${
                      hasUnread ? 'font-medium' : ''
                    }`}>
                      {getConversationSubtitle(conversation)}
                    </p>

                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate flex-1 mr-2 ${
                        hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage?.senderId === user?.id && 'You: '}
                        {getLastMessagePreview(conversation)}
                      </p>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}