import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

import { Container } from "@mui/material";

import Header from "./header";
import { NavigationLoader } from "./navigation-loader";

function RootLayout() {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				backgroundColor: "background.default",
				color: "text.primary",
			}}
		>
			<NavigationLoader />
			<Header />
			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1360,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
					minHeight: "calc(100vh - 64px)",
				}}
			>
				<Outlet />
			</Container>
		</Box>
	);
}

export default RootLayout;
