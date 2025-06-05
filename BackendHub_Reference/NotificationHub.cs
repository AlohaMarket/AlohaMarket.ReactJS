using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using AlohaMarket.Services;
using AlohaMarket.Models;

namespace AlohaMarket.Hubs
{
    [Authorize]
    public class NotificationHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly IUserService _userService;
        private readonly ILogger<NotificationHub> _logger;

        public NotificationHub(IChatService chatService, IUserService userService, ILogger<NotificationHub> logger)
        {
            _chatService = chatService;
            _userService = userService;
            _logger = logger;
        }

        #region Connection Management

        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            _logger.LogInformation($"User {userId} connected to hub with connection {Context.ConnectionId}");

            // Validate user exists
            var userExists = await _userService.ValidateUserExistsAsync(userId);
            if (!userExists)
            {
                _logger.LogWarning($"User {userId} attempted to connect but doesn't exist");
                Context.Abort();
                return;
            }

            // Join user to their personal room for notifications
            await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            
            // Join user to all their conversation rooms
            var conversations = await _chatService.GetUserConversations(userId);
            foreach (var conversation in conversations)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversation.Id}");
            }
            
            // Notify other users that this user is online (optional - could be handled by User service)
            await Clients.Others.SendAsync("UserStatusChanged", userId, true);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var userId = Context.UserIdentifier;
            _logger.LogInformation($"User {userId} disconnected from hub");
            
            // Notify other users that this user is offline (optional - could be handled by User service)
            await Clients.Others.SendAsync("UserStatusChanged", userId, false);

            await base.OnDisconnectedAsync(exception);
        }

        #endregion

        #region Room Management

        /// <summary>
        /// Join user to their personal room for receiving notifications
        /// </summary>
        public async Task JoinUserRoom(string userId)
        {
            var currentUserId = Context.UserIdentifier;
            
            // Security check - users can only join their own room
            if (currentUserId != userId)
            {
                _logger.LogWarning($"User {currentUserId} attempted to join room for user {userId}");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            _logger.LogInformation($"User {userId} joined their personal room");
        }

        /// <summary>
        /// Join a conversation room
        /// </summary>
        public async Task JoinConversation(string conversationId)
        {
            var userId = Context.UserIdentifier;
            
            // Verify user is participant in this conversation
            var isParticipant = await _chatService.IsUserInConversation(userId, conversationId);
            if (!isParticipant)
            {
                _logger.LogWarning($"User {userId} attempted to join conversation {conversationId} they are not part of");
                throw new HubException("You are not a participant in this conversation");
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
            
            // Notify other participants that user joined
            await Clients.GroupExcept($"Conversation_{conversationId}", Context.ConnectionId)
                .SendAsync("UserJoinedConversation", conversationId, userId);
            
            _logger.LogInformation($"User {userId} joined conversation {conversationId}");
        }

        /// <summary>
        /// Leave a conversation room
        /// </summary>
        public async Task LeaveConversation(string conversationId)
        {
            var userId = Context.UserIdentifier;
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Conversation_{conversationId}");
            
            // Notify other participants that user left
            await Clients.Group($"Conversation_{conversationId}")
                .SendAsync("UserLeftConversation", conversationId, userId);
            
            _logger.LogInformation($"User {userId} left conversation {conversationId}");
        }

        #endregion

        #region Message Operations

        /// <summary>
        /// Send a message to a conversation
        /// </summary>
        public async Task SendMessage(SendMessageRequest request)
        {
            var userId = Context.UserIdentifier;
            
            try
            {
                // Verify user is participant in conversation
                var isParticipant = await _chatService.IsUserInConversation(userId, request.ConversationId);
                if (!isParticipant)
                {
                    throw new HubException("You are not a participant in this conversation");
                }

                // Create message in database
                var message = await _chatService.CreateMessage(new CreateMessageDto
                {
                    ConversationId = request.ConversationId,
                    SenderId = userId,
                    Content = request.Content,
                    MessageType = request.MessageType
                });

                // Send message to all participants in the conversation
                await Clients.Group($"Conversation_{request.ConversationId}")
                    .SendAsync("ReceiveMessage", new
                    {
                        Id = message.Id,
                        ConversationId = message.ConversationId,
                        SenderId = message.SenderId,
                        SenderName = message.SenderName,
                        SenderAvatar = message.SenderAvatar,
                        Content = message.Content,
                        MessageType = message.MessageType,
                        Timestamp = message.Timestamp,
                        IsRead = false
                    });

                // Send push notifications to offline users
                var participants = await _chatService.GetConversationParticipants(request.ConversationId);
                var offlineParticipants = participants.Where(p => p.Id != userId && !p.IsOnline);
                
                foreach (var participant in offlineParticipants)
                {
                    // Send push notification (implement based on your notification service)
                    await SendPushNotification(participant.Id, $"New message from {message.SenderName}", message.Content);
                }

                _logger.LogInformation($"Message sent by {userId} to conversation {request.ConversationId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending message from user {userId}");
                await Clients.Caller.SendAsync("MessageError", "Failed to send message");
                throw;
            }
        }

        /// <summary>
        /// Edit an existing message
        /// </summary>
        public async Task EditMessage(string messageId, string newContent)
        {
            var userId = Context.UserIdentifier;
            
            try
            {
                var message = await _chatService.GetMessage(messageId);
                if (message == null)
                {
                    throw new HubException("Message not found");
                }

                if (message.SenderId != userId)
                {
                    throw new HubException("You can only edit your own messages");
                }

                var updatedMessage = await _chatService.EditMessage(messageId, newContent);

                // Notify all participants in the conversation
                await Clients.Group($"Conversation_{message.ConversationId}")
                    .SendAsync("MessageEdited", new
                    {
                        Id = updatedMessage.Id,
                        Content = updatedMessage.Content,
                        IsEdited = true,
                        EditedAt = updatedMessage.EditedAt
                    });

                _logger.LogInformation($"Message {messageId} edited by user {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error editing message {messageId} by user {userId}");
                await Clients.Caller.SendAsync("MessageError", "Failed to edit message");
                throw;
            }
        }

        /// <summary>
        /// Delete a message
        /// </summary>
        public async Task DeleteMessage(string messageId)
        {
            var userId = Context.UserIdentifier;
            
            try
            {
                var message = await _chatService.GetMessage(messageId);
                if (message == null)
                {
                    throw new HubException("Message not found");
                }

                if (message.SenderId != userId)
                {
                    throw new HubException("You can only delete your own messages");
                }

                await _chatService.DeleteMessage(messageId);

                // Notify all participants in the conversation
                await Clients.Group($"Conversation_{message.ConversationId}")
                    .SendAsync("MessageDeleted", messageId);

                _logger.LogInformation($"Message {messageId} deleted by user {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting message {messageId} by user {userId}");
                await Clients.Caller.SendAsync("MessageError", "Failed to delete message");
                throw;
            }
        }

        #endregion

        #region Message Status

        /// <summary>
        /// Mark messages as read
        /// </summary>
        public async Task MarkAsRead(string conversationId, string[] messageIds)
        {
            var userId = Context.UserIdentifier;
            
            try
            {
                await _chatService.MarkMessagesAsRead(userId, messageIds);

                // Notify message senders about read status
                foreach (var messageId in messageIds)
                {
                    await Clients.Group($"Conversation_{conversationId}")
                        .SendAsync("MessageDelivered", new
                        {
                            MessageId = messageId,
                            Status = "read",
                            Timestamp = DateTime.UtcNow
                        });
                }

                _logger.LogInformation($"User {userId} marked {messageIds.Length} messages as read in conversation {conversationId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error marking messages as read by user {userId}");
            }
        }

        #endregion

        #region Typing Indicators

        /// <summary>
        /// Set typing status for a conversation
        /// </summary>
        public async Task SetTyping(string conversationId, bool isTyping)
        {
            var userId = Context.UserIdentifier;
            var user = await _chatService.GetUser(userId);
            
            // Notify other participants about typing status
            await Clients.GroupExcept($"Conversation_{conversationId}", Context.ConnectionId)
                .SendAsync("UserTyping", new
                {
                    ConversationId = conversationId,
                    UserId = userId,
                    UserName = user.Name,
                    IsTyping = isTyping
                });
        }

        #endregion

        #region Private Methods

        private async Task SendPushNotification(string userId, string title, string body)
        {
            // Implement push notification logic here
            // This could integrate with Firebase, OneSignal, or other push notification services
            _logger.LogInformation($"Would send push notification to user {userId}: {title}");
        }

        #endregion
    }

    #region DTOs

    public class SendMessageRequest
    {
        public string ConversationId { get; set; }
        public string Content { get; set; }
        public string MessageType { get; set; } = "text";
    }

    public class CreateMessageDto
    {
        public string ConversationId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public string MessageType { get; set; }
    }

    #endregion
}
