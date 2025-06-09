import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '5173-itrod78xwnexz2yeyodur-8e3f49e7.manusvm.computer',
      '.manusvm.computer'
    ]
  }
})

