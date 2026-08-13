import { useNavigation } from "react-router-dom";

function NavigationLoader() {
	const navigation = useNavigation();

	if (navigation.state === "idle") {
		return null;
	}

	return (
		<div
			role="progressbar"
			aria-label="Loading page"
			className="fixed inset-x-0 top-0 z-[9999] h-0.5 overflow-hidden bg-primary/20"
		>
			<div className="h-full w-1/3 animate-pulse bg-brand-teal" />
		</div>
	);
}

export { NavigationLoader };
