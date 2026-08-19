import {
	useMutation,
	useQueries,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/infra/query/keys";

import {
	vehiclesApi,
	type SearchVehiclesParams,
	type UpdateProgramVehiclesRequestDto,
} from "../api/vehicles.api";
import type { VehicleFilterRow } from "../schema";

export interface ResolvedVehicleFilterRow {
	row: VehicleFilterRow;
	vehicleCatalogIds: number[];
}

export interface ResolveVehicleFiltersResult {
	rows: ResolvedVehicleFilterRow[];
	vehicleCatalogIds: number[];
}

/**
 * Resolve the form's filter rows into concrete vehicle catalog IDs.
 *
 * Important:
 * - Each row is resolved independently.
 * - Multiple years/makes are handled with parallel API requests.
 * - `*` means "do not filter by that field".
 * - Results are deduplicated by vehicleCatalogId.
 *
 * Example:
 *
 *   2026 + Chevrolet + Silverado
 *   2025 + GMC + Sierra
 *
 * becomes:
 *
 *   [123, 456, 789]
 */
export function useResolveVehicleFilters() {
	return async (
		rows: VehicleFilterRow[],
	): Promise<ResolveVehicleFiltersResult> => {
		const resolvedRows = await Promise.all(
			rows.map(async (row) => {
				const years = normalizeFilterValues(row.modelYears);
				const makes = normalizeFilterValues(row.makes);
				const models = normalizeFilterValues(row.models);
				const fuelTypes = normalizeFilterValues(row.fuelTypes);
				const segments = normalizeFilterValues(row.segments);

				const combinations = buildSearchCombinations(years, makes);

				const responses = await Promise.all(
					combinations.map((combination) => {
						const params: SearchVehiclesParams = {
							...combination,
						};

						return vehiclesApi.search(params);
					}),
				);

				const vehicles = dedupeVehicles(
					responses.flatMap((response) => response.vehicles),
				);

				const filteredVehicles = vehicles.filter((vehicle) => {
					if (
						models.length > 0 &&
						!models.some(
							(model) => model.toLowerCase() === vehicle.model.toLowerCase(),
						)
					) {
						return false;
					}

					if (
						fuelTypes.length > 0 &&
						!fuelTypes.some(
							(fuelType) =>
								fuelType.toLowerCase() === vehicle.fuelType.toLowerCase(),
						)
					) {
						return false;
					}

					if (
						segments.length > 0 &&
						!segments.some(
							(segment) =>
								segment.toLowerCase() === vehicle.segment.toLowerCase(),
						)
					) {
						return false;
					}

					return true;
				});

				return {
					row,
					vehicleCatalogIds: filteredVehicles.map(
						(vehicle) => vehicle.vehicleCatalogId,
					),
				};
			}),
		);

		const vehicleCatalogIds = [
			...new Set(resolvedRows.flatMap((result) => result.vehicleCatalogIds)),
		];

		return {
			rows: resolvedRows,
			vehicleCatalogIds,
		};
	};
}

function normalizeFilterValues(values: string[]): string[] {
	return values.filter((value) => value !== "*" && value.trim() !== "");
}

function buildSearchCombinations(
	years: string[],
	makes: string[],
): SearchVehiclesParams[] {
	const numericYears = years
		.map(Number)
		.filter((year) => Number.isInteger(year));

	/*
	 * No year + no make
	 *
	 * Search the complete catalog.
	 */
	if (numericYears.length === 0 && makes.length === 0) {
		return [{}];
	}

	/*
	 * Years only.
	 */
	if (numericYears.length > 0 && makes.length === 0) {
		return numericYears.map((year) => ({
			year,
		}));
	}

	/*
	 * Makes only.
	 */
	if (numericYears.length === 0 && makes.length > 0) {
		return makes.map((make) => ({
			make,
		}));
	}

	/*
	 * Years + makes.
	 *
	 * The API accepts scalar values, so create one
	 * request for every combination.
	 */
	return numericYears.flatMap((year) =>
		makes.map((make) => ({
			year,
			make,
		})),
	);
}

function dedupeVehicles<T extends { vehicleCatalogId: number }>(
	vehicles: T[],
): T[] {
	return Array.from(
		new Map(
			vehicles.map((vehicle) => [vehicle.vehicleCatalogId, vehicle]),
		).values(),
	);
}

/* -------------------------------------------------------------------------- */
/* Revision vehicles                                                          */
/* -------------------------------------------------------------------------- */

export function useProgramVehicles(programId?: number, revisionId?: number) {
	return useQuery({
		queryKey: queryKeys.vehicles.byRevision(programId!, revisionId!),
		queryFn: () => vehiclesApi.getForRevision(programId!, revisionId!),
		enabled: programId != null && revisionId != null,
	});
}

/* -------------------------------------------------------------------------- */
/* Update revision vehicles                                                   */
/* -------------------------------------------------------------------------- */

export function useUpdateProgramVehicles() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			programId,
			revisionId,
			payload,
		}: {
			programId: number;
			revisionId: number;
			payload: UpdateProgramVehiclesRequestDto;
		}) => vehiclesApi.updateForRevision(programId, revisionId, payload),

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.vehicles.byRevision(
					variables.programId,
					variables.revisionId,
				),
			});

			queryClient.invalidateQueries({
				queryKey: queryKeys.programs.detail(variables.programId),
			});
		},
	});
}

/* -------------------------------------------------------------------------- */
/* Years                                                                       */
/* -------------------------------------------------------------------------- */

