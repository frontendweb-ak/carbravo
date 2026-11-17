import type { z } from "zod";

import type { setupFormSchema } from "../schema";

export type SetupFormInput = z.input<typeof setupFormSchema>;
export type SetupFormOutput = z.output<typeof setupFormSchema>;
