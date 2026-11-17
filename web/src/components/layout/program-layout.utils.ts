export function parseProgramId(value?: string): number | undefined {
	if (!value || !/^\d+$/.test(value)) return undefined;

	const programId = Number(value);
	return Number.isSafeInteger(programId) && programId > 0
		? programId
		: undefined;
}
