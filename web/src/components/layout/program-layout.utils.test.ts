import { describe, expect, it } from "vitest";

import { parseProgramId } from "./program-layout.utils";

describe("parseProgramId", () => {
	it.each([
		["42", 42],
		["0042", 42],
		["9007199254740991", Number.MAX_SAFE_INTEGER],
	])("accepts a valid positive program ID (%s)", (value, expected) => {
		expect(parseProgramId(value)).toBe(expected);
	});

	it.each([
		undefined,
		"",
		"0",
		"-1",
		"1.5",
		"abc",
		"42abc",
		"9007199254740992",
	])("rejects an invalid program ID (%s)", (value) => {
		expect(parseProgramId(value)).toBeUndefined();
	});
});
