import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      proxy: {
        "/api/confluence": {
          target: "https://serasiautoraya.atlassian.net",
          changeOrigin: true,
          secure: true,
          rewrite: (path) =>
            path.replace(/^\/api\/confluence/, "/wiki/api/v2"),
          configure: (proxy) => {
            proxy.on("error", (err) => {
              console.error("Proxy error:", err);
            });
            proxy.on("proxyReq", (proxyReq) => {
              console.log("Proxying request to:", proxyReq.getHeader("host"));
            });
          },
        },
      },
    },
    define: {
      __CONFLUENCE_BASE_URL__: JSON.stringify(
        mode === "development"
          ? "/api/confluence"
          : env.VITE_CONFLUENCE_BASE_URL || "https://serasiautoraya.atlassian.net/wiki/api/v2"
      ),
    },
  };
});
