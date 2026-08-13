import type { SidebarProgramSection } from "../components";

export const PROGRAM_SIDE_MENU = [
	{
		id: "setup",
		number: 1,
		label: "Setup",
		requiredForSubmission: true,
	},
	{
		id: "vehicles",
		number: 2,
		label: "Vehicles",
		requiredForSubmission: true,
	},
	{
		id: "geography",
		number: 3,
		label: "Geography",
		requiredForSubmission: true,
	},
	{
		id: "eligibility",
		number: 4,
		label: "Eligibility",
		requiredForSubmission: true,
	},
	{
		id: "incentive-values",
		number: 5,
		label: "Incentive Values",
		requiredForSubmission: true,
	},
	{
		id: "marketing",
		number: 6,
		label: "Marketing & Disclosures",
		requiredForSubmission: true,
	},
	{
		id: "summary",
		number: 7,
		label: "10-Point Summary",
		requiredForSubmission: true,
	},
	{
		id: "approval",
		number: 8,
		label: "Approval",
		requiredForSubmission: false,
	},
] satisfies SidebarProgramSection[];
