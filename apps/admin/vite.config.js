import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // `$env/dynamic/public` reads process.env on the server. Load the shared
  // repository environment here so local admin development mirrors Vercel.
  Object.assign(process.env, loadEnv(mode, '../..', 'PUBLIC_'));

  return {
    envDir: '../..',
    plugins: [sveltekit()]
  };
});
