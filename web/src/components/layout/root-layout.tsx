import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useLocation, Outlet } from "react-router-dom";

import Header from "./header";
import { NavigationLoader } from "./navigation-loader";

function RootLayout() {
  const location = useLocation();
  const isProgramWorkspace = location.pathname.startsWith("/programs/");

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
          maxWidth: isProgramWorkspace ? "none" : 1360,
          mx: "auto",
          px: isProgramWorkspace ? 0 : { xs: 2, sm: 3, lg: "28px" },
          pt: isProgramWorkspace ? 0 : "32px",
          pb: isProgramWorkspace ? 0 : "56px",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

export default RootLayout;
