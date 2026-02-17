import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    lib: {
      entry: 'src/widget-entry.jsx',
      name: 'LearningCurveChat',
      fileName: 'widget',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'widget.[ext]',
      },
    },
  },
})
