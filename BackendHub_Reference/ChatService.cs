using Microsoft.AspNetCore.SignalR;
using MongoDB.Driver;
using AlohaMarket.Models;

namespace AlohaMarket.Services
{
    public interface IChatService
    {
        // Conversation management
        Task<bool> IsUserInConversation(string userId, string conversationId);
        Task<List<ConversationParticipant>> GetConversationParticipants(string conversationId);
        Task<Conversation> CreateConversation(CreateConversationDto dto);
        Task<List<Conversation>> GetUserConversations(string userId);
        
        // Message management
        Task<Message> CreateMessage(CreateMessageDto dto);
        Task<Message> GetMessage(string messageId);
        Task<List<Message>> GetConversationMessages(string conversationId, int page = 1, int pageSize = 50);
        Task<Message> EditMessage(string messageId, string newContent);
        Task DeleteMessage(string messageId);
        Task MarkMessagesAsRead(string userId, string[] messageIds);
    }

    public class ChatService : IChatService
    {
        private readonly IMongoCollection<Conversation> _conversations;
        private readonly IMongoCollection<Message> _messages;
        private readonly IUserService _userService;
        private readonly IProductService _productService;
        private readonly ILogger<ChatService> _logger;

        public ChatService(
            IMongoDatabase database, 
            IUserService userService,
            IProductService productService,
            ILogger<ChatService> logger)
        {
            _conversations = database.GetCollection<Conversation>("conversations");
            _messages = database.GetCollection<Message>("messages");
            _userService = userService;
            _productService = productService;
            _logger = logger;
        }        public async Task<bool> IsUserInConversation(string userId, string conversationId)
        {
            var conversation = await _conversations
                .Find(c => c.Id == conversationId && c.Participants.Any(p => p.UserId == userId))
                .FirstOrDefaultAsync();
            
            return conversation != null;
        }

        public async Task<List<ConversationParticipant>> GetConversationParticipants(string conversationId)
        {
            var conversation = await _conversations
                .Find(c => c.Id == conversationId)
                .FirstOrDefaultAsync();

            if (conversation == null) return new List<ConversationParticipant>();

            // Update participant data from external user service
            var userIds = conversation.Participants.Select(p => p.UserId).ToList();
            var users = await _userService.GetUsersByIdsAsync(userIds);
            
            // Update participants with fresh user data
            foreach (var participant in conversation.Participants)
            {
                var user = users.FirstOrDefault(u => u.Id == participant.UserId);
                if (user != null)
                {
                    participant.UserName = user.Name;
                    participant.UserEmail = user.Email;
                    participant.UserAvatar = user.Avatar;
                    participant.IsOnline = user.IsOnline;
                }
            }

            return conversation.Participants;
        }

        public async Task<Conversation> CreateConversation(CreateConversationDto dto)
        {
            // Validate users exist
            foreach (var userId in dto.ParticipantIds)
            {
                var userExists = await _userService.ValidateUserExistsAsync(userId);
                if (!userExists)
                {
                    throw new ArgumentException($"User {userId} not found");
                }
            }

            // Validate product exists if specified
            ProductDto product = null;
            if (!string.IsNullOrEmpty(dto.ProductId))
            {
                var productExists = await _productService.ValidateProductExistsAsync(dto.ProductId);
                if (!productExists)
                {
                    throw new ArgumentException($"Product {dto.ProductId} not found");
                }
                product = await _productService.GetProductByIdAsync(dto.ProductId);
            }

            // Get user details for participants
            var users = await _userService.GetUsersByIdsAsync(dto.ParticipantIds);
            
            var conversation = new Conversation
            {
                Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                ConversationType = dto.ConversationType,
                ProductId = dto.ProductId,
                LastMessageAt = DateTime.UtcNow,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Participants = users.Select(user => new ConversationParticipant
                {
                    UserId = user.Id,
                    UserName = user.Name,
                    UserEmail = user.Email,
                    UserAvatar = user.Avatar,
                    JoinedAt = DateTime.UtcNow,
                    LastReadAt = DateTime.UtcNow,
                    IsOnline = user.IsOnline
                }).ToList(),
                ProductContext = product != null ? new ProductContext
                {
                    ProductId = product.Id,
                    ProductName = product.Name,
                    ProductImage = product.ImageUrl,
                    ProductPrice = product.Price,
                    SellerId = product.SellerId,
                    SellerName = product.SellerName
                } : null
            };

            await _conversations.InsertOneAsync(conversation);
            return conversation;
        }

