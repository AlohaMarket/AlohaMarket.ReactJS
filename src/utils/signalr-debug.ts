// Debug utilities for SignalR connection issues
export const debugSignalR = {
  /**
   * Test SignalR connection and message flow
   */
  async testConnection(signalRService: any, conversationId: string) {
    console.log('🔍 Starting SignalR Debug Test...');
    
    // 1. Check connection state
    console.log('1. Connection State Check:');
    signalRService.debugConnection();
    
    // 2. Test basic connectivity
    console.log('2. Testing basic connectivity...');
    const connectionState = signalRService.getConnectionState();
    console.log('Connection state:', connectionState);
    
    if (connectionState !== 1) { // 1 = Connected
      console.error('❌ Connection is not in Connected state!');
      return;
    }
    
    // 3. Test conversation joining
    console.log('3. Testing conversation join...');
    try {
      await signalRService.joinConversation(conversationId);
      console.log('✅ Successfully joined conversation');
    } catch (error) {
      console.error('❌ Failed to join conversation:', error);
      return;
    }
    
    // 4. Test message sending
    console.log('4. Testing message send...');
    try {
      await signalRService.testMessage(conversationId);
      console.log('✅ Test message sent');
    } catch (error) {
      console.error('❌ Failed to send test message:', error);
    }
    
    console.log('🔍 SignalR Debug Test Complete');
  },
  /**
   * Log all SignalR events for debugging
   */
  logAllEvents(signalRService: any) {
    console.log('📝 Setting up comprehensive event logging...');
    
    signalRService.onReceiveMessage((message: any) => {
      console.log('📨 [EVENT] ReceiveMessage:', message);
      console.log('📨 [EVENT] Message properties:', {
        hasId: !!message.id,
        hasContent: !!message.content,
        hasConversationId: !!message.conversationId,
        hasSender: !!message.senderId,
        keys: Object.keys(message)
      });
    });

    signalRService.onMessageEdited((message: any) => {
      console.log('✏️ [EVENT] MessageEdited:', message);
    });

    signalRService.onMessageDeleted((messageId: string) => {
      console.log('🗑️ [EVENT] MessageDeleted:', messageId);
    });

    signalRService.onUserStatusChanged((userId: string, isOnline: boolean) => {
      console.log('👤 [EVENT] UserStatusChanged:', { userId, isOnline });
    });

    signalRService.onUserJoinedConversation((conversationId: string, userId: string) => {
      console.log('➕ [EVENT] UserJoinedConversation:', { conversationId, userId });
    });

    signalRService.onUserLeftConversation((conversationId: string, userId: string) => {
      console.log('➖ [EVENT] UserLeftConversation:', { conversationId, userId });
    });

    signalRService.onUserTyping((data: any) => {
      console.log('⌨️ [EVENT] UserTyping:', data);
    });

    signalRService.onMessageDelivered((data: any) => {
      console.log('✅ [EVENT] MessageDelivered:', data);
    });

    signalRService.onMessageError((error: string) => {
      console.log('❌ [EVENT] MessageError:', error);
    });

    signalRService.onConnectionClosed(() => {
      console.log('🔌 [EVENT] ConnectionClosed');
    });

    signalRService.onReconnecting(() => {
      console.log('🔄 [EVENT] Reconnecting');
    });

    signalRService.onReconnected(() => {
      console.log('🔄 [EVENT] Reconnected');
    });

    console.log('📝 Event logging setup complete');
  },

  /**
   * Monitor network and connection issues
   */
  monitorConnection(signalRService: any) {
    console.log('📊 Starting connection monitoring...');
    
    const checkInterval = setInterval(() => {
      const state = signalRService.getConnectionState();
      const stateNames = ['Disconnected', 'Connected', 'Connecting', 'Reconnecting'];
      console.log(`📊 [MONITOR] Connection state: ${stateNames[state] || 'Unknown'} (${state})`);
    }, 5000);

    // Return cleanup function
    return () => {
      clearInterval(checkInterval);
      console.log('📊 Connection monitoring stopped');
    };
  },

  /**
   * Inspect raw data structure from SignalR
   */
  inspectData(data: any, label: string = 'Data') {
    console.log(`🔍 [INSPECT] ${label}:`, {
      type: typeof data,
      isArray: Array.isArray(data),
      isNull: data === null,
      isUndefined: data === undefined,
      keys: data ? Object.keys(data) : [],
      values: data ? Object.values(data) : [],
      raw: data
    });
    
    // Try to find message-like properties
    if (data && typeof data === 'object') {
      const possibleMessageProps = [
        'id', 'Id', 'ID',
        'content', 'Content', 'CONTENT',
        'conversationId', 'ConversationId', 'CONVERSATIONID',
        'senderId', 'SenderId', 'SENDERID',
        'senderName', 'SenderName', 'SENDERNAME',
        'timestamp', 'Timestamp', 'TIMESTAMP'
      ];
      
      const foundProps = possibleMessageProps.filter(prop => data.hasOwnProperty(prop));
      console.log(`🔍 [INSPECT] Found message-like properties:`, foundProps);
      
      foundProps.forEach(prop => {
        console.log(`🔍 [INSPECT] ${prop}:`, data[prop]);
      });
    }
  },
};
