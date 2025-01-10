import { createContext, ReactNode, useContext, useLayoutEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const THEMES = {
    light: [
        "light",
        "purple",
        "pink"
    ],
    dark: [
        "dark",
        "green"
    ]
} as const;

export const ALL_THEMES = [...THEMES.light, ...THEMES.dark];
export const LOCAL_STORAGE_COLOR_PREF_KEY = "COLOR_PREF";

type LightTheme = typeof THEMES.light[number];
type DarkTheme = typeof THEMES.dark[number];
type Theme = {
    type: "light";
    sub: LightTheme;
} | {
    type: "dark";
    sub: DarkTheme;
};

type ThemeContextType = {
    theme: Theme;
    setThemeAndStore: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: {
        type: "dark",
        sub: "dark"
    },
    setThemeAndStore: () => {}
});

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};

export const ThemeProvider = ({ children } : {children : ReactNode}) => {
    const [theme, setTheme] = useState<Theme>({
        type: "dark",
        sub: "dark"
    });

    const {setValue} = useLocalStorage<string>(LOCAL_STORAGE_COLOR_PREF_KEY);

    const setThemeAndStore = (theme: Theme) => {
        document.documentElement.className = theme.type;
        document.documentElement.id = theme.sub;
        setValue(ALL_THEMES.indexOf(theme.sub).toString());
    };

    useLayoutEffect(() => {
        const themeType = document.documentElement.className;
        if (themeType === "dark") {
            setTheme({type: "dark", sub: document.documentElement.id as DarkTheme});
        } else if (themeType === "light") {
            setTheme({type: "light", sub: document.documentElement.id as LightTheme});
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setThemeAndStore }}>
            {children}
        </ThemeContext.Provider>
    );
};