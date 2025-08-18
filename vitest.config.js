import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test-setup.js'],
    css: true,
    testTimeout: 30000,
    hookTimeout: 30000,
    include: [
      'app/**/*.{test,spec}.{js,jsx,ts,tsx}',
      'api/**/*.{test,spec}.{js,jsx,ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.test.{js,jsx,ts,tsx}',
        '**/*.spec.{js,jsx,ts,tsx}',
        '**/testUtils.*'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@api': path.resolve(__dirname, './api')
    }
  }
})