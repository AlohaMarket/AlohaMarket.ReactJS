import { useState } from 'react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Check, CheckCheck, Edit2, Trash2, Reply, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/types/chat.type';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  className?: string;
}

interface MessageItemProps {
  message: ChatMessage;
  isOwn: boolean;
  showTimestamp?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
}

function MessageItem({ 
  message, 
  isOwn, 
  showTimestamp = false, 
  isFirstInGroup = false,
  isLastInGroup = false 
}: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  const renderMessageContent = () => {
    switch (message.messageType) {
      case 'image':
        return (
          <div className="max-w-xs">
            <img
              src={message.content}
              alt="Shared image"
              className="rounded-lg object-cover w-full h-auto"
              loading="lazy"
            />
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-xs font-medium">📎</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {message.content}
              </p>
              <p className="text-xs text-gray-500">Click to download</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="whitespace-pre-wrap break-words">
            {message.replyTo && (
              <div className="mb-2 p-2 bg-gray-100 rounded border-l-2 border-gray-300">
                <p className="text-xs text-gray-500 mb-1">
                  Replying to {message.replyTo.senderName}
                </p>
                <p className="text-sm text-gray-700 truncate">
                  {message.replyTo.content}
                </p>
              </div>
            )}
            {message.content}
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        'flex items-end space-x-2 group',
        isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar - only show for first message in group and not own messages */}
      {!isOwn && isFirstInGroup && (
        <div className="flex-shrink-0">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {message.senderName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Spacer for grouped messages */}
      {!isOwn && !isFirstInGroup && <div className="w-8" />}

      {/* Message Actions */}
      {showActions && (
        <div className={cn(
          'flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity',
          isOwn ? 'order-first' : 'order-last'
        )}>
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <Reply className="h-3 w-3" />
          </Button>
          {isOwn && (
            <>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
            <MoreVertical className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Message Bubble */}
      <div className={cn(
        'max-w-xs lg:max-w-md xl:max-w-lg',
        isOwn ? 'ml-auto' : 'mr-auto'
      )}>
        {/* Sender name - only for first message in group and not own messages */}
        {!isOwn && isFirstInGroup && (
          <p className="text-xs text-gray-500 mb-1 px-3">
            {message.senderName}
          </p>
        )}

        <div
          className={cn(
            'rounded-2xl px-4 py-2 relative',
            isOwn
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-900',
            isFirstInGroup && isOwn && 'rounded-tr-md',
            isFirstInGroup && !isOwn && 'rounded-tl-md',
            isLastInGroup && isOwn && 'rounded-br-md',
            isLastInGroup && !isOwn && 'rounded-bl-md'
          )}
        >
          {renderMessageContent()}

          {/* Message status and timestamp */}
          <div className={cn(
            'flex items-center justify-end space-x-1 mt-1',
            isOwn ? 'text-white/70' : 'text-gray-500'
          )}>
            {message.isEdited && (
              <span className="text-xs opacity-75">edited</span>
            )}
            {(showTimestamp || isLastInGroup) && (
              <span className="text-xs">
                {formatTimestamp(message.timestamp)}
              </span>
            )}
            {isOwn && (
              <div className="flex items-center">
                {message.isRead ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageList({ messages, currentUserId, className }: MessageListProps) {
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(groupedMessages).map(([date, dayMessages]) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
              {formatDateSeparator(date)}
            </div>
          </div>

          {/* Messages for this date */}
          <div className="space-y-1">
            {dayMessages.map((message, index) => {
              const isOwn = message.senderId === currentUserId;
              const prevMessage = index > 0 ? dayMessages[index - 1] : null;
              const nextMessage = index < dayMessages.length - 1 ? dayMessages[index + 1] : null;
              
              const isFirstInGroup = !prevMessage || 
                prevMessage.senderId !== message.senderId ||
                (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 300000; // 5 minutes
              
              const isLastInGroup = !nextMessage || 
                nextMessage.senderId !== message.senderId ||
                (new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime()) > 300000; // 5 minutes

              return (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  isFirstInGroup={isFirstInGroup}
                  isLastInGroup={isLastInGroup}
                />
              );
            })}
          </div>
        </div>
      ))}

      {messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No messages yet. Start the conversation!</p>
        </div>
      )}
    </div>
  );
}

function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { [key: string]: ChatMessage[] } = {};
  
  messages.forEach(message => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });
  
  return groups;
}

function formatDateSeparator(dateString: string) {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return 'Today';
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM dd, yyyy');
  }
}
