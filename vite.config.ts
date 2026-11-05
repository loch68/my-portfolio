import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Production target is the Vercel root domain. If this is ever published as a
// GitHub Pages project site again, build with a matching `base` (for example
// '/my-portfolio/') so asset URLs stay correct.
export default defineConfig({
  base: '/',
  plugins: [react()],
} satisfies UserConfig);
