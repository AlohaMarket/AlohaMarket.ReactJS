import type { Conversation } from '@/types/chat.types';
import {
  IconEdit,
  IconMessages
} from '@tabler/icons-react';
import React from 'react';
import './ConversationList.css';
import { Button } from '@/components/ui/button';

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
    // Always show the other participants' names as the conversation title
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

  const getConversationAvatar = (conversation: Conversation) => {
    // If there's a product context, show product image
    if (conversation.productContext) {
      return (
        <img
          src={conversation.productContext.productImage}
          alt={conversation.productContext.productName}
          className="product-image"
        />
      );
    }
    
    // Otherwise show first letter of the other participant's name
    return (
      <div className="default-avatar">
        {getConversationTitle(conversation).charAt(0).toUpperCase()}
      </div>
    );
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
      <div className='flex items-center justify-between py-2'>
        <div className='flex gap-2'>
          <h1 className='text-2xl font-bold'>Inbox</h1>
          <IconMessages size={20} />
        </div>

        <Button size='icon' variant='ghost' className='rounded-lg'>
          <IconEdit size={24} className='stroke-muted-foreground' />
        </Button>
      </div>

      <div className="conversations">
        {conversations.map(conversation => (
          <div
            key={conversation.id}
            className={`conversation-item ${isSelected(conversation) ? 'selected' : ''}`}
            onClick={() => onConversationSelect(conversation)}
          >
            <div className="conversation-avatar">
              {getConversationAvatar(conversation)}
            </div>

            <div className="conversation-info">
              <div className="conversation-title">
                {getConversationTitle(conversation)}
              </div>
              <div className="conversation-subtitle">
                {getConversationSubtitle(conversation)}
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
        ))}

      </div>
    </div>
  );
};

export default ConversationList; 