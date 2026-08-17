// src/config/theme/shape.ts

import { tokens } from "./tokens";

export const radii = tokens.radius;

export type RadiusKey = keyof typeof radii;

export const shape = {
	borderRadius: radii.lg,
};
