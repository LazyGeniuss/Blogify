import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      allowedHosts: ["386f-122-179-140-29.ngrok-free", "86bf-122-179-140-29.ngrok-free.app"]
    },
    define: {
      'process.env': env
    }
  }
})
