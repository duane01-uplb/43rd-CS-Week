import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load repository environment variables into process.env so local
  // development has access to DATABASE_URL and PUBLIC_* variables.
  Object.assign(process.env, loadEnv(mode, '../..', ''));

  return {
    envDir: '../..',
    plugins: [sveltekit()]
  };
});
