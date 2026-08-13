import type { PropsWithChildren } from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeProvider";

export function AppProviders({ children }: PropsWithChildren) {
	return (
		<ThemeProvider>
			<QueryProvider>{children}</QueryProvider>
		</ThemeProvider>
	);
}
