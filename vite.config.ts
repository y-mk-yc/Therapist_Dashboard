import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from "vite-plugin-svgr";
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), viteCompression({ algorithm: 'brotliCompress' })],
  assetsInclude: ['**/*.glb'],
  optimizeDeps: {
    include: ['react-chrono'], // Include react-chrono explicitly
  },
  server: {
    cors: {
      origin: "Access-Control-Allow-Origin",
      credentials: true
    }
  }
})
// export default defineConfig({
//   plugins: [
//     svgr(),
//     react(),
//     viteCompression({ algorithm: 'brotliCompress' })
//   ],
//   assetsInclude: ['**/*.glb'],
//   server: {
//     host: '0.0.0.0', // 确保监听所有网络接口
//     port: 5173,      // 端口号
//     cors: {
//       origin: '*',     // 允许所有源访问
//       credentials: true
//     }
//   }
// });