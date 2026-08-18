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
				display: "flex",
				flexDirection: "column",
				backgroundColor: "background.default",
				color: "text.primary",
			}}
		>
			<NavigationLoader />
			<Header />
			<Container
				maxWidth={false}
				sx={{
					flex: 1,
					width: "100%",
					maxWidth: 1340,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
					py: 6,
				}}
			>
				<Outlet />
			</Container>
		</Box>
	);
}

export default RootLayout;
