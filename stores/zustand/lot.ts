import { initialLotState } from "@/data/lot";
import { LotStateInterface } from "@/types/lot";
import { create } from "zustand";

interface LotState {
  lot: LotStateInterface
  setLot: (lot: LotState["lot"]) => void;
}

export const useLotStore = create<LotState>((set) => ({
  lot: initialLotState,
  setLot: (lot) => set({ lot })
}))