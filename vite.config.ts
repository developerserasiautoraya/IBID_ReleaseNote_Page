import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
		proxy: {
			'/api/confluence': {
				target: 'https://serasiautoraya.atlassian.net',
				changeOrigin: true,
				secure: true,
				rewrite: (path) => {
					return path.replace(/^\/api\/confluence/, '/wiki/api/v2')
				},
				configure: (proxy) => {
					proxy.on('error', () => {
					})
					proxy.on('proxyReq', () => {
					})
				}
			}
		}
	}
});
