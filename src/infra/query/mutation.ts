import { toast } from "@/components/ui";
import {
	type UseMutationOptions,
	type UseMutationResult,
	useMutation,
} from "@tanstack/react-query";
import type { AppError } from "../api";

/* -------------------------------------------------------------------------- */
/* Message types                                                              */
/* -------------------------------------------------------------------------- */

type Message<TData> = string | ((data: TData) => string);

type ErrorMessage = string | ((error: AppError) => string | null);

/* -------------------------------------------------------------------------- */
/* Options                                                                    */
/* -------------------------------------------------------------------------- */

export type AppMutationOptions<
	TData = unknown,
	TVariables = void,
	TOnMutateResult = unknown,
> = UseMutationOptions<TData, AppError, TVariables, TOnMutateResult> & {
	successMessage?: Message<TData>;
	errorMessage?: ErrorMessage;

	/**
	 * Show success toast.
	 *
	 * Default: true.
	 *
	 * For auto-save mutations:
	 * showSuccess: false
	 */
	showSuccess?: boolean;

	/**
	 * Show error toast.
	 *
	 * Default: true.
	 */
	showError?: boolean;
};

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useAppMutation<
	TData = unknown,
	TVariables = void,
	TOnMutateResult = unknown,
>(
	options: AppMutationOptions<TData, TVariables, TOnMutateResult>,
): UseMutationResult<TData, AppError, TVariables, TOnMutateResult> {
	return useMutation<TData, AppError, TVariables, TOnMutateResult>({
		...options,

		onSuccess: (data, variables, onMutateResult, context) => {
			if (options.showSuccess !== false && options.successMessage) {
				const message =
					typeof options.successMessage === "function"
						? options.successMessage(data)
						: options.successMessage;

				if (message.trim()) {
					toast.add({
						type: "success",
						title: message,
					});
				}
			}

			/*
			 * Preserve caller callback.
			 */
			options.onSuccess?.(data, variables, onMutateResult, context);
		},

		onError: (error, variables, onMutateResult, context) => {
			if (options.showError !== false) {
				let message: string | null | undefined;

				if (typeof options.errorMessage === "function") {
					message = options.errorMessage(error);
				} else if (options.errorMessage !== undefined) {
					message = options.errorMessage;
				} else {
					message = error?.message ?? "Something went wrong";
				}

				if (typeof message === "string" && message.trim().length > 0) {
					toast.add({
						type: "error",
						title: message,
					});
				}
			}

			/*
			 * Preserve caller callback.
			 */
			options.onError?.(error, variables, onMutateResult, context);
		},
	});
}
