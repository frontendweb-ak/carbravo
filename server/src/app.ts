import { Hono } from "hono";
import { cors } from "hono/cors";

import { ApiError } from "./lib/errors.js";
import { authMiddleware } from "./middleware/auth.js";
import { approval } from "./routes/approval.js";
import { dashboard } from "./routes/dashboard.js";
import { delta } from "./routes/delta.js";
import { geography } from "./routes/geography.js";
import { programs } from "./routes/programs.js";
import { reference } from "./routes/reference.js";
import { revisionHistory } from "./routes/revisionHistory.js";
import { revisions } from "./routes/revisions.js";
import { setup } from "./routes/setup.js";
import { summary } from "./routes/summary.js";
import { values } from "./routes/values.js";
import { vehicles } from "./routes/vehicles.js";

export const app = new Hono();
const allowedOrigin = process.env.WEB_ORIGIN ?? "http://localhost:5173";
app.use(
  "*",
  cors({
    origin: allowedOrigin,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-User-Role",
      "X-User-Name",
      "ngrok-skip-browser-warning",
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);
app.get("/health", (c) => {
  return c.json({ status: "UP" });
});

app.use("/api/*", authMiddleware);
app.route("/api", dashboard);
app.route("/api", programs);
app.route("/api", setup);
app.route("/api", vehicles);
app.route("/api", geography);
app.route("/api", reference);
app.route("/api/", values);
app.route("/api/", summary);
app.route("/api/", revisions);
app.route("/api", revisionHistory);
app.route("/api", delta);
app.route("/api", approval);


app.onError((error, c) => {
	if (error instanceof ApiError) {
		return c.json(
			{
				error: {
					code: error.code,
					message: error.message,
					timestamp: new Date().toISOString(),
					path: c.req.path,
					details: error.details,
				},
			},
			error.status as any,
		);
	}
	console.error(error);
	return c.json(
		{
			error: {
				code: "INTERNAL_SERVER_ERROR",
				message: "Unexpected server error",
				timestamp: new Date().toISOString(),
				path: c.req.path,
				details: {},
			},
		},
		500,
	);
});
