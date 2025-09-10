import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import * as path from "node:path";
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react(),
        svgr(),
        visualizer({
            open: true,
            gzipSize: true,
            brotliSize: true,
            filename: 'dist/bundle-analysis.html',
        }),
    ],
    resolve: {
        alias: {
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@components': path.resolve(__dirname, './src/components'),
            '@localization': path.resolve(__dirname, './src/localization'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@net': path.resolve(__dirname, './src/net'),
            '@data': path.resolve(__dirname, './src/data'),
            '@libs': path.resolve(__dirname, './src/libs'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@di': path.resolve(__dirname, './src/di/Container.ts'),
            '@screens': path.resolve(__dirname, './src/screens'),
            '@config': path.resolve(__dirname, './src/appConfig.ts'),
            '@router': path.resolve(__dirname, './src/router.tsx'),
            '@links': path.resolve(__dirname, './src/links.tsx'),
            '@theme': path.resolve(__dirname, './src/theme.ts'),
        },
    },
})
