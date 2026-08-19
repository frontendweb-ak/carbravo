import { FormSelect } from "@/components/ui";
import { useEffect } from "react";
import { type Control, type UseFormSetValue, useWatch } from "react-hook-form";

import {
	useGeographyCounties,
	useGeographyDmas,
	useGeographyRegions,
	useGeographyStates,
} from "../../hooks/use-geography";

import type { GeographyFormValues, GeographyLevel } from "../../schema";

interface GeographyValueSelectProps {
	control: Control<GeographyFormValues>;
	setValue: UseFormSetValue<GeographyFormValues>;
}

export function GeographyValueSelect({
	control,
	setValue,
}: GeographyValueSelectProps) {
	const level = useWatch({
		control,
		name: "currentRule.level",
	});

	const region = useWatch({
		control,
		name: "currentRule.region",
	});

	const state = useWatch({
		control,
		name: "currentRule.state",
	});

	const dma = useWatch({
		control,
		name: "currentRule.dma",
	});

	const code = useWatch({
		control,
		name: "currentRule.code",
	});

	/* ---------------------------------------------------------------------- */
	/* API                                                                     */
	/* ---------------------------------------------------------------------- */

	const regionsQuery = useGeographyRegions();

	const statesQuery = useGeographyStates(
		level === "STATE" || level === "DMA" || level === "COUNTY"
			? {
					region: region || undefined,
				}
			: undefined,
	);

	const dmasQuery = useGeographyDmas(
		level === "DMA" || level === "COUNTY"
			? state
				? {
						state,
						region: region || undefined,
					}
				: undefined
			: undefined,
	);

	const countiesQuery = useGeographyCounties(
		level === "COUNTY"
			? state
				? {
						state,
						dma: dma || undefined,
					}
				: undefined
			: undefined,
	);

	/* ---------------------------------------------------------------------- */
	/* Resolve selected code -> name                                          */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!code) {
			setValue("currentRule.name", "", {
				shouldDirty: false,
				shouldValidate: false,
			});

			return;
		}

		let selected: { code: string; name: string } | undefined;

		switch (level as GeographyLevel) {
			case "REGION":
				selected = regionsQuery.data?.regions.find(
					(item) => item.code === code,
				);
				break;

			case "STATE":
				selected = statesQuery.data?.states.find((item) => item.code === code);
				break;

			case "DMA":
				selected = dmasQuery.data?.dmas.find((item) => item.code === code);
				break;

			case "COUNTY":
				selected = countiesQuery.data?.counties.find(
					(item) => item.code === code,
				);
				break;
		}

		setValue("currentRule.name", selected?.name ?? "", {
			shouldDirty: false,
			shouldValidate: false,
		});
	}, [
		code,
		level,
		setValue,
		regionsQuery.data,
		statesQuery.data,
		dmasQuery.data,
		countiesQuery.data,
	]);

	/* ---------------------------------------------------------------------- */
	/* Options                                                                 */
	/* ---------------------------------------------------------------------- */

	let options: Array<{
		value: string;
		label: string;
	}> = [];

	let disabled = false;
	let placeholder = "Select value";

	switch (level as GeographyLevel) {
		case "REGION":
			options =
				regionsQuery.data?.regions.map((item) => ({
					value: item.code,
					label: item.name,
				})) ?? [];

			disabled = regionsQuery.isLoading;
			break;

		case "STATE":
			options =
				statesQuery.data?.states.map((item) => ({
					value: item.code,
					label: item.name,
				})) ?? [];

			// Region is optional because the API returns all states.
			disabled = statesQuery.isLoading;
			break;

		case "DMA":
			options =
				dmasQuery.data?.dmas.map((item) => ({
					value: item.code,
					label: item.name,
				})) ?? [];

			disabled = !state || dmasQuery.isLoading;

			if (!state) {
				placeholder = "Select state first";
			}

			break;

		case "COUNTY":
			options =
				countiesQuery.data?.counties.map((item) => ({
					value: item.code,
					label: item.name,
				})) ?? [];

			disabled = !state || countiesQuery.isLoading;

			if (!state) {
				placeholder = "Select state first";
			}

			break;
	}

	return (
		<FormSelect
			control={control}
			name="currentRule.code"
			label="Value"
			options={options}
			disabled={disabled}
			placeholder={placeholder}
		/>
	);
}
