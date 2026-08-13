import { Badge } from "@/components/ui";
import type { Program } from "../model/programs.types";
import { getProgramStatusBadge } from "../utils";

export function ProgramStatusBadge({ status }: { status: Program["status"] }) {
	const badge = getProgramStatusBadge(status);

	return <Badge variant={badge.variant}>{badge.label}</Badge>;
}
