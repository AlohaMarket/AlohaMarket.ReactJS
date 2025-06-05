import type { TypingIndicator } from '@/types/chat.type';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  users: TypingIndicator[];
  className?: string;
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  if (users.length === 0) return null;

  const formatUserNames = () => {
    if (users.length === 1) {
      return `${users[0].userName} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].userName} and ${users[1].userName} are typing...`;
    } else {
      return `${users[0].userName} and ${users.length - 1} others are typing...`;
    }
  };

  return (
    <div className={cn('flex items-center space-x-2 text-sm text-gray-500', className)}>
      <div className="flex space-x-1">
        <div className="flex space-x-1 animate-pulse">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <span className="text-xs">
        {formatUserNames()}
      </span>
    </div>
  );
}
