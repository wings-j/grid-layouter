import Vue from '@vitejs/plugin-vue'
import Path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': Path.resolve(__dirname, 'src')
    }
  },
  build: { outDir: './docs' },
  plugins: [Vue()]
})
