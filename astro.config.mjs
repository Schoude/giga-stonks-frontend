import { defineConfig } from 'astro/config';
import deno from '@astrojs/deno';
import vue from "@astrojs/vue";

export default defineConfig({
  output: 'server',
  adapter: deno(),
  integrations: [
    vue(),
  ]
});
