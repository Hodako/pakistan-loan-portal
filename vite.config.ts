import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    envPrefix: ['VITE_', 'TELEGRAM_'],
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'process.env.TELEGRAM_BOT_TOKEN': JSON.stringify(env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || ''),
      'process.env.TELEGRAM_CHAT_ID': JSON.stringify(env.TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID || ''),
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
