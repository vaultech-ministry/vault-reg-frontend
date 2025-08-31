import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['react-chartjs-2', 'chart.js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
