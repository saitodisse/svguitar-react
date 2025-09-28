import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./index.css";
import App from "./App.tsx";
import "./i18n";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<NuqsAdapter>
			<App />
		</NuqsAdapter>
	</StrictMode>
);
