using AlohaMarket.Models;
using System.Text.Json;

namespace AlohaMarket.Services
{
    public class UserService : IUserService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<UserService> _logger;
        private readonly string _userServiceBaseUrl;

        public UserService(HttpClient httpClient, IConfiguration configuration, ILogger<UserService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _userServiceBaseUrl = configuration["ExternalServices:UserService:BaseUrl"] ?? throw new ArgumentNullException("UserService BaseUrl not configured");
            
            // Configure default headers
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<UserDto> GetUserByIdAsync(string userId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_userServiceBaseUrl}/api/users/{userId}");
                
                if (!response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        _logger.LogWarning("User with ID {UserId} not found", userId);
                        return null;
                    }
                    
                    _logger.LogError("Failed to fetch user {UserId}. Status: {StatusCode}", userId, response.StatusCode);
                    throw new HttpRequestException($"Failed to fetch user: {response.StatusCode}");
                }

                var jsonContent = await response.Content.ReadAsStringAsync();
                var user = JsonSerializer.Deserialize<UserDto>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return user;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while fetching user {UserId}", userId);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while fetching user {UserId}", userId);
                throw;
            }
        }

        public async Task<List<UserDto>> GetUsersByIdsAsync(List<string> userIds)
        {
            try
            {
                if (userIds == null || !userIds.Any())
                {
                    return new List<UserDto>();
                }

                // Use POST request to send list of IDs in body for bulk retrieval
                var jsonContent = JsonSerializer.Serialize(userIds);
                var content = new StringContent(jsonContent, System.Text.Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_userServiceBaseUrl}/api/users/bulk", content);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Failed to fetch users in bulk. Status: {StatusCode}", response.StatusCode);
                    throw new HttpRequestException($"Failed to fetch users: {response.StatusCode}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var users = JsonSerializer.Deserialize<List<UserDto>>(responseContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return users ?? new List<UserDto>();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while fetching users in bulk");
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while fetching users in bulk");
                throw;
            }
        }

        public async Task<bool> ValidateUserExistsAsync(string userId)
        {
            try
            {
                var response = await _httpClient.HeadAsync($"{_userServiceBaseUrl}/api/users/{userId}");
                return response.IsSuccessStatusCode;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while validating user {UserId}", userId);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while validating user {UserId}", userId);
                return false;
            }
        }
    }
}
