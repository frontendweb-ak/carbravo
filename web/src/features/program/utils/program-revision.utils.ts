import type { ProgramRevisionTab } from "@/features/program/components/layout/program-context-header";

import type { ProgramDetail } from "../model/programs.types";
import type {
	ProgramRevisionHistoryItem,
	ProgramRevisionHistoryState,
} from "../model/revisions.types";
export type ProgramRevisionView = "current" | "active" | "history";

/**
 * Determines which revision represents Current.
 *
 * A draft revision is the working copy.
 * If no draft exists, the active revision becomes Current.
 */
export function getCurrentRevision(program: ProgramDetail) {
	return program.draftRevision ?? program.activeRevision ?? null;
}

/**
 * Builds the revision tabs available for the program.
 *
 * Current:
 *   Always available when a revision exists.
 *
 * Active:
 *   Shown when the active revision differs from Current.
 *
 * History:
 *   Shown when more than one revision exists.
 */
export function getProgramRevisionTabs(
	program: ProgramDetail,
	history: ProgramRevisionHistoryState,
): ProgramRevisionTab[] {
	const currentRevision = getCurrentRevision(program);

	if (!currentRevision) {
		return [];
	}

	const tabs: ProgramRevisionTab[] = [
		{
			id: "current",
			label: "Current",
			subtitle: `Rev ${currentRevision.label}`,
		},
	];

	if (
		history.activeRevisionId != null &&
		history.activeRevisionId !== currentRevision.id
	) {
		const activeRevision = history.revisions.find(
			(revision) => revision.id === history.activeRevisionId,
		);

		if (activeRevision) {
			tabs.push({
				id: "active",
				label: "Active",
				subtitle: `Rev ${activeRevision.label}`,
			});
		}
	}

	if (history.revisions.length > 1) {
		tabs.push({
			id: "history",
			label: "History",
			subtitle: `${history.revisions.length} revisions`,
		});
	}

	return tabs;
}

/**
 * Resolves the actual revision that the editor should display.
 *
 * Current:
 *   Draft revision, falling back to active revision.
 *
 * Active:
 *   The API's activeRevisionId.
 *
 * History:
 *   The revision explicitly selected by the user.
 */
export function getSelectedRevision(
	program: ProgramDetail,
	history: ProgramRevisionHistoryState,
	selection: ProgramRevisionSelection,
):
	| ProgramRevisionHistoryItem
	| NonNullable<ProgramDetail["draftRevision"]>
	| null {
	switch (selection.view) {
		case "current":
			return getCurrentRevision(program);

		case "active": {
			if (history.activeRevisionId == null) {
				return null;
			}

			return (
				history.revisions.find(
					(revision) => revision.id === history.activeRevisionId,
				) ?? null
			);
		}

		case "history": {
			if (selection.revisionId == null) {
				return null;
			}

			return (
				history.revisions.find(
					(revision) => revision.id === selection.revisionId,
				) ?? null
			);
		}

		default:
			return null;
	}
}

export function getProgramRevisionView(search: string): ProgramRevisionView {
	const params = new URLSearchParams(search);

	switch (params.get("view")) {
		case "active":
			return "active";

		case "history":
			return "history";

		default:
			return "current";
	}
}

export function getRevisionId(search: string): number | null {
	const params = new URLSearchParams(search);
	const value = params.get("revision");

	if (!value) {
		return null;
	}

	const revisionId = Number(value);

	return Number.isInteger(revisionId) ? revisionId : null;
}

/**
 * Reads the revision view from the URL.
 *
 * Examples:
 *
 * /programs/6/setup
 *   -> current
 *
 * /programs/6/setup?view=active
 *   -> active
 *
 * /programs/6/setup?view=history
 *   -> history list
 *
 * /programs/6/setup?view=history&revision=106
 *   -> historical revision 106
 */
export interface ProgramRevisionSelection {
	view: ProgramRevisionView;
	revisionId: number | null;
}
export function getProgramRevisionSelection(
	search: string,
): ProgramRevisionSelection {
	const params = new URLSearchParams(search);

	const viewParam = params.get("view");
	const revisionParam = params.get("revision");

	const view: ProgramRevisionView =
		viewParam === "active" || viewParam === "history" ? viewParam : "current";

	if (!revisionParam) {
		return {
			view,
			revisionId: null,
		};
	}

	const revisionId = Number(revisionParam);

	return {
		view,
		revisionId: Number.isInteger(revisionId) ? revisionId : null,
	};
}
