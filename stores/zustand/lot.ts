import { create } from "zustand";

interface LotState {
  lot: {
    id: string;
    maxWidth: number;
    maxHeight: number;
    maxLength: number;
    vehicleId: string;
    startTime: Date;
    endTime: Date;
    durationHours: string;
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
    startTime: new Date(),
    endTime: new Date(),
    durationHours: ""
  },
  setLot: (lot) => set({ lot })
}))