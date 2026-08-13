import { QueryClient } from "@tanstack/react-query";
import { defaultQueryOptions } from "./options";

export const queryClient = new QueryClient({
	defaultOptions: defaultQueryOptions,
});
