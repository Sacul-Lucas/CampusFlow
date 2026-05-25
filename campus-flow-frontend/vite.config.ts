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
          target: isProduction
            ? 'https://campusflow-85zn.onrender.com'
            : 'http://localhost:5001',
          changeOrigin: true,
        },
        '/uploads': {
          target: isProduction
            ? 'https://campusflow-85zn.onrender.com'
            : 'http://localhost:5001',
          changeOrigin: true,
        },
        '/seed': {
          target: isProduction
            ? 'https://campusflow-85zn.onrender.com'
            : 'http://localhost:5001',
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
