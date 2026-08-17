// src/config/theme/ThemePreview.tsx

import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

import { useTheme } from "@/providers/theme-provider";

export function ThemePreview() {
	const { mode, resolvedMode, toggleMode } = useTheme();

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "background.default",
				color: "text.primary",
				p: 4,
			}}
		>
			<Stack spacing={4} sx={{ mx: "auto", maxWidth: 1000 }}>
				<Box>
					<Typography variant="h3">CarBravo MUI Theme</Typography>

					<Typography variant="body1" color="text.secondary">
						Theme foundation preview and verification.
					</Typography>
				</Box>

				<Divider />

				{/* Theme */}
				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Typography variant="h5">Theme</Typography>

							<Typography variant="body2">Mode: {mode}</Typography>

							<Typography variant="body2">Resolved: {resolvedMode}</Typography>

							<Button
								variant="contained"
								onClick={toggleMode}
								sx={{ alignSelf: "flex-start" }}
							>
								Toggle theme
							</Button>
						</Stack>
					</CardContent>
				</Card>

				{/* Brand */}
				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Typography variant="h5">Brand</Typography>

							<Stack direction="row" spacing={2}>
								<Button variant="contained">Primary</Button>

								<Button variant="contained" color="secondary">
									Secondary
								</Button>

								<Button variant="outlined" color="primary">
									Outlined
								</Button>

								<Button variant="text">Text</Button>
							</Stack>
						</Stack>
					</CardContent>
				</Card>

				{/* Semantic states */}
				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Typography variant="h5">Semantic States</Typography>

							<Stack direction="row" spacing={2}>
								<Chip label="Success" color="success" />

								<Chip label="Warning" color="warning" />

								<Chip label="Error" color="error" />

								<Chip label="Info" color="info" />
							</Stack>

							<Stack spacing={1}>
								<Alert severity="success">Success message</Alert>

								<Alert severity="warning">Warning message</Alert>

								<Alert severity="error">Error message</Alert>

								<Alert severity="info">Information message</Alert>
							</Stack>
						</Stack>
					</CardContent>
				</Card>

				{/* Status */}
				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Typography variant="h5">Program Status</Typography>

							<Stack direction="row" spacing={1}>
								<Chip label="Draft" variant="statusDraft" />

								<Chip label="Review" variant="statusReview" />

								<Chip label="Approved" variant="statusApproved" />

								<Chip label="Active" variant="statusActive" />

								<Chip label="Expired" variant="statusExpired" />
							</Stack>
						</Stack>
					</CardContent>
				</Card>

				{/* Form */}
				<Card>
					<CardContent>
						<Stack spacing={2}>
							<Typography variant="h5">Controls</Typography>

							<TextField
								label="Program name"
								placeholder="Enter program name"
								fullWidth
							/>

							<TextField
								label="Disabled"
								disabled
								value="Disabled field"
								fullWidth
							/>
						</Stack>
					</CardContent>
				</Card>

				{/* Typography */}
				<Card>
					<CardContent>
						<Stack spacing={1}>
							<Typography variant="h1">Heading 1</Typography>

							<Typography variant="h2">Heading 2</Typography>

							<Typography variant="h3">Heading 3</Typography>

							<Typography variant="h4">Heading 4</Typography>

							<Typography variant="body1">
								Body 1 — CarBravo program management.
							</Typography>

							<Typography variant="body2" color="text.secondary">
								Body 2 — Secondary supporting information.
							</Typography>

							<Typography variant="caption">CAPTION</Typography>
						</Stack>
					</CardContent>
				</Card>
			</Stack>
		</Box>
	);
}
