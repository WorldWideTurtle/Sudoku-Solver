export function Capitalize(s : string) {
    if (s.length < 2) {
        return s.toLocaleUpperCase()
    }

    return s[0].toLocaleUpperCase() + s.substring(1).toLowerCase()
}