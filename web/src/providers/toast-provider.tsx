import { Alert, Snackbar } from "@mui/material";
import {
	createContext,
	useCallback,
	useContext,
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

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toast, setToast] = useState<ToastOptions | null>(null);
	const [open, setOpen] = useState(false);

	const show = useCallback((options: ToastOptions) => {
		setToast(options);
		setOpen(true);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	const value = useMemo<ToastContextValue>(
		() => ({
			show,
			success: (options) => show({ ...options, type: "success" }),
			info: (options) => show({ ...options, type: "info" }),
			warning: (options) => show({ ...options, type: "warning" }),
			error: (options) => show({ ...options, type: "error" }),
			loading: (options) => show({ ...options, type: "loading" }),
		}),
		[show],
	);

	const severity = toast?.type === "loading" ? "info" : (toast?.type ?? "info");

	return (
		<ToastContext.Provider value={value}>
			{children}

			<Snackbar
				open={open}
				autoHideDuration={toast?.duration ?? 4000}
				onClose={close}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert
					onClose={close}
					severity={severity}
					variant="filled"
					sx={{ width: "100%", minWidth: 320 }}
				>
					{toast?.title && <div>{toast.title}</div>}
					{toast?.description && <div>{toast.description}</div>}
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
