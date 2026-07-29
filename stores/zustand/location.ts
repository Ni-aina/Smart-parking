import { rejectTimeout } from "@/utils/rejectTimeout";
import * as Location from "expo-location";
import { create } from "zustand";

type LocationType = {
  latitude: number;
  longitude: number;
}

type LocationStore = {
  location: LocationType;
  getLocation: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

// ispm location
const defaultLocation = {
  latitude: -18.916479,
  longitude: 47.5657178
}

export const useLocationStore = create<LocationStore>((set) => ({
  location: defaultLocation,
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
    } catch (error: unknown) {
      console.error(error)
    }
  },
  refreshLocation: async () => {
    await useLocationStore.getState().getLocation();
  }
}))

export const initializeLocation = () => {
  useLocationStore.getState().getLocation();
}