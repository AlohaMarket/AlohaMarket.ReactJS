using MongoDB.Driver;
using AlohaMarket.Models;

namespace AlohaMarket.Data
{
    public interface IMongoDbContext
    {
        IMongoDatabase Database { get; }
        IMongoCollection<Conversation> Conversations { get; }
        IMongoCollection<Message> Messages { get; }
    }

    public class MongoDbContext : IMongoDbContext
    {
        public IMongoDatabase Database { get; }
        public IMongoCollection<Conversation> Conversations { get; }
        public IMongoCollection<Message> Messages { get; }

        public MongoDbContext(IMongoDatabase database)
        {
            Database = database;
            Conversations = database.GetCollection<Conversation>("conversations");
            Messages = database.GetCollection<Message>("messages");

            // Create indexes for better performance
            CreateIndexes();
        }

        private void CreateIndexes()
        {
            // Conversation indexes
            var conversationParticipantIndex = Builders<Conversation>.IndexKeys
                .Ascending("participants.userId");
            Conversations.Indexes.CreateOneAsync(new CreateIndexModel<Conversation>(conversationParticipantIndex));

            var conversationLastMessageIndex = Builders<Conversation>.IndexKeys
                .Descending(c => c.LastMessageAt);
            Conversations.Indexes.CreateOneAsync(new CreateIndexModel<Conversation>(conversationLastMessageIndex));            var conversationProductIndex = Builders<Conversation>.IndexKeys
                .Ascending(c => c.ProductId);
            Conversations.Indexes.CreateOneAsync(new CreateIndexModel<Conversation>(conversationProductIndex));

            // Message indexes
            var messageConversationIndex = Builders<Message>.IndexKeys
                .Ascending(m => m.ConversationId)
                .Descending(m => m.Timestamp);
            Messages.Indexes.CreateOneAsync(new CreateIndexModel<Message>(messageConversationIndex));

            var messageSenderIndex = Builders<Message>.IndexKeys.Ascending(m => m.SenderId);
            Messages.Indexes.CreateOneAsync(new CreateIndexModel<Message>(messageSenderIndex));

            var messageReplyIndex = Builders<Message>.IndexKeys.Ascending(m => m.ReplyToMessageId);
            Messages.Indexes.CreateOneAsync(new CreateIndexModel<Message>(messageReplyIndex));
        }
    }

    // MongoDB configuration settings
    public class MongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
