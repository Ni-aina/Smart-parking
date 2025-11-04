import { Colors } from "@/constants/Colors";

const useActiveBar = ({ colorSchema }: { colorSchema: "dark" | "light" }) => {

    const barColors = {
        active: {
            color: Colors[colorSchema].background,
            backgroundColor: Colors[colorSchema].tint
        },
        inactive: {
            color: Colors[colorSchema].text,
            backgroundColor: Colors[colorSchema].background
        }
    }

    return {
        barColors
    }
}

export default useActiveBar;