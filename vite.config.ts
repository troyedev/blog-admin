import { ConfigEnv, UserConfigExport, defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  // 加载环境变量配置
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3001,
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/app/, "/api"),
        },
      },
      open: true,
    },
  };
};
