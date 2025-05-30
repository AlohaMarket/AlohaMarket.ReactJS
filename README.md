# Aloha Market - E-commerce Web Application

A modern, responsive e-commerce web application built with React 19, TypeScript, and Tailwind CSS. Inspired by Shopee's design and functionality.

## 🚀 Features

- **Modern Tech Stack**: React 19, TypeScript, Vite with SWC
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: React Router DOM v7 with lazy loading
- **Forms**: React Hook Form with Yup validation
- **Internationalization**: Multi-language support (English/Vietnamese)
- **Testing**: Vitest with React Testing Library
- **API Mocking**: MSW (Mock Service Worker)
- **Development Tools**: ESLint, Prettier

## 📁 Project Structure

```
src/
├── @types/          # Global TypeScript definitions
├── apis/            # API service functions and endpoints
├── assets/          # Images, icons, and static files
├── components/      # Reusable UI components
│   ├── ui/          # Basic UI components
│   └── common/      # Common components (Header, Footer)
├── constants/       # App constants and configuration
├── contexts/        # React contexts for global state
├── hooks/           # Custom React hooks
├── i18n/            # Internationalization setup
├── layouts/         # Page layout components
├── locales/         # Translation files (EN/VI)
├── pages/           # Page components and routes
│   └── auth/        # Authentication pages
├── test/            # Test setup and mocks
│   └── mocks/       # MSW handlers
├── types/           # TypeScript type definitions
├── utils/           # Utility functions and helpers
├── App.tsx          # Main App component
├── main.tsx         # Application entry point
└── useRouteElements.tsx # Route configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aloha-market
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run analyze` - Analyze bundle size

## 🎨 Styling

### Tailwind CSS Configuration

The project uses a custom Tailwind configuration with:

- **Primary Colors**: Shopee's signature orange (#ee4d2d)
- **Custom Breakpoints**: xs, sm, md, lg, xl, 2xl
- **Custom Animations**: fade-in, slide-up, slide-down, bounce-gentle
- **Typography**: Inter (sans) and Poppins (display) fonts

### Color Palette

```css
primary: {
  500: '#ee4d2d', /* Shopee Orange */
  /* ... other shades */
}
```

## 🌐 Internationalization

The app supports multiple languages using react-i18next:

- **English** (default)
- **Vietnamese**

Language files are located in `src/locales/`:
- `en.json` - English translations
- `vi.json` - Vietnamese translations

## 🔧 API Integration

### API Client

The project uses Axios with custom interceptors for:
- Authentication token management
- Error handling
- Request/response transformation

### API Services

- `authApi` - Authentication endpoints
- `productsApi` - Product management
- More services can be added in `src/apis/`

## 🧪 Testing

### Test Setup

- **Framework**: Vitest
- **Testing Library**: React Testing Library
- **Mocking**: MSW (Mock Service Worker)

### Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## 🔒 TypeScript Configuration

Strict TypeScript configuration with:
- Path aliases (`@/` for `src/`)
- Strict type checking
- Modern ES features support

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Platforms

The project is configured for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**

## 🛡️ Security

- Input validation with Yup schemas
- XSS protection with React's built-in escaping
- CSRF protection for API calls
- Secure authentication token storage

## 📈 Performance

- **Code Splitting**: Lazy loading with React.lazy()
- **Bundle Optimization**: Manual chunks configuration
- **Image Optimization**: WebP support
- **Caching**: React Query for server state caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Write tests for new features
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Shopee's design and user experience
- Built with modern React ecosystem tools
- Community-driven open source libraries

## 📞 Support

For support, email support@alohamarket.com or create an issue in the repository.

---

**Happy coding! 🎉**
