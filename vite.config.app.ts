import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// App dev/build configuration (demo UI — not the npm library bundle)
export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	server: {
		host: true,
		port: 5173,
		strictPort: true,
	},
	preview: {
		host: true,
		port: 4173,
		strictPort: true,
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
