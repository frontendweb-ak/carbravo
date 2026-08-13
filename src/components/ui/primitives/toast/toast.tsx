import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
	CheckCircle2Icon,
	InfoIcon,
	Loader2Icon,
	TriangleAlertIcon,
	XCircleIcon,
	XIcon,
} from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/utils";

const toast = ToastPrimitive.createToastManager();

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ToastType = "success" | "info" | "warning" | "error" | "loading";

export interface ToastOptions {
	title?: React.ReactNode;
	description?: React.ReactNode;
	type?: ToastType;
	duration?: number;
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */

function ToastProvider({
	toastManager = toast,
	...props
}: ToastPrimitive.Provider.Props) {
	return <ToastPrimitive.Provider toastManager={toastManager} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Portal                                                                     */
/* -------------------------------------------------------------------------- */

function ToastPortal(props: ToastPrimitive.Portal.Props) {
	return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Viewport                                                                    */
/* -------------------------------------------------------------------------- */

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
	return (
		<ToastPrimitive.Viewport
			data-slot="toast-viewport"
			className={cn(
				"pointer-events-none",
				"fixed",
				"bottom-6",
				"left-1/2",
				"z-50",
				"flex",
				"w-[calc(100%-2rem)]",
				"max-w-md",
				"-translate-x-1/2",
				"flex-col",
				"items-stretch",
				"outline-none",
				className,
			)}
			{...props}
		/>
	);
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
	return (
		<ToastPrimitive.Root
			data-slot="toast"
			className={cn(
				"group/toast",
				"pointer-events-auto",
				"absolute",
				"right-0",
				"bottom-0",
				"z-[calc(1000-var(--toast-index))]",
				"w-full",
				"origin-bottom",
				"overflow-hidden",
				"rounded-xl",
				"border",
				"border-border",
				"bg-card",
				"text-card-foreground",
				"shadow-lg",
				"outline-none",
				"select-none",

				/* Stack */
				"[--gap:0.75rem]",
				"[--peek:0.75rem]",
				"[--scale:calc(max(0,1-(var(--toast-index)*0.06)))]",
				"[--shrink:calc(1-var(--scale))]",
				"[--height:var(--toast-frontmost-height,var(--toast-height))]",
				"[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",

				/* Animation */
				"h-(--height)",
				"transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
				"[transition:transform_300ms_cubic-bezier(0.22,1,0.36,1),opacity_300ms_ease,height_150ms_ease]",

				/* Spacing between stacked toasts */
				"after:absolute",
				"after:top-full",
				"after:left-0",
				"after:h-[calc(var(--gap)+1px)]",
				"after:w-full",
				"after:content-['']",

				/* Expanded */
				"data-expanded:h-(--toast-height)",
				"data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",

				/* Entry */
				"data-starting-style:transform-[translateY(150%)]",
				"data-starting-style:opacity-0",

				/* Limited stack */
				"data-limited:pointer-events-none",
				"data-limited:opacity-0",

				/* Exit */
				"[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",

				"data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
				"data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
				"data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
				"data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",

				/* Focus */
				"focus-visible:border-ring",
				"focus-visible:ring-3",
				"focus-visible:ring-ring/30",

				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Content                                                                    */
/* -------------------------------------------------------------------------- */

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
	return (
		<ToastPrimitive.Content
			data-slot="toast-content"
			className={cn(
				"flex",
				"min-h-16",
				"items-start",
				"gap-3",
				"p-4",
				"transition-opacity",
				"duration-200",
				"data-behind:opacity-0",
				"data-expanded:opacity-100",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Title                                                                      */
/* -------------------------------------------------------------------------- */

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
	return (
		<ToastPrimitive.Title
			data-slot="toast-title"
			className={cn(
				"text-sm",
				"font-semibold",
				"leading-5",
				"text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Description                                                                */
/* -------------------------------------------------------------------------- */

function ToastDescription({
	className,
	...props
}: ToastPrimitive.Description.Props) {
	return (
		<ToastPrimitive.Description
			data-slot="toast-description"
			className={cn("text-sm", "leading-5", "text-muted-foreground", className)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Action                                                                     */
/* -------------------------------------------------------------------------- */

function ToastAction({
	className,
	render = <Button variant="outline" size="sm" />,
	...props
}: ToastPrimitive.Action.Props) {
	return (
		<ToastPrimitive.Action
			data-slot="toast-action"
			render={render}
			className={cn("shrink-0", className)}
			{...props}
		/>
	);
}

/* -------------------------------------------------------------------------- */
/* Close                                                                      */
/* -------------------------------------------------------------------------- */

function ToastClose({
	className,
	children,
	render = <Button variant="ghost" size="icon-sm" />,
	...props
}: ToastPrimitive.Close.Props) {
	return (
		<ToastPrimitive.Close
			data-slot="toast-close"
			aria-label="Close notification"
			render={render}
			className={cn(
				"relative",
				"shrink-0",
				"text-muted-foreground",
				"after:absolute",
				"after:-inset-2",
				"after:content-['']",
				"hover:text-foreground",
				className,
			)}
			{...props}
		>
			{children ?? <XIcon aria-hidden="true" className="size-4" />}
		</ToastPrimitive.Close>
	);
}

/* -------------------------------------------------------------------------- */
/* Icon                                                                       */
/* -------------------------------------------------------------------------- */

const toastIconVariants: Record<ToastType, React.ReactNode> = {
	success: <CheckCircle2Icon aria-hidden="true" className="text-success" />,

	info: <InfoIcon aria-hidden="true" className="text-info" />,

	warning: <TriangleAlertIcon aria-hidden="true" className="text-warning" />,

	error: <XCircleIcon aria-hidden="true" className="text-destructive" />,

	loading: (
		<Loader2Icon
			aria-hidden="true"
			className="animate-spin text-muted-foreground"
		/>
	),
};

function ToastIcon({ type }: { type?: string }) {
	if (!type || !(type in toastIconVariants)) {
		return null;
	}

	return (
		<span
			data-slot="toast-icon"
			className={cn(
				"mt-0.5",
				"flex",
				"size-5",
				"shrink-0",
				"items-center",
				"justify-center",
				"[&_svg]:size-5",
				"[&_svg]:shrink-0",
			)}
		>
			{toastIconVariants[type as ToastType]}
		</span>
	);
}

/* -------------------------------------------------------------------------- */
/* Toast List                                                                 */
/* -------------------------------------------------------------------------- */

function ToastList() {
	const { toasts } = ToastPrimitive.useToastManager();

	return toasts.map((toastItem) => {
		const type =
			typeof toastItem.type === "string" ? toastItem.type : undefined;

		return (
			<Toast key={toastItem.id} toast={toastItem}>
				<ToastContent>
					<ToastIcon type={type} />

					<div className={cn("min-w-0", "flex-1", "space-y-0.5")}>
						<ToastTitle />

						<ToastDescription />
					</div>

					<ToastAction />

					<ToastClose />
				</ToastContent>
			</Toast>
		);
	});
}

/* -------------------------------------------------------------------------- */
/* Toaster                                                                    */
/* -------------------------------------------------------------------------- */

export interface ToasterProps extends ToastPrimitive.Provider.Props {}

function Toaster({ children, toastManager = toast, ...props }: ToasterProps) {
	return (
		<ToastProvider toastManager={toastManager} {...props}>
			{children}

			<ToastPortal>
				<ToastViewport>
					<ToastList />
				</ToastViewport>
			</ToastPortal>
		</ToastProvider>
	);
}

const createToastManager = ToastPrimitive.createToastManager;

const useToastManager = ToastPrimitive.useToastManager;

export {
	createToastManager,
	Toast,
	toast,
	ToastAction,
	ToastClose,
	ToastContent,
	ToastDescription,
	Toaster,
	ToastIcon,
	ToastPortal,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	useToastManager,
};
