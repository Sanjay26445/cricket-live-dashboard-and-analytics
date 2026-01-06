import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cricket-live-dashboard-and-analytics/',
  plugins: [react()],
})
