import { getVehicleCategories } from "@/actions/category.action";
import { useQuery } from "@tanstack/react-query";

const useCategory = () => {
    
    const { 
        data: categories,
        isLoading
     } = useQuery({
        queryKey: ["fetch-vehicle-categories"],
        queryFn: async () => {
            return await getVehicleCategories();
        }
    })

    return {
        categories,
        isLoading
    }
}
 
export default useCategory;