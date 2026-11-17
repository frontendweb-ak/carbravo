import { describe, expect, it } from "vitest";

import type { ProgramDetail, ProgramRevision } from "../model/programs.types";
import type {
	ProgramRevisionHistoryItem,
	ProgramRevisionHistoryState,
} from "../model/revisions.types";
import {
	getCurrentRevision,
	getProgramRevisionSelection,
	getProgramRevisionTabs,
	getProgramRevisionView,
	getRevisionId,
	getSelectedRevision,
} from "./program-revision.utils";

const activeRevision: ProgramRevision = {
	id: 100,
	label: "1.0",
	major: 1,
	minor: 0,
	status: "ACTIVE",
	isMinorRevision: false,
	isSubmitted: true,
	approved: true,
};

const draftRevision: ProgramRevision = {
	id: 101,
	label: "1.1",
	major: 1,
	minor: 1,
	status: "DRAFT",
	isMinorRevision: false,
	isSubmitted: false,
	approved: false,
};

const olderRevision: ProgramRevisionHistoryItem = {
	id: 99,
	label: "0.9",
	major: 0,
	minor: 9,
	status: "EXPIRED",
	isMinorRevision: false,
	createdAt: "2026-01-01T10:00:00Z",
	createdBy: "Author",
	postedAt: "2026-01-02T10:00:00Z",
	postedBy: "Admin",
	isSubmitted: true,
	approved: true,
};

const activeHistoryRevision: ProgramRevisionHistoryItem = {
	id: 100,
	label: "1.0",
	major: 1,
	minor: 0,
	status: "ACTIVE",
	isMinorRevision: false,
	createdAt: "2026-02-01T10:00:00Z",
	createdBy: "Author",
	postedAt: "2026-02-02T10:00:00Z",
	postedBy: "Admin",
	isSubmitted: true,
	approved: true,
};

const draftHistoryRevision: ProgramRevisionHistoryItem = {
	id: 101,
	label: "1.1",
	major: 1,
	minor: 1,
	status: "DRAFT",
	isMinorRevision: false,
	createdAt: "2026-03-01T10:00:00Z",
	createdBy: "Author",
	postedAt: null,
	postedBy: null,
	isSubmitted: false,
	approved: false,
};

const program: ProgramDetail = {
	id: 42,
	identifier: "CB-2026-0042",
	name: "Spring Finance Event",
	status: "DRAFT",
	type: null,
	revision: activeRevision,
	hasDraft: true,
	vehicles: [],
	geography: [],
	deliveryStartDate: null,
	deliveryEndDate: null,
	updatedAt: null,
	activeRevision,
	draftRevision,
};

const history: ProgramRevisionHistoryState = {
	revisions: [draftHistoryRevision, activeHistoryRevision, olderRevision],
	pagination: {
		page: 0,
		size: 25,
		totalElements: 3,
		totalPages: 1,
	},
};

describe("getCurrentRevision", () => {
	it("prefers the draft revision over the active revision", () => {
		expect(getCurrentRevision(program)).toBe(draftRevision);
	});

	it("falls back to the active revision when no draft exists", () => {
		expect(
			getCurrentRevision({ ...program, draftRevision: null }),
		).toBe(activeRevision);
	});

	it("returns null when the program has no revisions", () => {
		expect(
			getCurrentRevision({
				...program,
				draftRevision: null,
				activeRevision: null,
			}),
		).toBeNull();
	});
});

