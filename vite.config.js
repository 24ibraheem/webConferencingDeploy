import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/api': 'https://backend-new-eeg9dkhqgbe3hrfg.centralindia-01.azurewebsites.net/'
    }
  }
})