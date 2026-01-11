import { initialLotState } from "@/data/lot";
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
  lot: initialLotState,
  setLot: (lot) => set({ lot })
}))