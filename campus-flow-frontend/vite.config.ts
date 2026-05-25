import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig(({ mode }) => {
  const isDocker = process.env.DOCKER === "true";
  const isProduction = mode === 'production';

  return {
    server: {
      open: !isDocker,
      host: 'localhost',
      base: isProduction ? '/' : '/CampusFlow',
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || 'http://localhost:3500',
          changeOrigin: true,
        },
      },
    },
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
