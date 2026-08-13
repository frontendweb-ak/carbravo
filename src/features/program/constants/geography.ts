import type { GeographyFormValues } from "../schema";

export const GEOGRAPHY_LEVEL_OPTIONS = [
	{ value: "REGION", label: "Region" },
	{ value: "STATE", label: "State" },
	{ value: "COUNTRY", label: "Country" },
	{ value: "DMA", label: "DMA" },
];

export const GEOGRAPHY_VALUE_OPTIONS = {
	REGION: [
		{ value: "NATIONAL", label: "National" },
		{ value: "NORTHEAST", label: "Northeast" },
		{ value: "SOUTHEAST", label: "Southeast" },
		{ value: "MIDWEST", label: "Midwest" },
		{ value: "SOUTHWEST", label: "Southwest" },
		{ value: "WEST", label: "West" },
	],

	STATE: [
		{ value: "TX", label: "Texas" },
		{ value: "CA", label: "California" },
		{ value: "NY", label: "New York" },
		{ value: "FL", label: "Florida" },
		{ value: "IL", label: "Illinois" },
		{ value: "OH", label: "Ohio" },
		{ value: "MI", label: "Michigan" },
		{ value: "GA", label: "Georgia" },
	],

	COUNTRY: [
		{ value: "US", label: "United States" },
		{ value: "CA", label: "Canada" },
		{ value: "MX", label: "Mexico" },
	],

	DMA: [
		{ value: "DALLAS_FT_WORTH", label: "Dallas–Fort Worth" },
		{ value: "HOUSTON", label: "Houston" },
		{ value: "AUSTIN", label: "Austin" },
		{ value: "LOS_ANGELES", label: "Los Angeles" },
		{ value: "NEW_YORK", label: "New York" },
		{ value: "CHICAGO", label: "Chicago" },
		{ value: "ATLANTA", label: "Atlanta" },
		{ value: "DETROIT", label: "Detroit" },
	],
};

export const geographyDefaultValues: GeographyFormValues = {
	currentRule: {
		level: "REGION",
		value: "",
	},
	included: [],
	excluded: [],
};
