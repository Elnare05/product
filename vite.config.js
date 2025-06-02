import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/products',
  plugins: [react()],
  server: {
    open: true,
  }
})