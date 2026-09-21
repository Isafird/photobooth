import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Sudah disesuaikan untuk repo github.com/Isafird/photobooth
// Kalau nanti pindah repo, ganti '/photobooth/' jadi '/<nama-repo-baru>/'
export default defineConfig({
  plugins: [react()],
  base: '/photobooth/',
})
