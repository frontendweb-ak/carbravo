import { queryKeys } from "@/infra/query/keys";
import { useQuery } from "@tanstack/react-query";
import { type ListProgramsParams, programsApi } from "../api/programs.api";
import { mapProgramsList } from "../model/programs.mapper";

export function usePrograms(params?: ListProgramsParams) {
	return useQuery({
		queryKey: queryKeys.programs.list(params),
		queryFn: async () => {
			const response = await programsApi.getList(params);
			return mapProgramsList(response);
		},
		placeholderData: (previousData) => previousData,
	});
}
