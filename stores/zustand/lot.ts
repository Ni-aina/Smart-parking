import { create } from "zustand";

interface LotState {
  lot: {
    id: string;
    maxWidth: number;
    maxHeight: number;
    maxLength: number;
    vehicleId: string;
    startDate: Date;
    arrivalTime: Date;
    durationHours: number;
  }
  setLot: (lot: LotState["lot"]) => void;
}

export const useLotStore = create<LotState>((set) => ({
  lot: {
    id: "",
    maxWidth: 0,
    maxHeight: 0,
    maxLength: 0,
    vehicleId: "",
    startDate: new Date(),
    arrivalTime: new Date(),
    durationHours: 0
  },
  setLot: (lot) => set({ lot })
}))