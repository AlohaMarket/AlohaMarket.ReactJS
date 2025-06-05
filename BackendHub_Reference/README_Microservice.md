# AlohaMarket Chat Service - Microservice Architecture

This document provides a comprehensive guide for the **Chat Service**, designed as a dedicated microservice in the AlohaMarket ecosystem. The Chat Service handles all chat-related functionality while communicating with external User and Product services.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [External Dependencies](#external-dependencies)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [SignalR Hub](#signalr-hub)
- [Data Models](#data-models)
- [Installation](#installation)
- [Usage](#usage)
- [Microservice Communication](#microservice-communication)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

## 🏗️ Architecture Overview

### Microservice Architecture

The Chat Service follows a microservice architecture pattern where:

- **Chat Service**: Handles conversations, messages, real-time communication
- **User Service**: Manages user accounts, authentication, user profiles
- **Product Service**: Manages product catalog, product information

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│                 │◄───────────────►│                 │
│  User Service   │                 │  Chat Service   │
│                 │                 │                 │
└─────────────────┘                 └─────────────────┘
                                             ▲
                                             │ HTTP/REST
                                             ▼
                                    ┌─────────────────┐
                                    │                 │
                                    │ Product Service │
                                    │                 │
                                    └─────────────────┘
```

### Technology Stack

- **Backend**: ASP.NET Core 6.0+
- **Database**: MongoDB (Document-based)
- **Real-time**: SignalR for WebSocket connections
- **Authentication**: JWT Bearer tokens
- **Communication**: HTTP REST APIs between services
- **Documentation**: Swagger/OpenAPI

## ✨ Features

### Core Chat Features
- Real-time messaging with SignalR
- Conversation management (1-on-1, group chats)
- Message status tracking (sent, delivered, read)
- Message replies and threading
- Typing indicators
- User presence (online/offline status)
- Message pagination and history

### Product Integration
- Product-based conversations (buyer-seller communication)
- Product context embedding in conversations
- Support conversations

### Microservice Features
- External service integration via HTTP clients
- Resilient communication with retry policies
- Service validation and health checks
- Centralized logging and monitoring

## 🔗 External Dependencies

### User Service APIs
```
GET    /api/users/{id}           - Get user by ID
POST   /api/users/bulk          - Get multiple users by IDs
HEAD   /api/users/{id}          - Check if user exists
```

### Product Service APIs
```
GET    /api/products/{id}                    - Get product by ID
HEAD   /api/products/{id}                   - Check if product exists
GET    /api/products/{id}/owner/{userId}    - Validate product ownership
```

## 📁 Project Structure

```
AlohaMarket.ChatService/
├── Controllers/
│   └── ChatController.cs           # REST API endpoints
├── Hubs/
│   └── NotificationHub.cs         # SignalR hub for real-time communication
├── Services/
│   ├── ChatService.cs             # Core chat business logic
│   ├── UserService.cs             # External User service client
│   └── ProductService.cs          # External Product service client
├── Models/
│   └── Models.cs                  # Data models and DTOs
├── Data/
│   └── ApplicationDbContext.cs    # MongoDB context
├── Startup.cs                     # Service configuration
├── appsettings.json              # Configuration settings
├── AlohaMarket.csproj            # Project dependencies
└── README_Microservice.md       # This documentation
```

## ⚙️ Configuration

### appsettings.json

```json
{
  "ConnectionStrings": {
    "MongoDB": "mongodb://localhost:27017"
  },
  "MongoDbSettings": {
    "DatabaseName": "AlohaMarketChat"
  },
  "ExternalServices": {
    "UserService": {
      "BaseUrl": "https://localhost:5001",
      "Timeout": 30
    },
    "ProductService": {
      "BaseUrl": "https://localhost:5002", 
      "Timeout": 30
    }
  },
  "Jwt": {
    "Key": "YourSecretKeyHere_MakeItLongAndSecure_AtLeast32Characters",
    "Issuer": "AlohaMarket",
    "Audience": "AlohaMarketUsers",
    "ExpiryMinutes": 60
  }
}
```

### Environment Variables

For production deployment, use environment variables:

```bash
# MongoDB
MONGODB_CONNECTION_STRING=mongodb://your-mongo-server:27017
MONGODB_DATABASE_NAME=AlohaMarketChat

# External Services
USER_SERVICE_BASE_URL=https://user-service.example.com
PRODUCT_SERVICE_BASE_URL=https://product-service.example.com

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ISSUER=AlohaMarket
JWT_AUDIENCE=AlohaMarketUsers
```

## 🛠️ API Endpoints

### Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/conversations` | Get user's conversations |
| POST | `/api/chat/conversations` | Create new conversation |
| GET | `/api/chat/conversations/{id}` | Get conversation details |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/conversations/{id}/messages` | Get conversation messages |
| POST | `/api/chat/messages` | Send new message |
| GET | `/api/chat/messages/{id}` | Get specific message |
| PUT | `/api/chat/messages/{id}` | Edit message |
| DELETE | `/api/chat/messages/{id}` | Delete message |
| POST | `/api/chat/messages/mark-read` | Mark messages as read |

### Request/Response Examples

#### Create Conversation
```http
POST /api/chat/conversations
Content-Type: application/json
Authorization: Bearer {jwt-token}

{
  "conversationType": "buyer_seller",
  "participantIds": ["user1", "user2"],
  "productId": "product123"
}
```

#### Send Message
```http
POST /api/chat/messages
Content-Type: application/json
Authorization: Bearer {jwt-token}

{
  "conversationId": "conv123",
  "content": "Hello, is this product still available?",
  "messageType": "text",
  "replyToMessageId": null
}
```

## 🔄 SignalR Hub

### Connection
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("jwt")
    })
    .build();
```

### Hub Methods

#### Client to Server
- `JoinConversation(conversationId)` - Join conversation room
- `LeaveConversation(conversationId)` - Leave conversation room
- `SendMessage(conversationId, content, messageType)` - Send message
- `TypingStarted(conversationId)` - Indicate typing started
- `TypingStopped(conversationId)` - Indicate typing stopped

#### Server to Client
- `ReceiveMessage(message)` - New message received
- `MessageStatusChanged(messageId, status)` - Message status updated
- `UserStatusChanged(userId, isOnline)` - User online status changed
- `UserTyping(userId, conversationId)` - User typing indicator
- `UserStoppedTyping(userId, conversationId)` - User stopped typing

## 📊 Data Models

### Core Models (Chat Service owns these)

#### Conversation
```csharp
public class Conversation
{
    public string Id { get; set; }
    public string ConversationType { get; set; } // "buyer_seller" or "support"
    public string ProductId { get; set; }
    public DateTime LastMessageAt { get; set; }
    public bool IsActive { get; set; }
    public List<ConversationParticipant> Participants { get; set; }
    public ProductContext ProductContext { get; set; } // Cached product data
}
```

#### Message
```csharp
public class Message
{
    public string Id { get; set; }
    public string ConversationId { get; set; }
    public string SenderId { get; set; }
    public string SenderName { get; set; } // Cached from User service
    public string Content { get; set; }
    public string MessageType { get; set; }
    public DateTime Timestamp { get; set; }
    public MessageReplyContext ReplyTo { get; set; }
    public List<MessageReadStatus> ReadBy { get; set; }
}
```

### External Service DTOs

#### UserDto (from User Service)
```csharp
public class UserDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Avatar { get; set; }
    public bool IsOnline { get; set; }
}
```

#### ProductDto (from Product Service)
```csharp
public class ProductDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; }
    public string SellerId { get; set; }
}
```

## 🚀 Installation

### Prerequisites
- .NET 6.0 SDK or later
- MongoDB 4.4 or later
- User Service running on configured URL
- Product Service running on configured URL

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd AlohaMarket.ChatService
```

2. **Install dependencies**
```bash
dotnet restore
```

3. **Configure settings**
```bash
# Edit appsettings.json with your MongoDB and service URLs
# Or set environment variables
```

4. **Run the application**
```bash
dotnet run
```

The service will be available at `https://localhost:5003` (or configured port).

## 💻 Usage

### Starting the Service

1. **Development**
```bash
dotnet run --environment Development
```

2. **Production**
```bash
dotnet run --environment Production
```

### Docker Deployment

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["AlohaMarket.ChatService.csproj", "."]
RUN dotnet restore
COPY . .
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AlohaMarket.ChatService.dll"]
```

## 🔗 Microservice Communication

### Service Discovery

In production, consider implementing:
- **Consul** for service discovery
- **Eureka** for Netflix stack
- **Kubernetes Services** for container environments

### Resilience Patterns

The service implements several resilience patterns:

1. **Circuit Breaker**: Prevents cascading failures
2. **Retry Policy**: Handles transient failures
3. **Timeout**: Prevents hanging requests
4. **Bulkhead**: Isolates critical operations

### Health Checks

Implement health check endpoints:
```csharp
// In Startup.cs
services.AddHealthChecks()
    .AddMongoDb(connectionString)
    .AddUrlGroup(new Uri(userServiceUrl), "user-service")
    .AddUrlGroup(new Uri(productServiceUrl), "product-service");
```

## 🧪 Testing

### Unit Tests
```bash
dotnet test AlohaMarket.ChatService.Tests
```

### Integration Tests
```bash
dotnet test AlohaMarket.ChatService.IntegrationTests
```

### Load Testing
Use tools like:
- **Artillery** for load testing
- **NBomber** for .NET-specific testing
- **K6** for performance testing

## 📈 Monitoring

### Logging
- **Serilog** for structured logging
- **ELK Stack** for log aggregation
- **Application Insights** for Azure environments

### Metrics
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **Custom metrics** for business KPIs

### Tracing
- **Jaeger** for distributed tracing
- **Zipkin** as alternative
- **OpenTelemetry** for observability

## 🚢 Deployment

### Environment Checklist

#### Development
- [ ] MongoDB connection configured
- [ ] User/Product services accessible
- [ ] JWT configuration set
- [ ] CORS configured for frontend

#### Production
- [ ] Secure MongoDB connection (SSL/TLS)
- [ ] Service discovery configured
- [ ] Load balancer configured
- [ ] SSL certificates installed
- [ ] Monitoring and logging configured
- [ ] Health checks implemented
- [ ] Backup strategy in place

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chat-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chat-service
  template:
    metadata:
      labels:
        app: chat-service
    spec:
      containers:
      - name: chat-service
        image: alohamarket/chat-service:latest
        ports:
        - containerPort: 80
        env:
        - name: MONGODB_CONNECTION_STRING
          valueFrom:
            secretKeyRef:
              name: chat-secrets
              key: mongodb-connection
        - name: USER_SERVICE_BASE_URL
          value: "http://user-service:80"
        - name: PRODUCT_SERVICE_BASE_URL  
          value: "http://product-service:80"
```

## 🛡️ Security

### Authentication
- JWT Bearer token validation
- User identity verification with external User service

### Authorization
- Conversation participation validation
- Message ownership verification
- Resource access control

### Data Protection
- Input validation and sanitization
- SQL injection prevention (N/A for MongoDB)
- XSS protection
- Rate limiting

## 📚 Additional Resources

- [SignalR Documentation](https://docs.microsoft.com/aspnet/signalr/)
- [MongoDB .NET Driver](https://docs.mongodb.com/drivers/csharp/)
- [Microservices Architecture](https://microservices.io/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This Chat Service is designed to work as part of the AlohaMarket microservice ecosystem. Ensure all dependent services are properly configured and running.
