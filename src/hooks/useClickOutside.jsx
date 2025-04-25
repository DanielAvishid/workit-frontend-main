import { useState, useEffect } from "react";

export function useClickOutside(ref) {

    const [isFocus, setIsFocus] = useState(false);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsFocus(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        }
    }, [])

    return { isFocus, setIsFocus }
}