describe("getProgramRevisionTabs", () => {
	it("always exposes Current and adds Active and History when available", () => {
		expect(getProgramRevisionTabs(program, history)).toEqual([
			{
				id: "current",
				label: "Current",
				subtitle: "Rev 1.1",
			},
			{
				id: "active",
				label: "Active",
				subtitle: "Rev 1.0",
			},
			{
				id: "history",
				label: "History",
				subtitle: "3 revisions",
			},
		]);
	});

	it("returns no tabs when a program has no current or active revision", () => {
		expect(
			getProgramRevisionTabs(
				{ ...program, draftRevision: null, activeRevision: null },
				history,
			),
		).toEqual([]);
	});

	it("shows Current and Active while history is still unavailable", () => {
		expect(getProgramRevisionTabs(program)).toEqual([
			{
				id: "current",
				label: "Current",
				subtitle: "Rev 1.1",
			},
			{
				id: "active",
				label: "Active",
				subtitle: "Rev 1.0",
			},
		]);
	});

	it("does not offer History for a single-revision program", () => {
		const singleRevisionHistory = {
			...history,
			revisions: [draftHistoryRevision],
			pagination: { ...history.pagination, totalElements: 1 },
		};

		expect(getProgramRevisionTabs(program, singleRevisionHistory)).toEqual([
			{
				id: "current",
				label: "Current",
				subtitle: "Rev 1.1",
			},
			{
				id: "active",
				label: "Active",
				subtitle: "Rev 1.0",
			},
		]);
	});
});

describe("getSelectedRevision", () => {
	it("resolves Current to the draft revision", () => {
		expect(
			getSelectedRevision(program, history, {
				view: "current",
				revisionId: null,
				invalidRevision: false,
			}),
		).toBe(draftRevision);
	});

	it("resolves Active directly from program details", () => {
		expect(
			getSelectedRevision(program, undefined, {
				view: "active",
				revisionId: null,
				invalidRevision: false,
			}),
		).toBe(activeRevision);
	});

	it("resolves a selected historical revision by ID", () => {
		expect(
			getSelectedRevision(program, history, {
				view: "history",
				revisionId: 99,
				invalidRevision: false,
			}),
		).toBe(olderRevision);
	});

	it("returns null when a requested historical revision is not in history", () => {
		expect(
			getSelectedRevision(program, history, {
				view: "history",
				revisionId: 1234,
				invalidRevision: false,
			}),
		).toBeNull();
	});

	it("returns null for Active when no active revision exists", () => {
		expect(
			getSelectedRevision(
				{ ...program, activeRevision: null },
				history,
				{ view: "active", revisionId: null, invalidRevision: false },
			),
		).toBeNull();
	});
});

describe("program revision URL parsing", () => {
	it.each([
		["", { view: "current", revisionId: null, invalidRevision: false }],
		["?view=current", { view: "current", revisionId: null, invalidRevision: false }],
		["?view=active", { view: "active", revisionId: null, invalidRevision: false }],
		["?view=history", { view: "history", revisionId: null, invalidRevision: false }],
		["?view=history&revision=99", { view: "history", revisionId: 99, invalidRevision: false }],
	])("parses %s into a revision selection", (search, expected) => {
		expect(getProgramRevisionSelection(search)).toEqual(expected);
	});

	it("defaults unknown views to Current", () => {
		expect(getProgramRevisionView("?view=unknown")).toBe("current");
	});

	it("parses Active and History view names", () => {
		expect(getProgramRevisionView("?view=active")).toBe("active");
		expect(getProgramRevisionView("?view=history")).toBe("history");
	});

	it.each(["", "?revision=abc", "?revision=1.5"])(
		"returns no revision ID for a missing or invalid value (%s)",
		(search) => {
			expect(getRevisionId(search)).toBeNull();
		},
	);

	it.each(["?revision=0", "?revision=-1", "?revision=9007199254740992"])(
		"rejects non-positive or unsafe revision IDs (%s)",
		(search) => {
			expect(getRevisionId(search)).toBeNull();
		},
	);

	it("marks a malformed explicit revision parameter as invalid", () => {
		expect(getProgramRevisionSelection("?view=history&revision=abc")).toEqual({
			view: "history",
			revisionId: null,
			invalidRevision: true,
		});
	});

	it("parses a positive numeric revision ID", () => {
		expect(getRevisionId("?revision=99")).toBe(99);
	});
});
