// src/components/ui/providers/toast-provider.tsx

import { Alert, Snackbar } from "@mui/material";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type ToastType = "success" | "info" | "warning" | "error" | "loading";

export interface ToastOptions {
	title?: ReactNode;
	description?: ReactNode;
	type?: ToastType;
	duration?: number;
}

interface ToastContextValue {
	show: (options: ToastOptions) => void;
	success: (options: Omit<ToastOptions, "type">) => void;
	info: (options: Omit<ToastOptions, "type">) => void;
	warning: (options: Omit<ToastOptions, "type">) => void;
	error: (options: Omit<ToastOptions, "type">) => void;
	loading: (options: Omit<ToastOptions, "type">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastApi: ToastContextValue | null = null;

export const toast = {
	show(options: ToastOptions) {
		toastApi?.show(options);
	},

	success(options: Omit<ToastOptions, "type">) {
		toastApi?.success(options);
	},

	info(options: Omit<ToastOptions, "type">) {
		toastApi?.info(options);
	},

	warning(options: Omit<ToastOptions, "type">) {
		toastApi?.warning(options);
	},

	error(options: Omit<ToastOptions, "type">) {
		toastApi?.error(options);
	},

	loading(options: Omit<ToastOptions, "type">) {
		toastApi?.loading(options);
	},
};

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toastState, setToastState] = useState<ToastOptions | null>(null);
	const [open, setOpen] = useState(false);

	const show = useCallback((options: ToastOptions) => {
		setToastState(options);
		setOpen(true);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	const value = useMemo<ToastContextValue>(
		() => ({
			show,

			success: (options) =>
				show({
					...options,
					type: "success",
				}),

			info: (options) =>
				show({
					...options,
					type: "info",
				}),

			warning: (options) =>
				show({
					...options,
					type: "warning",
				}),

			error: (options) =>
				show({
					...options,
					type: "error",
				}),

			loading: (options) =>
				show({
					...options,
					type: "loading",
				}),
		}),
		[show],
	);

	useEffect(() => {
		toastApi = value;

		return () => {
			toastApi = null;
		};
	}, [value]);

	const severity =
		toastState?.type === "loading" ? "info" : (toastState?.type ?? "info");

	return (
		<ToastContext.Provider value={value}>
			{children}

			<Snackbar
				open={open}
				autoHideDuration={toastState?.duration ?? 4000}
				onClose={close}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
			>
				<Alert
					severity={severity}
					variant="filled"
					onClose={close}
					sx={{
						width: "100%",
						minWidth: 320,
					}}
				>
					{toastState?.title}

					{toastState?.description && <div>{toastState.description}</div>}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error("useToast must be used inside ToastProvider");
	}

	return context;
}
