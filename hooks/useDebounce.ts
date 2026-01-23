import {
    useEffect,
    useState
} from "react";

const useDebounce = <T>({ 
    value,
    delay = 500
}: 
    { 
        value: T,
        delay: number
     }
) => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const debounceTime = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => clearTimeout(debounceTime);
    }, [value])

    return {
        debouncedValue
    }
}
 
export default useDebounce;