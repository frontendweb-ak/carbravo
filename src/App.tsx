import { Button } from "@/components/ui/button";
import "./App.css";
import { env } from "./config/env";
import { AppProviders } from "./providers/AppProviders";

function App() {
	return (
		<AppProviders>
			<h1>{env.appName}</h1>
			<p>Environment: {env.environment}</p>
			<p>Version: {env.version}</p>
			<p>API: {env.apiUrl}</p>
			<p>Mocks: {String(env.enableApiMocks)}</p>
			<Button>Hi</Button>
		</AppProviders>
	);
}

export default App;
