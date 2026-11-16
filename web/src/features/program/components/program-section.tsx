// src/components/ui/program-section.tsx

import type { ReactNode } from "react";

import { Box, Stack } from "@mui/material";

import { Card, Typography } from "@/components/ui";

interface ProgramSectionProps {
  title: ReactNode;
  description?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

function ProgramSection({
  title,
  description,
  headerAction,
  children,
}: ProgramSectionProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "16px",
        borderColor: "#E2E8EA",
        backgroundColor: "background.paper",
        boxShadow: "0 1px 3px rgba(34,65,74,.07)",
      }}
    >
      <Box sx={{ px: "24px", py: "22px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
            mb: "18px",
          }}
        >
          <Stack spacing={0} sx={{ minWidth: 0 }}>
            {typeof title === "string" ? (
              <Typography
                variant="h5"
                weight="bold"
                color="default"
                sx={{
                  fontSize: "15.5px",
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}
              >
                {title}
              </Typography>
            ) : (
              title
            )}

            {description !== undefined && (
              <Typography
                variant="bodyMedium"
                weight="regular"
                color="secondary"
                sx={{
                  mt: "3px",
                  fontSize: "12.5px",
                  lineHeight: 1.4,
                }}
              >
                {description}
              </Typography>
            )}
          </Stack>

          {headerAction !== undefined && (
            <Box sx={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
              {headerAction}
            </Box>
          )}
        </Box>

        {children}
      </Box>
    </Card>
  );
}

export { ProgramSection };
