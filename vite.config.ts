import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    // Skip type checking during build
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
