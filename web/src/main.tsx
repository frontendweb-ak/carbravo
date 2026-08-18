import GlobalStyles from "@mui/material/GlobalStyles";
import { StyledEngineProvider } from "@mui/material/styles";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";


// Get the root DOM element where the React application will be mounted.
const el = document.getElementById("root") as HTMLElement;

// Create the React root for rendering the application.
const app = createRoot(el);

// Render the application with MUI's CSS layer integration enabled.
app.render(
	<StrictMode>
		<StyledEngineProvider enableCssLayer>
			<GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
			<App />
		</StyledEngineProvider>
	</StrictMode>,
);
