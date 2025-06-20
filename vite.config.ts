import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    css: {
      postcss: './postcss.config.js',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/layouts': path.resolve(__dirname, 'src/layouts'),
        '@/hooks': path.resolve(__dirname, 'src/hooks'),
        '@/contexts': path.resolve(__dirname, 'src/contexts'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/apis': path.resolve(__dirname, 'src/apis'),
        '@/assets': path.resolve(__dirname, 'src/assets'),
        '@/constants': path.resolve(__dirname, 'src/constants'),
        '@/i18n': path.resolve(__dirname, 'src/i18n'),
        '@/locales': path.resolve(__dirname, 'src/locales'),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          // Payment API proxy
          target: env['VITE_API_PAYMENT_URL'] || 'https://localhost:7131',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            console.log('🔄 Payment API Proxy:', path, '→', path);
            return path;
          },
        },
        '/plans-api': {
          // Plan API proxy - thêm proxy mới cho plan service
          target: env['VITE_API_PLAN_URL'] || 'https://localhost:7007',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => {
            console.log('🔄 Plan API Proxy:', path, '→', path.replace('/plans-api', '/api'));
            return path.replace('/plans-api', '/api'); // /plans-api/plans -> /api/plans
          },
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            query: ['@tanstack/react-query'],
            forms: ['react-hook-form', 'yup', '@hookform/resolvers'],
          },
        },
      },
    },
  };
});
