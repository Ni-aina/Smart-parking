import { create } from "zustand";

interface LotState {
  lot: {
    id: string;
    maxWidth: number;
    maxHeight: number;
    maxLength: number;
    vehicleId: string | null;
    startDate: string | null;
    durationHours: number | null;
    ArrivalTime: string | null;
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
    ArrivalTime: null,
  },
  setLot: (lot) => set({ lot })
}))