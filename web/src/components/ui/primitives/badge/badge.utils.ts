import type { ProgramWorkflowStatus } from "@/config/constants/status";
import type { BadgeTone } from "./badge";
export function getStatusBadgeTone(status: ProgramWorkflowStatus): BadgeTone {
	return status.toLowerCase() as BadgeTone;
}
