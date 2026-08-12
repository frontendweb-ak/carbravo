import ProgramLayout from "@/components/layout/program-layout";
import RootLayout from "@/components/layout/root-layout";
import DashboardPage from "@/pages/dashboard/page";
import ProgramPage from "@/pages/programs/[programid]/page";
import ProgramsPage from "@/pages/programs/page";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { PROGRAM_EDITOR_ROUTES } from "./program-editor-routes";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,

		children: [
			{
				index: true,
				element: <Navigate to="/dashboard" replace />,
			},

			{
				path: "dashboard",
				element: <DashboardPage />,
			},

			{
				path: "programs",
				children: [
					{
						index: true,
						element: <ProgramsPage />,
					},

					/*
					 * ------------------------------------------------------
					 * NEW PROGRAM
					 * ------------------------------------------------------
					 *
					 * /programs/new/setup
					 * /programs/new/vehicles
					 * /programs/new/geography
					 * ...
					 */
					{
						path: "new",
						element: <ProgramLayout mode="new" />,
						children: PROGRAM_EDITOR_ROUTES,
					},

					/*
					 * ------------------------------------------------------
					 * EXISTING PROGRAM
					 * ------------------------------------------------------
					 *
					 * /programs/:programId
					 */
					{
						path: ":programId",
						element: <ProgramPage />,
					},

					/*
					 * ------------------------------------------------------
					 * EDIT EXISTING PROGRAM
					 * ------------------------------------------------------
					 *
					 * /programs/:programId/edit/setup
					 * /programs/:programId/edit/vehicles
					 * ...
					 */
					{
						path: ":programId/edit",
						element: <ProgramLayout mode="edit" />,
						children: PROGRAM_EDITOR_ROUTES,
					},
				],
			},
		],
	},
]);
