import type { GeographyFormValues } from "../schema";

export const GEOGRAPHY_LEVEL_OPTIONS = [
	{ value: "REGION", label: "Region" },
	{ value: "STATE", label: "State" },
	{ value: "DMA", label: "DMA" },
	{ value: "COUNTY", label: "County" },
];

export const geographyDefaultValues: GeographyFormValues = {
	currentRule: {
		level: "REGION",
		region: "",
		state: "",
		dma: "",

		code: "",
		name: "",
	},

	included: [],
	excluded: [],
};