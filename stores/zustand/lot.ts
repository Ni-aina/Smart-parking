import { create } from "zustand";

interface LotState {
  lot: {
    id: string;
    lotArea: string;
    lotAddress: string;
    maxWidth: number;
    maxHeight: number;
    maxLength: number;
    vehicleId: string;
    vehicleModel: string;
    pricPerHour: number;
    startTime: Date;
    endTime: Date;
    durationHours: string;
  }
  setLot: (lot: LotState["lot"]) => void;
}

export const useLotStore = create<LotState>((set) => ({
  lot: {
    id: "",
    lotArea: "",
    lotAddress: "",
    maxWidth: 0,
    maxHeight: 0,
    maxLength: 0,
    vehicleId: "",
    vehicleModel: "",
    pricPerHour: 0,
    startTime: new Date(),
    endTime: new Date(),
    durationHours: ""
  },
  setLot: (lot) => set({ lot })
}))