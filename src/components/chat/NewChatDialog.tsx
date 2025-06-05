import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { useChat } from '@/contexts/ChatContext';
import { Search, User, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onConversationCreated?: (conversation: any) => void;
}

export function NewChatDialog({ open, onClose, onConversationCreated }: NewChatDialogProps) {  const [searchQuery, setSearchQuery] = useState('');  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const { createConversation } = useChat();

  // Constants
  const MAX_GROUP_SIZE = 10; // Maximum number of participants in a group chat

  // Mock users for demonstration - in real app, this would come from an API
  const mockUsers: User[] = [
    {
      id: '2',
      name: 'John Smith',
      email: 'john@example.com',
      avatar: '',
      isOnline: true
    },
    {
      id: '3',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: '',
      isOnline: false
    },
    {
      id: '4',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      avatar: '',
      isOnline: true
    },
    {
      id: '5',
      name: 'Sarah Davis',
      email: 'sarah@example.com',
      avatar: '',
      isOnline: false
    }
  ];
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setError(null); // Clear errors when searching
  };
  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      const filtered = mockUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(false);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Memoized filtered suggestions
  const suggestedUsers = useMemo(() => {
    return mockUsers.slice(0, 3);
  }, []);
  const toggleUserSelection = (user: User) => {
    setError(null); // Clear any previous errors
    
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        // Check if we're at the group size limit
        if (prev.length >= MAX_GROUP_SIZE) {
          setError(`Maximum ${MAX_GROUP_SIZE} participants allowed in a group chat`);
          return prev;
        }
        return [...prev, user];
      }
    });
  };
  const removeSelectedUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(u => u.id !== userId));
    setError(null); // Clear error when removing users
  };  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const participantIds = selectedUsers.map(user => user.id);
      const conversation = await createConversation(participantIds);
      
      onConversationCreated?.(conversation);
      handleClose();
    } catch (error) {
      console.error('Failed to create chat:', error);
      setError(error instanceof Error ? error.message : 'Failed to create chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
    setSearchQuery('');
    setSelectedUsers([]);
    setSearchResults([]);
    setError(null);
    onClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Chat</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="pl-10"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Selected:</p>
                <p className="text-xs text-gray-500">
                  {selectedUsers.length}/{MAX_GROUP_SIZE} participants
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                  >
                    <span className="text-sm">{user.name}</span>
                    <button
                      onClick={() => removeSelectedUser(user.id)}
                      className="hover:bg-blue-200 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}          {/* Search Results */}
          <div className="max-h-64 overflow-y-auto space-y-1">
            {searchQuery && isSearching && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <p className="text-sm text-gray-500">Searching...</p>
                </div>
              </div>
            )}
            
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No users found matching "{searchQuery}"
              </p>            )}
              {searchQuery && !isSearching && searchResults.map(user => {
              const isSelected = selectedUsers.find(u => u.id === user.id);
              const isDisabled = !isSelected && selectedUsers.length >= MAX_GROUP_SIZE;
              
              return (
                <div
                  key={user.id}
                  onClick={() => !isDisabled && toggleUserSelection(user)}
                  className={cn(
                    'flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50',
                    isSelected && 'bg-blue-50 border border-blue-200',
                    isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
                  )}
                >
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    )}
                    {user.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="text-blue-600">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Suggestions */}          {!searchQuery && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Suggested:</p>
              <div className="space-y-1">
                {suggestedUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => toggleUserSelection(user)}
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <div className="relative">
                      <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 rounded-full border border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0 || isLoading}
          >
            {isLoading ? 'Creating...' : `Start Chat${selectedUsers.length > 1 ? ` (${selectedUsers.length})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
