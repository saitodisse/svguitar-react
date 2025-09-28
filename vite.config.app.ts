import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// App build configuration for Vercel deployment
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist-app",
		rollupOptions: {
			input: {
				main: resolve(__dirname, "index.html"),
			},
		},
	},
	base: "/",
});
