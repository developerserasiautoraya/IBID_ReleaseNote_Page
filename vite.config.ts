import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => {

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      proxy: {
        "/api/confluence": {
          target: "https://enterprise-api-dev.sera.astra.co.id",
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/confluence/, "/wiki/api/v2"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              proxyReq.setHeader("Origin", "https://enterprise-api-dev.sera.astra.co.id");
              proxyReq.setHeader("Referer", "https://enterprise-api-dev.sera.astra.co.id/wiki");
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
