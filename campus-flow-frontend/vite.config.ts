import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

export default defineConfig(() => {
  const isDocker = process.env.DOCKER === "true";

  return {
    server: {
      open: !isDocker,
      host: 'localhost',
      base: '/CampusFlow',
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
