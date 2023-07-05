import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : 'packages/options/dist/',
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}))
