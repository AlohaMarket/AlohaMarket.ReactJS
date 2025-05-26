/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
    },
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
}); 