import "./App.css";
import { env } from "./config/env";

function App() {
	return (
		<div>
			<h1>{env.appName}</h1>
			<p>Environment: {env.environment}</p>
			<p>Version: {env.version}</p>
			<p>API: {env.apiUrl}</p>
			<p>Mocks: {String(env.enableApiMocks)}</p>
		</div>
	);
}

export default App;
