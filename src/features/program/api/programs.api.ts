import { api } from "@/infra/axios/client";

export interface ListProgramsParams {
	status?: "DRAFT" | "ACTIVE" | "EXPIRED";
	programType?: string;
	search?: string;
	dateFrom?: string;
	dateTo?: string;
	pendingApproval?: boolean;
	page?: number;
	size?: number;
}

export interface CreateProgramPayload {
	programName: string;
}

export class ProgramsApi {
	static async getList(params?: ListProgramsParams) {
		const response = await api.get("/programs", { params });
		return response.data;
	}

	static async getDetail(programId: number) {
		const response = await api.get(`/programs/${programId}`);
		return response.data;
	}

	static async createProgram(payload: CreateProgramPayload) {
		const response = await api.post("/programs", payload);
		return response.data;
	}

	static async deleteProgram(programId: number) {
		const response = await api.delete(`/programs/${programId}`);
		return response.data;
	}
}
