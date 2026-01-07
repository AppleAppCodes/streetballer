import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    // Inject the API key from environment variables during build
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    // Base path for GitHub Pages
    base: './', 
    build: {
      outDir: 'dist',
    }
  }
})