import { Colors } from "@/constants/Colors";

const useActiveBar = ({ colorscheme }: { colorscheme: "dark" | "light" }) => {

    const barColors = {
        active: {
            color: Colors[colorscheme].background,
            backgroundColor: Colors[colorscheme].tint
        },
        inactive: {
            color: Colors[colorscheme].text,
            backgroundColor: Colors[colorscheme].background
        }
    }

    return {
        barColors
    }
}

export default useActiveBar;