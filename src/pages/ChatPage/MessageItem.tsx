import { useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Message } from '@/types/chat.types';
import {
  IconCheck,
  IconEdit,
  IconTrash,
  IconX
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils'

export const MessageItem: React.FC<{
  message: Message;
  isOwn: boolean;
  onEdit: (messageId: string, newContent: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
}> = ({ message, isOwn, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editContent, setEditContent] = useState<string>(message.content);
  const [showActions, setShowActions] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, editContent]);

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return dayjs(timestamp).format('h:mm a');
    } else {
      return dayjs(timestamp).format('MMM D, h:mm a');
    }
  };

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      try {
        await onEdit(message.id, editContent.trim());
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to edit message:', error);
      }
    } else {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await onDelete(message.id);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[100%] group mb-4',
        isOwn ? 'self-end flex-row-reverse' : 'self-start'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <Avatar className="w-6 h-6 flex-shrink-0 mt-12">
        <AvatarImage
          src={message.senderAvatar}
          alt={message.senderName}
        />
        <AvatarFallback className="text-xs">
          {message.senderName?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
        {/* Username */}
        <span className={cn(
          'text-xs text-muted-foreground mb-1 px-1',
          isOwn ? 'text-right' : 'text-left'
        )}>
          {isOwn ? 'You' : message.senderName}
        </span>

        {/* Message Bubble */}
        <div
          className={cn(
            'chat-box break-words px-3 py-2 shadow-lg relative max-w-72',
            isOwn
              ? 'rounded-[16px_16px_0_16px] bg-primary/85 text-primary-foreground/75'
              : 'rounded-[16px_16px_16px_0] bg-secondary'
          )}
        >
          {isEditing ? (
            <div className="w-full">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-transparent border-none outline-none resize-none text-sm p-1 rounded border-2 border-blue-300 focus:border-blue-500"
                style={{
                  backgroundColor: isOwn ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  minHeight: '20px',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  color: 'inherit'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleEdit();
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-green-50 hover:bg-green-100 text-green-600"
                  onClick={handleEdit}
                  title="Save changes (Enter)"
                >
                  <IconCheck size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 bg-gray-50 hover:bg-gray-100 text-gray-600"
                  onClick={handleCancelEdit}
                  title="Cancel (Esc)"
                >
                  <IconX size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                {message.content}
                {isOwn && showActions && (
                  <div
                    className="absolute -top-2 -right-2 flex gap-1 bg-white rounded shadow-lg border z-10"
                    style={{
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '2px'
                    }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                      onClick={() => setIsEditing(true)}
                    >
                      <IconEdit size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-red-50 text-gray-600 hover:text-red-600"
                      onClick={handleDelete}
                    >
                      <IconTrash size={12} />
                    </Button>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'mt-1 block text-xs font-light italic text-muted-foreground',
                  isOwn && 'text-right'
                )}
              >
                {formatTime(message.timestamp)}
                {message.isEdited && ' (edited)'}
              </span>
              {message.isOptimistic && (
                <span className="text-xs opacity-50 ml-1">⏳</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};