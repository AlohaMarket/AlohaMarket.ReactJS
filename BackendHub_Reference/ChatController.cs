using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Driver;
using System.Security.Claims;
using AlohaMarket.Data;
using AlohaMarket.Models;
using AlohaMarket.Services;

namespace AlohaMarket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(IChatService chatService, ILogger<ChatController> logger)
        {
            _chatService = chatService;
            _logger = logger;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier);

        #region Conversations

        [HttpGet("conversations")]
        public async Task<IActionResult> GetConversations()
        {
            try
            {
                var userId = GetUserId();
                var conversations = await _chatService.GetUserConversations(userId);
                
                return Ok(new
                {
                    conversations = conversations,
                    total = conversations.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving conversations for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }        [HttpPost("conversations")]
        public async Task<IActionResult> CreateConversation([FromBody] CreateConversationDto dto)
        {
            try
            {
                var userId = GetUserId();
                
                // Ensure current user is in participants
                if (!dto.ParticipantIds.Contains(userId))
                {
                    dto.ParticipantIds.Add(userId);
                }

                var conversation = await _chatService.CreateConversation(dto);
                
                return CreatedAtAction(nameof(GetConversation), new { id = conversation.Id }, conversation);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating conversation");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("conversations/{id}")]
        public async Task<IActionResult> GetConversation(string id)
        {
            try
            {
                var userId = GetUserId();
                
                // Check if user is participant
                var isParticipant = await _chatService.IsUserInConversation(userId, id);
                if (!isParticipant)
                {
                    return Forbid("You are not a participant in this conversation");
                }

                var participants = await _chatService.GetConversationParticipants(id);
                
                return Ok(new
                {
                    id = id,
                    participants = participants
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving conversation {ConversationId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion

        #region Messages

        [HttpGet("conversations/{conversationId}/messages")]
        public async Task<IActionResult> GetMessages(
            string conversationId,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var userId = GetUserId();
                
                // Check if user is participant
                var isParticipant = await _chatService.IsUserInConversation(userId, conversationId);
                if (!isParticipant)
                {
                    return Forbid("You are not a participant in this conversation");
                }

                var messages = await _chatService.GetConversationMessages(conversationId, page, pageSize);
                
                return Ok(new
                {
                    messages = messages,
                    page = page,
                    pageSize = pageSize,
                    total = messages.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving messages for conversation {ConversationId}", conversationId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
        {
            try
            {
                var userId = GetUserId();
                dto.SenderId = userId; // Ensure sender is current user
                
                // Check if user is participant
                var isParticipant = await _chatService.IsUserInConversation(userId, dto.ConversationId);
                if (!isParticipant)
                {
                    return Forbid("You are not a participant in this conversation");
                }

                var message = await _chatService.CreateMessage(dto);
                
                return CreatedAtAction(nameof(GetMessage), new { id = message.Id }, message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpGet("messages/{id}")]
        public async Task<IActionResult> GetMessage(string id)
        {
            try
            {
                var message = await _chatService.GetMessage(id);
                if (message == null)
                {
                    return NotFound();
                }

                var userId = GetUserId();
                
                // Check if user is participant in the conversation
                var isParticipant = await _chatService.IsUserInConversation(userId, message.ConversationId);
                if (!isParticipant)
                {
                    return Forbid("You are not a participant in this conversation");
                }

                return Ok(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving message {MessageId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPut("messages/{id}")]
        public async Task<IActionResult> EditMessage(string id, [FromBody] EditMessageDto dto)
        {
            try
            {
                var userId = GetUserId();
                var message = await _chatService.GetMessage(id);
                
                if (message == null)
                {
                    return NotFound();
                }

                // Only sender can edit their message
                if (message.SenderId != userId)
                {
                    return Forbid("You can only edit your own messages");
                }

                var updatedMessage = await _chatService.EditMessage(id, dto.Content);
                
                return Ok(updatedMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error editing message {MessageId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpDelete("messages/{id}")]
        public async Task<IActionResult> DeleteMessage(string id)
        {
            try
            {
                var userId = GetUserId();
                var message = await _chatService.GetMessage(id);
                
                if (message == null)
                {
                    return NotFound();
                }

                // Only sender can delete their message
                if (message.SenderId != userId)
                {
                    return Forbid("You can only delete your own messages");
                }

                await _chatService.DeleteMessage(id);
                
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting message {MessageId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        [HttpPost("messages/mark-read")]
        public async Task<IActionResult> MarkMessagesAsRead([FromBody] MarkMessagesReadDto dto)
        {
            try
            {
                var userId = GetUserId();
                
                // Validate that user can access all these messages
                foreach (var messageId in dto.MessageIds)
                {
                    var message = await _chatService.GetMessage(messageId);
                    if (message != null)
                    {
                        var isParticipant = await _chatService.IsUserInConversation(userId, message.ConversationId);
                        if (!isParticipant)
                        {
                            return Forbid($"You are not a participant in conversation for message {messageId}");
                        }
                    }
                }

                await _chatService.MarkMessagesAsRead(userId, dto.MessageIds);
                
                return Ok(new { message = "Messages marked as read" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking messages as read");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        #endregion
    }

    // DTOs for API requests
    public class EditMessageDto
    {
        public string Content { get; set; }
    }    public class MarkMessagesReadDto
    {
        public string[] MessageIds { get; set; }
    }
}
