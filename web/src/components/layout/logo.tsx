import type { ImgHTMLAttributes } from "react";

export interface LogoProps extends Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"src" | "alt"
> {
	/**
	 * Logo height.
	 * Width is automatically calculated from the SVG aspect ratio.
	 */
	size?: number | string;
	alt?: string;
}

function Logo({
	size = 32,
	alt = "CarBravo",
	className,
	style,
	...props
}: LogoProps) {
	return (
		<div className="flex items-center gap-4">
			<img
				src="/logo.svg"
				alt={alt}
				className={className}
				style={{
					display: "block",
					width: "auto",
					height: size,
					objectFit: "contain",
					...style,
				}}
				{...props}
			/>
			<div className="h-6 w-px bg-border" />

			<span className="text-xs font-semibold tracking-wider text-muted-foreground">
				INCENTIVES
			</span>
		</div>
	);
}

export { Logo };

