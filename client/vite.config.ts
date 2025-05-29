import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["386f-122-179-140-29.ngrok-free", "86bf-122-179-140-29.ngrok-free.app"]
  }
})
