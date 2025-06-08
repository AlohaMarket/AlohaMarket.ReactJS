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
        transport: signalR.HttpTransportType.WebSockets
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
        await this.connection.invoke('SendMessage', request);
      } catch (err) {
        console.error('Failed to send message: ', err);
        throw err;
      }
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
  }

  // Event listeners
  public onReceiveMessage(callback: (message: Message) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveMessage', callback);
    }
  }

  public onMessageEdited(callback: (message: Message) => void): void {
    if (this.connection) {
      this.connection.on('MessageEdited', callback);
    }
  }

  public onMessageDeleted(callback: (messageId: string, conversationId: string) => void): void {
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

  public onUserTyping(callback: (conversationId: string, userId: string, userName: string, isTyping: boolean) => void): void {
    if (this.connection) {
      this.connection.on('UserTyping', callback);
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