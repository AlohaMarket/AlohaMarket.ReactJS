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
          // Khi frontend gọi bất kỳ URL nào bắt đầu bằng /api (ví dụ: /api/Payment/payment-url)
          target: env['VITE_API_TARGET'] || 'https://localhost:7131', // Sẽ được forward đến https://localhost:7131
          changeOrigin: true,
          secure: false,
          // Bỏ rewrite hoặc sửa lại. Nếu bỏ, Vite sẽ nối path gốc (/api/Payment/payment-url) vào target.
          // Kết quả: https://localhost:7131/api/Payment/payment-url
          // Hoặc nếu bạn muốn giữ log:
          rewrite: (path) => {
            console.log('🔄 Proxy rewriting (no change):', path, '→', path); // Path không đổi
            return path; // Trả về path gốc
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
