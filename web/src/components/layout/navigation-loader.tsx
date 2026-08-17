import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import { useNavigation } from "react-router-dom";

function NavigationLoader() {
	const navigation = useNavigation();
	const theme = useTheme();

	if (navigation.state === "idle") {
		return null;
	}

	return (
		<Box
			role="progressbar"
			aria-label="Loading page"
			sx={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 9999,
				height: 2,
				overflow: "hidden",
				backgroundColor: `${theme.palette.primary.main}33`, // 20% opacity
			}}
		>
			<Box
				sx={{
					height: "100%",
					width: "33%",
					backgroundColor: theme.palette.brandTeal.main,
					animation: "navigation-loader 1s ease-in-out infinite",
				}}
			/>
		</Box>
	);
}

export { NavigationLoader };
