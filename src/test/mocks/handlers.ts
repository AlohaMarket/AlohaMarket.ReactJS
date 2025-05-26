import { http, HttpResponse } from 'msw';

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: {
        id: '2',
        email: 'newuser@example.com',
        name: 'New User',
        avatar: null,
      },
      token: 'mock-jwt-token',
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // Products endpoints
  http.get('/api/products', () => {
    return HttpResponse.json({
      data: [
        {
          id: '1',
          name: 'Sample Product 1',
          price: 29.99,
          image: '/images/product1.jpg',
          category: 'Electronics',
          rating: 4.5,
          reviews: 123,
        },
        {
          id: '2',
          name: 'Sample Product 2',
          price: 49.99,
          image: '/images/product2.jpg',
          category: 'Fashion',
          rating: 4.2,
          reviews: 89,
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5,
      },
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const { id } = params;
    return HttpResponse.json({
      id,
      name: `Product ${id}`,
      price: 29.99,
      image: `/images/product${id}.jpg`,
      category: 'Electronics',
      rating: 4.5,
      reviews: 123,
      description: 'This is a sample product description.',
      specifications: {
        brand: 'Sample Brand',
        model: 'Model X',
        warranty: '1 year',
      },
    });
  }),

  // Cart endpoints
  http.get('/api/cart', () => {
    return HttpResponse.json({
      items: [
        {
          id: '1',
          productId: '1',
          quantity: 2,
          price: 29.99,
          product: {
            name: 'Sample Product 1',
            image: '/images/product1.jpg',
          },
        },
      ],
      total: 59.98,
    });
  }),

  http.post('/api/cart/add', () => {
    return HttpResponse.json({ message: 'Item added to cart' });
  }),

  http.put('/api/cart/update/:id', () => {
    return HttpResponse.json({ message: 'Cart item updated' });
  }),

  http.delete('/api/cart/remove/:id', () => {
    return HttpResponse.json({ message: 'Item removed from cart' });
  }),
]; 