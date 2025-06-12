import React, { useState, useEffect, useRef } from 'react';
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
}) => {  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(message.content);
  const [showActions, setShowActions] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [isEditing, editContent]);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };  const handleEdit = async () => {
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
            <div className="message-edit">              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                className="edit-textarea"
                autoFocus
                rows={1}
                placeholder="Edit your message..."
              />
              <div className="edit-actions">
                <button onClick={handleCancelEdit} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleEdit} className="save-btn">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="message-text">
                {message.content}
                {message.isEdited && (
                  <span className="edited-indicator">· Edited</span>
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
        {/* Action buttons for own messages only */}
        {showActions && !isEditing && isOwn && (
          <div className="message-actions own-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="action-btn edit-btn"
              title="Edit"
            >
              ✏️
            </button>
            <button 
              onClick={handleDelete}
              className="action-btn delete-btn"
              title="Delete"
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