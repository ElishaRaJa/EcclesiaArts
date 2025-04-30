import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();  // Ensure dotenv is used correctly

export default defineConfig({
  plugins: [react()],
  base: '/EcclesiaArts/',  // Specify the repo name here (if the repo name is EcclesiaArts)
})
