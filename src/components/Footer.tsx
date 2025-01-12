export function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="w-full bg-popover h-fit p-2 text-center">
            <p>&copy; {year} WorldWideTurtle. All rights reserved.</p>
        </footer>
    )
}