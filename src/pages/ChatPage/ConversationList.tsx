import React from 'react';
import './ConversationList.css';
import type { Conversation } from '@/types/chat.types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onConversationSelect: (conversation: Conversation) => void;
  onCreateConversation: () => void;
  currentUserId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  onCreateConversation,
  currentUserId
}) => {
  const getConversationTitle = (conversation: Conversation): string => {
    if (conversation.productContext) {
      return conversation.productContext.productName;
    }
    
    // Get other participants names
    const otherParticipants = conversation.participants.filter(
      p => p.userId !== currentUserId
    );
    
    if (otherParticipants.length === 0) {
      return 'Self Chat';
    }
    
    return otherParticipants.map(p => p.userName || p.userId).join(', ');
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

  const isSelected = (conversation: Conversation): boolean => {
    return selectedConversation?.id === conversation.id;
  };

  return (
    <div className="conversation-list">
      <div className="conversation-list-header">
        <h2>Conversations</h2>
        <button 
          onClick={onCreateConversation}
          className="create-conversation-btn"
          title="Create new conversation"
        >
          +
        </button>
      </div>
      
      <div className="conversations">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
            <p>Click + to start a new chat</p>
          </div>
        ) : (
          conversations.map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item ${isSelected(conversation) ? 'selected' : ''}`}
              onClick={() => onConversationSelect(conversation)}
            >
              <div className="conversation-avatar">
                {conversation.productContext ? (
                  <img 
                    src={conversation.productContext.productImage} 
                    alt={conversation.productContext.productName}
                    className="product-image"
                  />
                ) : (
                  <div className="default-avatar">
                    {getConversationTitle(conversation).charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              <div className="conversation-info">
                <div className="conversation-title">
                  {getConversationTitle(conversation)}
                </div>
                <div className="conversation-meta">
                  <span className="conversation-type">
                    {conversation.conversationType === 'buyer_seller' ? 'Product Chat' : 'Support'}
                  </span>
                  <span className="last-message-time">
                    {getLastMessageTime(conversation)}
                  </span>
                </div>
                {conversation.productContext && (
                  <div className="product-price">
                    ${conversation.productContext.productPrice}
                  </div>
                )}
              </div>
              
              <div className="conversation-status">
                {conversation.isActive && (
                  <div className="active-indicator"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList; 