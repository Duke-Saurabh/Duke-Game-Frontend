import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      // '/api': 'https://duke-game-backend.vercel.app',
      '/api': 'http://localhost:3000',
        
    },
  },
  plugins: [react()],
})
