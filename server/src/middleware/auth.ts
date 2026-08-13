import type { Context, Next } from "hono";
import { currentUser } from "../lib/auth.js";

export async function authMiddleware(c: Context, next: Next) {
  currentUser(c);

  await next();
}
