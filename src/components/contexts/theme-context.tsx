import { createContext, ReactNode, useContext, useEffect, useState } from "react";
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
        type: "light",
        sub: "light"
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
        type: "light",
        sub: "light"
    });

    const {setValue, getValue} = useLocalStorage<string>(LOCAL_STORAGE_COLOR_PREF_KEY);

    const setThemeAndStore = (theme: Theme) => {
        setTheme(theme);
        setValue(ALL_THEMES.indexOf(theme.sub).toString());
    };

    useEffect(() => {
        let onMediaChangeHandler = (event : MediaQueryListEvent) => {
            const isLightMode = !event.matches;
            if (isLightMode) {
                setTheme({type:"light",sub:THEMES.light[0]})
            } else {
                setTheme({type:"dark",sub:THEMES.dark[0]})
            }
        };

        if (getValue() !== null) {
            const chosenTheme = ALL_THEMES[+getValue()!];
            const isLightMode = THEMES.dark.find(e=>e===chosenTheme) === undefined;
            if (isLightMode) {
                setTheme({type:"light",sub:chosenTheme as LightTheme})
            } else {
                setTheme({type:"dark",sub:chosenTheme as DarkTheme})
            }
        } else if (window.matchMedia) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setTheme({type:"dark",sub:THEMES.dark[0]})
            }

            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onMediaChangeHandler);
        }

        return () => {
            window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', onMediaChangeHandler);
        }
    }, [getValue]);

    return (
        <ThemeContext.Provider value={{ theme, setThemeAndStore }}>
            {children}
        </ThemeContext.Provider>
    );
};