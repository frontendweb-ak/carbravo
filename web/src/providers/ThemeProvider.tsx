import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type ThemeMode = "light" | "dark" | "system";
interface ThemeContextValue {
	mode: ThemeMode;
	resolvedMode: "light" | "dark";
	setMode: (mode: ThemeMode) => void;
	toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const STORAGE_KEY = "carbravo-theme";

function getSystemTheme(): "light" | "dark" {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialMode(): ThemeMode {
	const storedMode = localStorage.getItem(STORAGE_KEY);
	if (storedMode === "light" || storedMode === "dark" || storedMode === "system") {
		return storedMode;
	}

	return "system";
}

export function ThemeProvider({ children }: PropsWithChildren) {
	const [mode, setModeState] = useState<ThemeMode>(getInitialMode);

	const resolvedMode = mode === "system" ? getSystemTheme() : mode;

	const setMode = useCallback((nextMode: ThemeMode) => {
		setModeState(nextMode);
		localStorage.setItem(STORAGE_KEY, nextMode);
	}, []);

	const toggleMode = useCallback(() => {
		setModeState((currentMode) => {
			const nextMode = currentMode === "dark" ? "light" : "dark";

			localStorage.setItem(STORAGE_KEY, nextMode);

			return nextMode;
		});
	}, []);

	useEffect(() => {
		const root = document.documentElement;

		root.dataset.theme = resolvedMode;

		root.classList.toggle("dark", resolvedMode === "dark");
	}, [resolvedMode]);

	useEffect(() => {
		if (mode !== "system") {
			return;
		}

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleChange = () => {
			const nextResolvedMode = mediaQuery.matches ? "dark" : "light";

			document.documentElement.dataset.theme = nextResolvedMode;

			document.documentElement.classList.toggle("dark", nextResolvedMode === "dark");
		};

		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [mode]);

	const value = useMemo<ThemeContextValue>(
		() => ({
			mode,
			resolvedMode,
			setMode,
			toggleMode,
		}),
		[mode, resolvedMode, setMode, toggleMode],
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}

	return context;
}
