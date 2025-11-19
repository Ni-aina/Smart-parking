import { create } from "zustand";

interface LotState {
  lot: {
    id: string;
    maxWidth: number;
    maxHeight: number;
    maxLength: number;
    vehicleId: string | null;
    startDate: string | null;
    arrivalTime: string | null;
    durationHours: number | null;
  }
  setLot: (lot: LotState["lot"]) => void;
}

export const useLotStore = create<LotState>((set) => ({
  lot: {
    id: "",
    maxWidth: 0,
    maxHeight: 0,
    maxLength: 0,
    vehicleId: null,
    startDate: null,
    durationHours: null,
    arrivalTime: null,
  },
  setLot: (lot) => set({ lot })
}))