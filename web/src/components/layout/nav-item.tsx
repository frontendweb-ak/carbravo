import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";

interface NavItemProps {
	to: string;
	children: React.ReactNode;
}

function NavItem({ to, children }: NavItemProps) {
	return (
		<Box
			component={NavLink}
			to={to}
			sx={{
				cursor: "pointer",
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",

				height: 34,
				px: 4,

				borderRadius: "8px",

				textDecoration: "none",

				fontSize: 14,
				fontWeight: 700,

				color: "#3F5963",

				flex: "0 0 auto", // important

				"&:hover": {
					backgroundColor: "#EEF2F4",
				},

				"&.active": {
					backgroundColor: "#DCE3E7",
					color: "#063F4F",
				},
			}}
		>
			{children}
		</Box>
	);
}

export { NavItem };
export default NavItem;
