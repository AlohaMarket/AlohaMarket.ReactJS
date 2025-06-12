import type { Message, SendMessageRequest } from '@/types/chat.types';
import * as signalR from '@microsoft/signalr';

export class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private userId: string = '';

  constructor() {
    this.connection = null;
  }

  public async startConnection(userId: string): Promise<void> {
    this.userId = userId;
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7273/notificationHub?userId=${userId}`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        accessTokenFactory: () => {
          return '';  // No token needed for testing
        }
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection failed: ', err);
      throw err;
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      console.log('SignalR Disconnected');
    }
  }

  public async joinConversation(conversationId: string): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('JoinConversation', conversationId);
        console.log(`Joined conversation: ${conversationId}`);
      } catch (err) {
        console.error('Failed to join conversation: ', err);
        throw err;
      }
    }
  }

  public async leaveConversation(conversationId: string): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('LeaveConversation', conversationId);
        console.log(`Left conversation: ${conversationId}`);
      } catch (err) {
        console.error('Failed to leave conversation: ', err);
        throw err;
      }
    }
  }
  public async sendMessage(request: SendMessageRequest): Promise<void> {
    if (this.connection) {
      try {
        console.log('Sending message via SignalR:', request);
        console.log('Connection state:', this.connection.state);
        await this.connection.invoke('SendMessage', request);
        console.log('Message sent successfully');
      } catch (err) {
        console.error('Failed to send message: ', err);
        throw err;
      }
    } else {
      console.error('Cannot send message: connection is null');
      throw new Error('SignalR connection is not established');
    }
  }

  public async editMessage(messageId: string, newContent: string): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('EditMessage', messageId, newContent);
      } catch (err) {
        console.error('Failed to edit message: ', err);
        throw err;
      }
    }
  }

  public async deleteMessage(messageId: string): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('DeleteMessage', messageId);
      } catch (err) {
        console.error('Failed to delete message: ', err);
        throw err;
      }
    }
  }

  public async markAsRead(conversationId: string, messageIds: string[]): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('MarkAsRead', conversationId, messageIds);
      } catch (err) {
        console.error('Failed to mark messages as read: ', err);
        throw err;
      }
    }
  }

  public async setTyping(conversationId: string, isTyping: boolean): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('SetTyping', conversationId, isTyping);
      } catch (err) {
        console.error('Failed to set typing status: ', err);
      }
    }
  }  // Event listeners
  public onReceiveMessage(callback: (message: Message) => void): void {
    if (this.connection) {
      console.log('Setting up ReceiveMessage listener');      this.connection.on('ReceiveMessage', (data: any) => {
        console.log('Raw data received from SignalR:', data);
        console.log('Data type:', typeof data);
        console.log('Data keys:', Object.keys(data || {}));
        
        // Import and use debugSignalR if available
        if (typeof window !== 'undefined' && (window as any).debugSignalR) {
          (window as any).debugSignalR.inspectData(data, 'ReceiveMessage Data');
        }
        
        // Handle the data more flexibly - check both PascalCase and camelCase
        const message: Message = {
          id: data.Id || data.id || '',
          conversationId: data.ConversationId || data.conversationId || '',
          senderId: data.SenderId || data.senderId || '',
          senderName: data.SenderName || data.senderName || '',
          senderAvatar: data.SenderAvatar || data.senderAvatar || '',
          content: data.Content || data.content || '',
          messageType: data.MessageType || data.messageType || 'text',
          timestamp: data.Timestamp || data.timestamp || new Date().toISOString(),
          isRead: data.IsRead !== undefined ? data.IsRead : (data.isRead !== undefined ? data.isRead : false),
          isEdited: false,
        };
        console.log('Converted message object:', message);
        callback(message);
      });
    } else {
      console.error('Cannot set up ReceiveMessage listener: connection is null');
    }
  }

  public onMessageEdited(callback: (message: Message) => void): void {
    if (this.connection) {
      this.connection.on('MessageEdited', (data: {
        Id: string;
        Content: string;
        IsEdited: boolean;
        EditedAt: string;
      }) => {
        // For edited messages, we need to create a partial message object
        // The frontend should handle updating the existing message
        const partialMessage: Partial<Message> & { id: string } = {
          id: data.Id,
          content: data.Content,
          isEdited: data.IsEdited,
          editedAt: data.EditedAt,
        };
        callback(partialMessage as Message);
      });
    }
  }

  public onMessageDeleted(callback: (messageId: string) => void): void {
    if (this.connection) {
      this.connection.on('MessageDeleted', callback);
    }
  }

  public onUserStatusChanged(callback: (userId: string, isOnline: boolean) => void): void {
    if (this.connection) {
      this.connection.on('UserStatusChanged', callback);
    }
  }

  public onUserJoinedConversation(callback: (conversationId: string, userId: string) => void): void {
    if (this.connection) {
      this.connection.on('UserJoinedConversation', callback);
    }
  }

  public onUserLeftConversation(callback: (conversationId: string, userId: string) => void): void {
    if (this.connection) {
      this.connection.on('UserLeftConversation', callback);
    }
  }

  public onUserTyping(callback: (data: { ConversationId: string, UserId: string, UserName: string, IsTyping: boolean }) => void): void {
    if (this.connection) {
      this.connection.on('UserTyping', callback);
    }
  }

  public onMessageDelivered(callback: (data: { MessageId: string, Status: string, Timestamp: string }) => void): void {
    if (this.connection) {
      this.connection.on('MessageDelivered', callback);
    }
  }

  public onMessageError(callback: (error: string) => void): void {
    if (this.connection) {
      this.connection.on('MessageError', callback);
    }
  }

  public onConnectionClosed(callback: () => void): void {
    if (this.connection) {
      this.connection.onclose(callback);
    }
  }

  public onReconnecting(callback: () => void): void {
    if (this.connection) {
      this.connection.onreconnecting(callback);
    }
  }

  public onReconnected(callback: () => void): void {
    if (this.connection) {
      this.connection.onreconnected(callback);
    }
  }

  public getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
  public getUserId(): string {
    return this.userId;
  }

  // Debug methods
  public debugConnection(): void {
    console.log('=== SignalR Connection Debug ===');
    console.log('Connection:', this.connection);
    console.log('Connection State:', this.connection?.state);
    console.log('User ID:', this.userId);
    console.log('Connection ID:', this.connection?.connectionId);
    console.log('================================');
  }

  public async testMessage(conversationId: string): Promise<void> {
    if (this.connection) {
      try {
        console.log('Testing message send...');
        await this.connection.invoke('SendMessage', {
          conversationId: conversationId,
          content: 'Test message from SignalR service',
          messageType: 'text'
        });
        console.log('Test message sent successfully');
      } catch (err) {
        console.error('Test message failed:', err);
      }
    }
  }
}