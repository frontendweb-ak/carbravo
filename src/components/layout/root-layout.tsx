import { Outlet } from "react-router-dom";

import Header from "./header";

function RootLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header />

			<main className="min-h-[calc(100vh-60px)]">
				<Outlet />
			</main>
		</div>
	);
}

export default RootLayout;
