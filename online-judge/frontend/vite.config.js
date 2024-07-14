// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     open: true,
//   },
// });

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      open: true,
    },
    base: env.VITE_ROUTER_BASE_URL || '/',
    define: {
      'process.env': env,
    },
  })
}
