import type {
	GeographyResponse,
	GeoRuleDto,
	UpdateGeographyRequest,
} from "../api/geography.api";

import type { GeographyFormValues } from "../schema";

function toFormRule(rule: GeoRuleDto) {
	return {
		id: crypto.randomUUID(),
		level: rule.level,
		code: rule.code,
		name: rule.name,
	};
}

export function geographyResponseToForm(
	response: GeographyResponse,
): GeographyFormValues {
	return {
		currentRule: {
			level: "REGION",
			code: "",
			name: "",
		},

		included: response.geoRules
			.filter((rule) => rule.isIncluded)
			.map(toFormRule),

		excluded: response.geoRules
			.filter((rule) => !rule.isIncluded)
			.map(toFormRule),
	};
}

export function geographyFormToRequest(
	values: GeographyFormValues,
): UpdateGeographyRequest {
	return {
		geoRules: [
			...values.included.map((rule) => ({
				isIncluded: true,
				level: rule.level,
				code: rule.code,
				name: rule.name,
			})),

			...values.excluded.map((rule) => ({
				isIncluded: false,
				level: rule.level,
				code: rule.code,
				name: rule.name,
			})),
		],
	};
}
