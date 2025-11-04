import { rejectTimeout } from "@/utils/rejectTimeout";
import * as Location from "expo-location";
import { create } from "zustand";

type LocationType = {
  latitude: number;
  longitude: number;
} | null;

type LocationStore = {
  location: LocationType;
  getLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: null,
  
  getLocation: async () => {
    try {
      const request = (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        
        const locationResult = await Location.getCurrentPositionAsync({});
        set({
          location: {
            latitude: locationResult.coords.latitude,
            longitude: locationResult.coords.longitude
          }
        })
      })()
      
      await Promise.race([request, rejectTimeout]);
    } catch {
      set({ location: null });
    }
  },
  refreshLocation: async () => {
    await useLocationStore.getState().getLocation();
  }
}))

export const initializeLocation = () => {
  useLocationStore.getState().getLocation();
}