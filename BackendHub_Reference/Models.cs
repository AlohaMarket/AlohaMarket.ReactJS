using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace AlohaMarket.Models
{
    // External service DTOs - These come from other microservices
    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public bool IsOnline { get; set; }
        public DateTime LastSeenAt { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ProductDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public string SellerId { get; set; }
        public string SellerName { get; set; }
        public string SellerEmail { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }public class Conversation
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        [BsonElement("conversationType")]
        [Required]
        public string ConversationType { get; set; } // "buyer_seller" or "support"
        
        [BsonElement("productId")]
        public string ProductId { get; set; }
        
        [BsonElement("lastMessageAt")]
        public DateTime LastMessageAt { get; set; }
        
        [BsonElement("isActive")]
        public bool IsActive { get; set; }
        
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; }
        
        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; }

        // Embedded participants instead of separate collection
        [BsonElement("participants")]
        public List<ConversationParticipant> Participants { get; set; } = new List<ConversationParticipant>();

        // Embedded product context for performance
        [BsonElement("productContext")]
        public ProductContext ProductContext { get; set; }
    }

    public class ConversationParticipant
    {
        [BsonElement("userId")]
        [Required]
        public string UserId { get; set; }
        
        [BsonElement("userName")]
        public string UserName { get; set; }
        
        [BsonElement("userEmail")]
        public string UserEmail { get; set; }
        
        [BsonElement("userAvatar")]
        public string UserAvatar { get; set; }
        
        [BsonElement("joinedAt")]
        public DateTime JoinedAt { get; set; }
        
        [BsonElement("lastReadAt")]
        public DateTime LastReadAt { get; set; }
        
        [BsonElement("isOnline")]
        public bool IsOnline { get; set; }
    }

    public class ProductContext
    {
        [BsonElement("productId")]
        public string ProductId { get; set; }
        
        [BsonElement("productName")]
        public string ProductName { get; set; }
        
        [BsonElement("productImage")]
        public string ProductImage { get; set; }
        
        [BsonElement("productPrice")]
        public decimal ProductPrice { get; set; }
        
        [BsonElement("sellerId")]
        public string SellerId { get; set; }
        
        [BsonElement("sellerName")]
        public string SellerName { get; set; }
    }    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        [BsonElement("conversationId")]
        [Required]
        public string ConversationId { get; set; }
        
        [BsonElement("senderId")]
        [Required]
        public string SenderId { get; set; }
        
        [BsonElement("senderName")]
        public string SenderName { get; set; }
        
        [BsonElement("senderAvatar")]
        public string SenderAvatar { get; set; }
        
        [BsonElement("content")]
        [Required]
        public string Content { get; set; }
        
        [BsonElement("messageType")]
        public string MessageType { get; set; } // "text", "image", "file"
        
        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }
        
        [BsonElement("isRead")]
        public bool IsRead { get; set; }
        
        [BsonElement("isEdited")]
        public bool IsEdited { get; set; }
        
        [BsonElement("editedAt")]
        public DateTime? EditedAt { get; set; }
        
        [BsonElement("replyToMessageId")]
        public string ReplyToMessageId { get; set; }

        // Embedded reply context for better performance
        [BsonElement("replyTo")]
        public MessageReplyContext ReplyTo { get; set; }

        // Read status by participants
        [BsonElement("readBy")]
        public List<MessageReadStatus> ReadBy { get; set; } = new List<MessageReadStatus>();
    }

    public class MessageReplyContext
    {
        [BsonElement("messageId")]
        public string MessageId { get; set; }
        
        [BsonElement("content")]
        public string Content { get; set; }
        
        [BsonElement("senderName")]
        public string SenderName { get; set; }
        
        [BsonElement("timestamp")]
        public DateTime Timestamp { get; set; }
    }    public class MessageReadStatus
    {
        [BsonElement("userId")]
        public string UserId { get; set; }
        
        [BsonElement("readAt")]
        public DateTime ReadAt { get; set; }
    }

    // External service interfaces for dependency injection
    public interface IUserService
    {
        Task<UserDto> GetUserByIdAsync(string userId);
        Task<List<UserDto>> GetUsersByIdsAsync(List<string> userIds);
        Task<bool> ValidateUserExistsAsync(string userId);
    }

    public interface IProductService
    {
        Task<ProductDto> GetProductByIdAsync(string productId);
        Task<bool> ValidateProductExistsAsync(string productId);
        Task<bool> ValidateUserOwnsProductAsync(string userId, string productId);
    }
}
