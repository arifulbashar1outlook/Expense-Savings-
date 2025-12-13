import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Create an object containing all env vars starting with FIREBASE_
  // and the specific API_KEY for GenAI
  // Explicitly type as Record<string, string> to allow dynamic assignment
  const processEnv: Record<string, string> = {
    'process.env.API_KEY': JSON.stringify(env.API_KEY),
  };

  Object.keys(env).forEach(key => {
    if (key.startsWith('FIREBASE_')) {
      processEnv[`process.env.${key}`] = JSON.stringify(env[key]);
    }
  });
  
  return {
    plugins: [react()],
    define: processEnv
  };
});