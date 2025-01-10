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

function getCurrentTheme() : Theme {
    const themeType = document.documentElement.className;
    if (themeType === "dark") {
        return {type: "dark", sub: document.documentElement.id as DarkTheme};
    } else if (themeType === "light") {
        return {type: "light", sub: document.documentElement.id as LightTheme};
    }

    return {type: "dark", sub: "dark"};
}

export const ThemeProvider = ({ children } : {children : ReactNode}) => {
    const [theme, setTheme] = useState<Theme>(getCurrentTheme());

    const {setValue} = useLocalStorage<string>(LOCAL_STORAGE_COLOR_PREF_KEY);

    const setThemeAndStore = (theme: Theme) => {
        document.documentElement.className = theme.type;
        document.documentElement.id = theme.sub;
        setTheme(theme);
        setValue(ALL_THEMES.indexOf(theme.sub).toString());
    };

    return (
        <ThemeContext.Provider value={{ theme, setThemeAndStore }}>
            {children}
        </ThemeContext.Provider>
    );
};