import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      proxy: {
        "/api/confluence": {
          target: "https://serasiautoraya.atlassian.net",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/confluence/, "/wiki/api/v2"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              proxyReq.setHeader("Origin", "https://serasiautoraya.atlassian.net");
              proxyReq.setHeader("Referer", "https://serasiautoraya.atlassian.net/wiki");
              console.log("Proxying:", req.url, "->", proxyReq.getHeader("host"));
            });
            proxy.on("error", (err) => {
              console.error("Proxy error:", err);
            });
          },
        },
      },
    },
  };
});
