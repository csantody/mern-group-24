import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.API_TARGET || 'https://accelly.helpoasis.org',
          changeOrigin: true,
          auth: env.API_AUTH,
        },
      },
    },
  }
})