import { describe, it, expect, vi } from 'vitest';
import { productsApi } from '@/apis/products';

// Mock the API client
vi.mock('@/apis/client', () => ({
  api: {
    get: vi.fn(),
  },
}));

describe('Marketplace API', () => {
  it('should transform API response correctly', async () => {
    const mockApiResponse = {
      data: [
        {
          ad_id: 167871936,
          list_id: 125299624,
          list_time: 1748517647000,
          state: 'accepted',
          type: 's',
          account_name: 'Xe Máy Chính Hãng',
          price: 50000000,
          image: 'https://example.com/image.jpg',
          region_name: 'Hồ Chí Minh',
          subject: 'Honda Wave Alpha 110cc'
        }
      ]
    };

    // Mock the API call
    const { api } = await import('@/apis/client');
    vi.mocked(api.get).mockResolvedValue(mockApiResponse);

    const result = await productsApi.getMarketplaceListings(8);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: '167871936',
      subject: 'Xe Máy Chính Hãng',
      price: 50000000,
      webp_image: 'https://example.com/image.jpg',
      region_name: 'Hồ Chí Minh',
      date: expect.any(String),
      seller_info: {
        full_name: 'Xe Máy Chính Hãng',
        avatar: '/placeholder-avatar.png'
      }
    });
  });

  it('should handle empty response gracefully', async () => {
    // Mock empty response
    const { api } = await import('@/apis/client');
    vi.mocked(api.get).mockResolvedValue({ data: [] });

    const result = await productsApi.getMarketplaceListings(8);

    expect(result).toEqual([]);
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    const { api } = await import('@/apis/client');
    vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

    const result = await productsApi.getMarketplaceListings(8);

    expect(result).toEqual([]);
  });
});
