import { getVehicleCategories } from "@/actions/category.action";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const useCategory = () => {
    const { i18n } = useTranslation();
    
    const { 
        data: categories,
        isLoading
     } = useQuery({
        queryKey: ["fetch-vehicle-categories", i18n.language],
        queryFn: async () => {
            return await getVehicleCategories(i18n.language);
        }
    })

    return {
        categories,
        isLoading
    }
}
 
export default useCategory;