import type {
  Message,
  SendMessageRequest,
  SignalRMessageData,
  SignalREditedMessageData,
  SignalRTypingData,
  SignalRMessageDeliveredData
} from '@/types/chat.types';
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
        accessTokenFactory: () => ''
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning) // Reduced logging level
      .build();

    try {
      await this.connection.start();
    } catch (err) {
      console.error('SignalR Connection failed: ', err);
      throw err;
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
    }
  }
  public async joinConversation(conversationId: string): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('JoinConversation', conversationId);
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
      } catch (err) {
        console.error('Failed to leave conversation: ', err);
        throw err;
      }
    }
  } public async sendMessage(request: SendMessageRequest): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.invoke('SendMessage', request);
      } catch (err) {
        console.error('Failed to send message: ', err);
        throw err;
      }
    } else {
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
      this.connection.on('ReceiveMessage', (data: SignalRMessageData) => {
        const message: Message = {
          id: data.id || '',
          conversationId: data.conversationId || '',
          senderId: data.senderId || '',
          senderName: data.senderName || '',
          senderAvatar: data.senderAvatar || '',
          content: data.content || '',
          messageType: data.messageType || 'text',
          timestamp: data.timestamp || new Date().toISOString(),
          isRead: data.isRead !== undefined ? data.isRead : false,
          isEdited: false,
        };
        callback(message);
      });
    }
  }
  public onMessageEdited(callback: (message: Message) => void): void {
    if (this.connection) {
      this.connection.on('MessageEdited', (data: SignalREditedMessageData) => {
        const partialMessage: Partial<Message> & { id: string } = {
          id: data.id,
          content: data.content,
          isEdited: data.isEdited,
          editedAt: data.editedAt,
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
  public onUserTyping(callback: (data: SignalRTypingData) => void): void {
    if (this.connection) {
      this.connection.on('UserTyping', callback);
    }
  }

  public onMessageDelivered(callback: (data: SignalRMessageDeliveredData) => void): void {
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
}