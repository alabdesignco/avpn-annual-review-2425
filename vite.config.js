import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'scripts/main.js'),
      formats: ['iife'],                // Self-executing bundle for Webflow
      name: 'avpnScript',               // Global variable accessible in browser
      fileName: () => 'bundle.min.js'   // Output file name
    },
    outDir: 'dist',                     // Output folder
    emptyOutDir: true,                  // Clears dist on each build
    minify: true,                       // Minify via esbuild
    rollupOptions: {
      // ✅ Exclude vendor libraries loaded from CDN in Webflow
      external: ['gsap', 'ScrollTrigger', 'Observer', 'Lenis', 'd3'],
      output: {
        globals: {
          gsap: 'gsap',
          ScrollTrigger: 'ScrollTrigger',
          Observer: 'Observer',
          Lenis: 'Lenis',
          d3: 'd3',
        },
      },
    },
  },
})