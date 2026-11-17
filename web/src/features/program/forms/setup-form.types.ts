import type { z } from "zod";

import { setupFormSchema } from "../schema";

export type SetupFormInput = z.input<typeof setupFormSchema>;
export type SetupFormOutput = z.output<typeof setupFormSchema>;
