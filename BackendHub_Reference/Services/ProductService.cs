using AlohaMarket.Models;
using System.Text.Json;

namespace AlohaMarket.Services
{
    public class ProductService : IProductService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<ProductService> _logger;
        private readonly string _productServiceBaseUrl;

        public ProductService(HttpClient httpClient, IConfiguration configuration, ILogger<ProductService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _productServiceBaseUrl = configuration["ExternalServices:ProductService:BaseUrl"] ?? throw new ArgumentNullException("ProductService BaseUrl not configured");
            
            // Configure default headers
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<ProductDto> GetProductByIdAsync(string productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_productServiceBaseUrl}/api/products/{productId}");
                
                if (!response.IsSuccessStatusCode)
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        _logger.LogWarning("Product with ID {ProductId} not found", productId);
                        return null;
                    }
                    
                    _logger.LogError("Failed to fetch product {ProductId}. Status: {StatusCode}", productId, response.StatusCode);
                    throw new HttpRequestException($"Failed to fetch product: {response.StatusCode}");
                }

                var jsonContent = await response.Content.ReadAsStringAsync();
                var product = JsonSerializer.Deserialize<ProductDto>(jsonContent, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return product;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while fetching product {ProductId}", productId);
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while fetching product {ProductId}", productId);
                throw;
            }
        }

        public async Task<bool> ValidateProductExistsAsync(string productId)
        {
            try
            {
                var response = await _httpClient.HeadAsync($"{_productServiceBaseUrl}/api/products/{productId}");
                return response.IsSuccessStatusCode;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while validating product {ProductId}", productId);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while validating product {ProductId}", productId);
                return false;
            }
        }

        public async Task<bool> ValidateUserOwnsProductAsync(string userId, string productId)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_productServiceBaseUrl}/api/products/{productId}/owner/{userId}");
                return response.IsSuccessStatusCode;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP error occurred while validating product ownership. ProductId: {ProductId}, UserId: {UserId}", productId, userId);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error occurred while validating product ownership. ProductId: {ProductId}, UserId: {UserId}", productId, userId);
                return false;
            }
        }
    }
}
