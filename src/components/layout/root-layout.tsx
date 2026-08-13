import { Outlet } from "react-router-dom";
import { Toaster } from "../ui";
import Header from "./header";
import { NavigationLoader } from "./navigation-loader";

function RootLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<NavigationLoader />
			<Header />

			<main className="min-h-[calc(100vh-60px)]">
				<Outlet />
				<Toaster />
			</main>
		</div>
	);
}

export default RootLayout;
