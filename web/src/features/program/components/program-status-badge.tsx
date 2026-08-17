import { StatusBadge } from "@/components/ui";
import type { Program } from "../model/programs.types";

export function ProgramStatusBadge({ status }: { status: Program["status"] }) {
	return <StatusBadge status={status} />;
}
