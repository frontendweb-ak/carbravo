// src/components/ui/card/card-footer.tsx

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import type { ReactNode } from "react";

export interface CardFooterProps {
	children: ReactNode;
}

function CardFooter({ children }: CardFooterProps) {
	return (
		<>
			<Divider />
			<Box sx={{ px: 3, py: 2 }}>{children}</Box>
		</>
	);
}

export { CardFooter };
