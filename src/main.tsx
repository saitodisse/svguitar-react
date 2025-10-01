import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ThemeProvider } from "./components/theme-provider";
import "./index.css";
import App from "./App.tsx";
import "./i18n";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
			<NuqsAdapter>
				<App />
			</NuqsAdapter>
		</ThemeProvider>
	</StrictMode>
);
