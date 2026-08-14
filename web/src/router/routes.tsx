// src/router/routes.tsx

import { Navigate, createBrowserRouter } from "react-router-dom";

import ProgramLayout from "@/components/layout/program-layout";
import RootLayout from "@/components/layout/root-layout";

import DashboardPage from "@/pages/dashboard/page";
import ProgramsPage from "@/pages/programs/page";

import { PROGRAM_EDITOR_ROUTES } from "./program-editor-routes";

/**
 * Application routing.
 *
 * Program creation and program editing intentionally use the
 * same ProgramLayout and editor section routes.
 *
 *   /programs/new/*
 *       → New program mode
 *
 *   /programs/:programId/*
 *       → Existing program / draft editing mode
 *
 * There is no separate `/edit` URL because the editor itself
 * is the canonical program workspace. ProgramLayout receives
 * the appropriate mode from the parent route.
 */
export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [
			/**
			 * Default application route.
			 */
			{
				index: true,
				element: <Navigate to="/dashboard" replace />,
			},

			/**
			 * Dashboard.
			 */
			{
				path: "dashboard",
				element: <DashboardPage />,
			},

			/**
			 * Programs.
			 */
			{
				path: "programs",
				children: [
					/**
					 * Program listing.
					 *
					 * /programs
					 */
					{
						index: true,
						element: <ProgramsPage />,
					},

					/**
					 * Create a new program.
					 *
					 * /programs/new
					 * /programs/new/setup
					 * /programs/new/vehicles
					 * /programs/new/geography
					 * ...
					 *
					 * The ProgramEditorProvider runs in "new" mode.
					 */
					{
						path: "new",
						element: <ProgramLayout mode="new" />,
						children: PROGRAM_EDITOR_ROUTES,
					},

					/**
					 * Existing program editor.
					 *
					 * /programs/:programId
					 * /programs/:programId/setup
					 * /programs/:programId/vehicles
					 * /programs/:programId/geography
					 * ...
					 *
					 * ProgramLayout runs in "edit" mode and will
					 * resolve the program's current draft revision.
					 */
					{
						path: ":programId",
						element: <ProgramLayout mode="edit" />,
						children: PROGRAM_EDITOR_ROUTES,
					},
				],
			},
		],
	},
]);
