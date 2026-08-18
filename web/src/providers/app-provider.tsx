import { carBravoTheme } from "@/config/theme";
import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { PropsWithChildren } from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";

/**
 * AppProvider
 * @param param0
 * @returns
 */
export function AppProviders({ children }: PropsWithChildren) {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<ThemeProvider>
				<ToastProvider>
					<MuiThemeProvider theme={carBravoTheme}>
						<CssBaseline />
						<QueryProvider>{children}</QueryProvider>
					</MuiThemeProvider>
				</ToastProvider>
			</ThemeProvider>
		</LocalizationProvider>
	);
}
