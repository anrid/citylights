import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  // API configuration - simplified for local development
  const API_HOST = 'localhost'
  const API_PORT = '3001'
  
  const serverConfig = {
    host: '0.0.0.0',
    port: 8999,
    open: false,
  }

  return {
    plugins: [
      react({
        include: "**/*.{js,jsx,ts,tsx}",
        jsxImportSource: undefined
      })
    ],
    
    esbuild: {
      include: [/\.jsx?$/, /\.tsx?$/],
      exclude: [],
      loader: 'jsx'
    },
    
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    
    root: 'app',
    
    publicDir: 'public',
    
    server: serverConfig,
    
    build: {
      outDir: '../build',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'app/index.html')
        },
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            ui: ['react-motion', 'react-draggable', 'react-resizable'],
            utils: ['moment', 'lodash.debounce', 'classnames']
          }
        }
      },
      chunkSizeWarningLimit: 600
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: [path.resolve(__dirname, 'app/styles')]
        }
      }
    },
    
    define: {
      'window.Config': JSON.stringify({
        API_URL: isProduction 
          ? `//${process.env.CITYLIGHTS_CDN || 'citylights.io'}`
          : `//${API_HOST}:${API_PORT}`
      }),
      global: 'globalThis'
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'app')
      }
    }
  }
})