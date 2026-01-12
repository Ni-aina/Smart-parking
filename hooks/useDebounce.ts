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

    let debounceTime: ReturnType<typeof setTimeout> | undefined;

    useEffect(() => {
        clearTimeout(debounceTime);

        debounceTime = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
    }, [value])

    return {
        debouncedValue
    }
}
 
export default useDebounce;