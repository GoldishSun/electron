import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    emptyOutDir: true,
    outDir: 'dist/electron',
    rollupOptions: {
      output: {
        format: 'cjs',
      }
    }
  },
  define: { 'process.env': {} },
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
})
