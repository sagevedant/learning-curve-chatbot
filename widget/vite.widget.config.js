import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separate config for building the embeddable widget.js
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist-widget',
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
