import React, { useState } from 'react';
import './MessageItem.css';
import type { Message } from '@/types/chat.types';
import type { SignalRService } from '@/services/signalRService';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  signalRService: SignalRService;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isOwn,
  signalRService
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(message.content);
  const [showActions, setShowActions] = useState<boolean>(false);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      try {
        await signalRService.editMessage(message.id, editContent.trim());
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to edit message:', error);
        alert('Failed to edit message');
      }
    } else {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await signalRService.deleteMessage(message.id);
      } catch (error) {
        console.error('Failed to delete message:', error);
        alert('Failed to delete message');
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  return (
    <div 
      className={`message-item ${isOwn ? 'own-message' : 'other-message'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isOwn && (
        <div className="message-avatar">
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt={message.senderName} />
          ) : (
            <div className="default-avatar">
              {message.senderName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      )}
      
      <div className="message-content">
        {!isOwn && (
          <div className="message-sender">
            {message.senderName || message.senderId}
          </div>
        )}
        
        <div className="message-bubble">
          {isEditing ? (
            <div className="message-edit">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                className="edit-input"
                autoFocus
              />
              <div className="edit-actions">
                <button onClick={handleEdit} className="save-btn">
                  Save
                </button>
                <button onClick={handleCancelEdit} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="message-text">
                {message.content}
                {message.isEdited && (
                  <span className="edited-indicator">(edited)</span>
                )}
              </div>
                <div className="message-footer">
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
                {isOwn && (
                  <div className="message-status">
                    {message.isOptimistic ? (
                      <span className="sending-indicator" title="Sending...">⏳</span>
                    ) : message.isRead ? (
                      <span className="read-indicator" title="Read">✓✓</span>
                    ) : (
                      <span className="sent-indicator" title="Sent">✓</span>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {isOwn && showActions && !isEditing && (
          <div className="message-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="action-btn edit-btn"
              title="Edit message"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete}
              className="action-btn delete-btn"
              title="Delete message"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem; 