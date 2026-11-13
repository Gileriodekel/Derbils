import { defineConfig } from 'vite';
import presentation from './src/data/presentation.json';
export default defineConfig({base:'./',build:{chunkSizeWarningLimit:presentation.bundleByteBudget/1024}});
