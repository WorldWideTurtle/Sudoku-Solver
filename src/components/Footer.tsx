import { useTheme } from "./contexts/theme-context"

export function Footer() {
    const theme = useTheme();
    const year = new Date().getFullYear()
    return (
        <footer className="w-full bg-popover h-fit p-2 text-center relative">
            <p className="text-sm font-extralight">&copy; {year} WorldWideTurtle. All rights reserved.</p>
            <div className="absolute h-full right-4 top-0 flex flex-col justify-center w-fit">
                <button onClick={theme.cycle} className="size-6 cursor-pointer rounded-full bg-background dark:border border-foreground/10 border-solid shadow-sm shadow-foreground dark:shadow-none"></button>
            </div>
        </footer>
    )
}