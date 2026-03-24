import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 使用现代编译器 API，消除 legacy-js-api 废弃警告
        api: 'modern-compiler',
        // 全局自动注入 SCSS 变量（@import 会自动去重，uni.scss 本身不会冲突）
        additionalData: `@import "@/uni.scss";`,
      },
    },
  },
})
