import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// App build configuration for Vercel deployment
export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
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