        public async Task<List<Conversation>> GetUserConversations(string userId)
        {
            return await _conversations
                .Find(c => c.Participants.Any(p => p.UserId == userId) && c.IsActive)
                .SortByDescending(c => c.LastMessageAt)
                .ToListAsync();
        }

        public async Task<Message> CreateMessage(CreateMessageDto dto)
        {
            // Validate user exists and get user data
            var user = await _userService.GetUserByIdAsync(dto.SenderId);
            if (user == null) 
            {
                throw new ArgumentException("User not found");
            }
            
            var message = new Message
            {
                Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(),
                ConversationId = dto.ConversationId,
                SenderId = dto.SenderId,
                SenderName = user.Name,
                SenderAvatar = user.Avatar,
                Content = dto.Content,
                MessageType = dto.MessageType ?? "text",
                Timestamp = DateTime.UtcNow,
                IsRead = false,
                ReadBy = new List<MessageReadStatus>()
            };

            // Handle reply context if this is a reply
            if (!string.IsNullOrEmpty(dto.ReplyToMessageId))
            {
                var replyToMessage = await GetMessage(dto.ReplyToMessageId);
                if (replyToMessage != null)
                {
                    message.ReplyToMessageId = dto.ReplyToMessageId;
                    message.ReplyTo = new MessageReplyContext
                    {
                        MessageId = replyToMessage.Id,
                        Content = replyToMessage.Content.Length > 100 
                            ? replyToMessage.Content.Substring(0, 100) + "..." 
                            : replyToMessage.Content,
                        SenderName = replyToMessage.SenderName,
                        Timestamp = replyToMessage.Timestamp
                    };
                }
            }

            await _messages.InsertOneAsync(message);
            
            // Update conversation last message timestamp
            var conversationFilter = Builders<Conversation>.Filter.Eq(c => c.Id, dto.ConversationId);
            var conversationUpdate = Builders<Conversation>.Update
                .Set(c => c.LastMessageAt, message.Timestamp)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            await _conversations.UpdateOneAsync(conversationFilter, conversationUpdate);
            
            return message;
        }        public async Task<Message> GetMessage(string messageId)
        {
            return await _messages.Find(m => m.Id == messageId).FirstOrDefaultAsync();
        }

        public async Task<List<Message>> GetConversationMessages(string conversationId, int page = 1, int pageSize = 50)
        {
            var skip = (page - 1) * pageSize;
            
            return await _messages
                .Find(m => m.ConversationId == conversationId)
                .SortByDescending(m => m.Timestamp)
                .Skip(skip)
                .Limit(pageSize)
                .ToListAsync();
        }

        public async Task<Message> EditMessage(string messageId, string newContent)
        {
            var filter = Builders<Message>.Filter.Eq(m => m.Id, messageId);
            var update = Builders<Message>.Update
                .Set(m => m.Content, newContent)
                .Set(m => m.IsEdited, true)
                .Set(m => m.EditedAt, DateTime.UtcNow);

            await _messages.UpdateOneAsync(filter, update);
            
            return await GetMessage(messageId);
        }

        public async Task DeleteMessage(string messageId)
        {
            var filter = Builders<Message>.Filter.Eq(m => m.Id, messageId);
            await _messages.DeleteOneAsync(filter);
        }

        public async Task MarkMessagesAsRead(string userId, string[] messageIds)
        {
            foreach (var messageId in messageIds)
            {
                var filter = Builders<Message>.Filter.Eq(m => m.Id, messageId);
                var message = await _messages.Find(filter).FirstOrDefaultAsync();
                
                if (message != null && message.SenderId != userId)
                {
                    // Check if user already marked as read
                    var existingRead = message.ReadBy?.FirstOrDefault(rb => rb.UserId == userId);
                    if (existingRead == null)
                    {
                        // Add to ReadBy array
                        var readStatus = new MessageReadStatus
                        {
                            UserId = userId,
                            ReadAt = DateTime.UtcNow
                        };

                        var update = Builders<Message>.Update
                            .Push(m => m.ReadBy, readStatus)
                            .Set(m => m.IsRead, true);

                        await _messages.UpdateOneAsync(filter, update);
                    }
                }
            }
        }
    }    // DTOs for creating conversations and messages
    public class CreateConversationDto
    {
        public string ConversationType { get; set; } // "buyer_seller" or "support"
        public List<string> ParticipantIds { get; set; }
        public string ProductId { get; set; }
    }

    public class CreateMessageDto
    {
        public string ConversationId { get; set; }
        public string SenderId { get; set; }
        public string Content { get; set; }
        public string MessageType { get; set; }
        public string ReplyToMessageId { get; set; }
    }
}
