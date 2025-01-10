import { useCallback } from "react";

export function useLocalStorage<T extends string>(key: string) {
    const setValue = useCallback((value: T) : boolean => {
        if (window.localStorage) {
            localStorage.setItem(key, value);
            return true;
        }

        return false;
    },[key]);

    const getValue = useCallback(() : T | null => {
        if (!window.localStorage) {
            return null;
        }
        return localStorage.getItem(key) as T | null;
    },[key]);

    return { setValue, getValue };
}