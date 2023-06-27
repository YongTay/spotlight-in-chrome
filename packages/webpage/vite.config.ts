import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ],
  css: {
    modules: {
      scopeBehaviour: 'local',
      generateScopedName: '[name]-[local]-[hash:5]',
      localsConvention: 'camelCase'
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        manualChunks: () => 'index'
      }
    }
  }
})
