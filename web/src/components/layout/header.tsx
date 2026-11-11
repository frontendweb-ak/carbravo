import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { NavLink, useNavigate } from "react-router-dom";

import { AppBar, Avatar } from "@mui/material";
import { Logo } from "./logo";
import NavItem from "./nav-item";
import { useMockUserRole } from "@/infra/api/use-mock-user-role";

function Header() {
	const navigate = useNavigate();
	const { role, setRole } = useMockUserRole();
	const mockRoleSwitchEnabled =
		import.meta.env.DEV && import.meta.env.VITE_ENABLE_API_MOCKS === "true";

	return (
		<AppBar
			component="header"
			sx={{
				position: "sticky",
				top: 0,
				zIndex: 50,

				borderBottom: 1,
				borderColor: "divider",
				backgroundColor: "background.paper",
				boxShadow: 1,
			}}
		>
			<Container
				maxWidth={false}
				sx={{
					width: "100%",
					maxWidth: 1340,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				}}
			>
				<Box
					sx={{
						height: 64,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{/* Left */}
					<Box
						sx={{
							height: "100%",
							display: "flex",
							alignItems: "center",
							gap: 6,
						}}
					>
						<NavLink
							to="/dashboard"
							style={{
								display: "flex",
								alignItems: "center",
								textDecoration: "none",
								color: "inherit",
							}}
						>
							<Logo size={28} />
						</NavLink>

						{/* Navigation */}
						<Box
							component="nav"
							sx={{
								ml: 4,
								display: "flex",
								alignItems: "center",
								gap: 1,
							}}
						>
							<NavItem to="/dashboard">Dashboard</NavItem>
							<NavItem to="/programs">Programs</NavItem>
						</Box>
					</Box>

					{/* Right */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
						<Button
							type="button"
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => navigate("/programs/new")}
						>
							New Program
						</Button>

						<Divider
							orientation="vertical"
							flexItem
							sx={{
								height: 32,
								alignSelf: "center",
							}}
						/>

						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 2,
							}}
						>
							<Typography
								variant="overline"
								sx={{
									color: "text.secondary",
									fontWeight: 700,
									letterSpacing: "0.08em",
								}}
							>
								ROLE
							</Typography>

							{mockRoleSwitchEnabled ? (
								<FormControl size="small" sx={{ minWidth: 112 }}>
									<Select
										value={role}
										aria-label="Mock user role"
										onChange={(event) => setRole(event.target.value as typeof role)}
										sx={{
											fontSize: 13,
											fontWeight: 600,
											"& .MuiOutlinedInput-notchedOutline": { border: 0 },
										}}
									>
										<MenuItem value="AUTHOR">Author</MenuItem>
										<MenuItem value="APPROVER">Approver</MenuItem>
										<MenuItem value="ADMIN">Admin</MenuItem>
									</Select>
								</FormControl>
							) : (
								<Typography variant="body2" sx={{ fontWeight: 600 }}>
									{role === "AUTHOR" ? "Author" : role === "APPROVER" ? "Approver" : "Admin"}
								</Typography>
							)}
						</Box>

						<Avatar
							sx={{
								width: 35,
								height: 35,
								bgcolor: "#DDEFF8",
								color: "#0077B6",
								fontWeight: 700,
							}}
						>
							AC
						</Avatar>
					</Box>
				</Box>
			</Container>
		</AppBar>
	);
}

export default Header;
