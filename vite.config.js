import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'scripts/main.js'),
      formats: ['iife'],
      name: 'avpnScript',
      fileName: () => 'bundle.min.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    minify: true,
    rollupOptions: {
      external: ['gsap', 'ScrollTrigger', 'Observer', 'Lenis', 'd3', 'SplitText'],
      output: {
        globals: {
          gsap: 'gsap',
          ScrollTrigger: 'ScrollTrigger',
          Observer: 'Observer',
          Lenis: 'Lenis',
          d3: 'd3',
          SplitText: 'SplitText',
        },
      },
    },
  },
  plugins: [
    // 👇 This copies index.html to /dist after each build
    viteStaticCopy({
      targets: [
        {
          src: 'index.html',
          dest: '.', // copy into dist/
        },
      ],
    }),
  ],
})