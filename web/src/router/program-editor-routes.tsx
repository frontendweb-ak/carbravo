// src/router/program-editor-routes.tsx

import { Navigate } from "react-router-dom";

import ApprovalPage from "@/pages/programs/[programid]/edit/approval/page";

import GeographyPage from "@/pages/programs/[programid]/edit/geography/page";
import IncentiveValuesPage from "@/pages/programs/[programid]/edit/incentive-values/page";
import EligibilityPage from "@/pages/programs/[programid]/edit/ligibility/page";
import MarketingPage from "@/pages/programs/[programid]/edit/marketing/page";
import SetupPage from "@/pages/programs/[programid]/edit/setup/page";
import SummaryPage from "@/pages/programs/[programid]/edit/summary/page";
import VehiclesPage from "@/pages/programs/[programid]/edit/vehicles/page";

export const PROGRAM_EDITOR_ROUTES = [
	{ index: true, element: <Navigate to="setup" replace /> },
	{ path: "setup", element: <SetupPage /> },
	{ path: "vehicles", element: <VehiclesPage /> },
	{ path: "geography", element: <GeographyPage /> },
	{ path: "eligibility", element: <EligibilityPage /> },
	{ path: "incentive-values", element: <IncentiveValuesPage /> },
	{ path: "marketing", element: <MarketingPage /> },
	{ path: "summary", element: <SummaryPage /> },
	{ path: "approval", element: <ApprovalPage /> },
];
