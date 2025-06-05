import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Send, 
  Paperclip, 
  Image, 
  Smile, 
  Mic,
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string, messageType?: 'text' | 'image' | 'file') => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

interface FilePreview {
  file: File;
  url: string;
  type: 'image' | 'file';
}

export function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  disabled = false,
  placeholder = "Type your message...",
  className
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<FilePreview[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (message.trim() || attachedFiles.length > 0) {
      if (attachedFiles.length > 0) {
        // Send files first
        attachedFiles.forEach(filePreview => {
          onSendMessage(filePreview.url, filePreview.type);
        });
        setAttachedFiles([]);
      }
      
      if (message.trim()) {
        onSendMessage(message.trim());
        setMessage('');
      }
      
      onTypingStop?.();
      inputRef.current?.focus();
    }
  }, [message, attachedFiles, onSendMessage, onTypingStop]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    if (e.target.value.trim() && !message.trim()) {
      onTypingStart?.();
    } else if (!e.target.value.trim() && message.trim()) {
      onTypingStop?.();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (type === 'image' && !file.type.startsWith('image/')) {
        alert('Please select only image files');
        return;
      }
      
      const url = URL.createObjectURL(file);
      setAttachedFiles(prev => [...prev, { file, url, type }]);
    });
    
    // Reset input
    event.target.value = '';
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleVoiceRecord = () => {
    // TODO: Implement voice recording functionality
    setIsRecording(!isRecording);
  };

  return (
    <div className={cn('p-4 space-y-3', className)}>
      {/* File Previews */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachedFiles.map((filePreview, index) => (
            <div key={index} className="relative">
              {filePreview.type === 'image' ? (
                <div className="relative">
                  <img
                    src={filePreview.url}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeAttachedFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="relative bg-gray-100 p-3 rounded-lg min-w-[120px]">
                  <div className="flex items-center space-x-2">
                    <Paperclip className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[80px]">
                      {filePreview.file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeAttachedFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-2">
        {/* Attachment Options */}
        <div className="flex items-center space-x-1">
          {/* File Attachment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {/* Image Attachment */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
            disabled={disabled}
            className="p-2"
          >
            <Image className="h-4 w-4" />
          </Button>
          
          {/* Voice Recording */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleVoiceRecord}
            disabled={disabled}
            className={cn(
              'p-2',
              isRecording && 'bg-red-100 text-red-600'
            )}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="pr-10 resize-none"
            autoComplete="off"
          />
          
          {/* Emoji Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
            disabled={disabled}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
          size="sm"
          className="px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'file')}
        accept=".pdf,.doc,.docx,.txt,.zip,.rar"
      />
      
      <input
        ref={imageInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e, 'image')}
        accept="image/*"
      />
    </div>
  );
}
