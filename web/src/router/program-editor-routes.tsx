// src/router/program-editor-routes.tsx

import { Navigate } from "react-router-dom";

import ApprovalPage from "@/pages/programs/[programid]/approval/page";
import EligibilityPage from "@/pages/programs/[programid]/eligibility/page";
import GeographyPage from "@/pages/programs/[programid]/geography/page";
import IncentiveValuesPage from "@/pages/programs/[programid]/incentive-values/page";
import MarketingPage from "@/pages/programs/[programid]/marketing/page";
import SetupPage from "@/pages/programs/[programid]/setup/page";
import SummaryPage from "@/pages/programs/[programid]/summary/page";
import VehiclesPage from "@/pages/programs/[programid]/vehicles/page";

/**
 * Shared Program Editor routes.
 *
 * These routes are intentionally shared by BOTH:
 *
 *   /programs/new/*
 *   /programs/:programId/*
 *
 * The UI for creating a new program and editing an existing
 * program is the same editor workspace. The difference is only
 * where the program data comes from:
 *
 *   - "new" mode has no program ID initially.
 *   - "edit" mode loads an existing program and its draft revision.
 *
 * Keeping the section routes in one place prevents us from
 * duplicating the same Setup, Vehicles, Geography, etc. routes
 * for new and existing programs.
 *
 * The parent route decides the mode:
 *
 *   /programs/new          → ProgramLayout mode="new"
 *   /programs/:programId   → ProgramLayout mode="edit"
 *
 * The individual sections therefore remain completely reusable.
 */
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