export function useVehicleYears() {
	return useQuery({
		queryKey: queryKeys.vehicles.years(),
		queryFn: () => vehiclesApi.getYears(),
		staleTime: 5 * 60 * 1000,
	});
}

/* -------------------------------------------------------------------------- */
/* Makes                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Get makes for multiple selected years.
 *
 * Example:
 *
 * years = [2026, 2025]
 *
 * requests:
 *
 * GET /vehicles/makes?year=2026
 * GET /vehicles/makes?year=2025
 *
 * Results are merged and de-duplicated.
 */
export function useVehicleMakesForYears(years: number[]) {
	const queries = useQueries({
		queries: years.map((year) => ({
			queryKey: queryKeys.vehicles.makes(year),
			queryFn: () => vehiclesApi.getMakes(year),
			staleTime: 5 * 60 * 1000,
		})),
	});

	const makes = Array.from(
		new Map(
			queries
				.flatMap((query) => query.data?.makes ?? [])
				.map((item) => [item.make.toLowerCase(), item]),
		).values(),
	).sort((a, b) => a.make.localeCompare(b.make));

	return {
		data: makes,
		isLoading: queries.some((query) => query.isLoading),
		isFetching: queries.some((query) => query.isFetching),
		isError: queries.some((query) => query.isError),
	};
}

/**
 * Keep this for places that genuinely need one year.
 */
export function useVehicleMakes(year?: number) {
	return useQuery({
		queryKey: queryKeys.vehicles.makes(year!),
		queryFn: () => vehiclesApi.getMakes(year!),
		enabled: year != null,
		staleTime: 5 * 60 * 1000,
	});
}

/* -------------------------------------------------------------------------- */
/* Models                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Get models for multiple year/make combinations.
 *
 * Example:
 *
 * years = [2026, 2025]
 * makes = ["Chevrolet", "GMC"]
 *
 * Requests:
 *
 * 2026 + Chevrolet
 * 2026 + GMC
 * 2025 + Chevrolet
 * 2025 + GMC
 *
 * Results are merged and de-duplicated.
 */
export function useVehicleModelsForSelection(years: number[], makes: string[]) {
	const combinations = years.flatMap((year) =>
		makes.map((make) => ({
			year,
			make,
		})),
	);

	const queries = useQueries({
		queries: combinations.map(({ year, make }) => ({
			queryKey: queryKeys.vehicles.models(year, make),

			queryFn: () => vehiclesApi.getModels(year, make),

			staleTime: 5 * 60 * 1000,
		})),
	});

	const models = Array.from(
		new Map(
			queries
				.flatMap((query) => query.data?.models ?? [])
				.map((item) => [item.model.toLowerCase(), item]),
		).values(),
	).sort((a, b) => a.model.localeCompare(b.model));

	return {
		data: models,
		isLoading: queries.some((query) => query.isLoading),
		isFetching: queries.some((query) => query.isFetching),
		isError: queries.some((query) => query.isError),
	};
}

/**
 * Keep this for single year + single make consumers.
 */
export function useVehicleModels(year?: number, make?: string) {
	return useQuery({
		queryKey: queryKeys.vehicles.models(year!, make!),
		queryFn: () => vehiclesApi.getModels(year!, make!),
		enabled: year != null && Boolean(make),
		staleTime: 5 * 60 * 1000,
	});
}

/* -------------------------------------------------------------------------- */
/* Segments                                                                    */
/* -------------------------------------------------------------------------- */

export function useVehicleSegments() {
	return useQuery({
		queryKey: queryKeys.vehicles.segments(),
		queryFn: () => vehiclesApi.getSegments(),
		staleTime: 30 * 60 * 1000,
	});
}

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

export function useVehicleSearch(params?: SearchVehiclesParams) {
	return useQuery({
		queryKey: queryKeys.vehicles.search(params ?? {}),
		queryFn: () => vehiclesApi.search(params),
		staleTime: 5 * 60 * 1000,
	});
}

/* -------------------------------------------------------------------------- */
/* Search multiple filters                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Search the catalog for multiple year/make combinations.
 *
 * This is used when the user has:
 *
 * Year:
 *   2026, 2025
 *
 * Make:
 *   Chevrolet, GMC
 *
 * Because the API currently accepts scalar year/make values,
 * we perform the required requests in parallel and merge them.
 */
export function useVehicleCatalog(
	years: number[],
	makes: string[],
	enabled = true,
) {
	const combinations =
		years.length > 0 && makes.length > 0
			? years.flatMap((year) => makes.map((make) => ({ year, make })))
			: years.length > 0
				? years.map((year) => ({ year }))
				: makes.length > 0
					? makes.map((make) => ({ make }))
					: [{}];

	const queries = useQueries({
		queries: combinations.map((filters) => ({
			queryKey: queryKeys.vehicles.search(filters),
			queryFn: () => vehiclesApi.search(filters),
			enabled,
			staleTime: 5 * 60 * 1000,
		})),
	});

	const vehicles = Array.from(
		new Map(
			queries
				.flatMap((query) => query.data?.vehicles ?? [])
				.map((vehicle) => [vehicle.vehicleCatalogId, vehicle]),
		).values(),
	);

	return {
		data: { vehicles },
		isLoading: queries.some((query) => query.isLoading),
		isFetching: queries.some((query) => query.isFetching),
		isError: queries.some((query) => query.isError),
	};
}
