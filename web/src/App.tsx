import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { AppProviders } from "@/providers/app-provider";

import { setupMockAuth } from "./features/auth/session/mock-auth";
import { router } from "./router/routes";

if (import.meta.env.DEV) {
	setupMockAuth();
}

function App() {
	useEffect(() => {
		const loader = document.getElementById("boot-loader");

		if (!loader) {
			return;
		}

		// Let the first React frame render before hiding
		// the HTML boot loader.
		requestAnimationFrame(() => {
			loader.classList.add("is-hidden");
		});

		const timeout = window.setTimeout(() => {
			loader.remove();
		}, 220);

		return () => {
			window.clearTimeout(timeout);
		};
	}, []);

	return (
		<AppProviders>
			{/* <ThemePreview /> */}
			<RouterProvider router={router} />
		</AppProviders>
	);
}

export default App;
