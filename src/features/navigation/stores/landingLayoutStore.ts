import { create } from "zustand";

interface LandingLayoutState {
  showLogo: boolean;
}

interface LandingLayoutActions {
  setGnb: (opts: Partial<LandingLayoutState>) => void;
  reset: () => void;
}

const initialState: LandingLayoutState = {
  showLogo: false,
};

export const useLandingLayoutStore = create<
  LandingLayoutState & LandingLayoutActions
>((set) => ({
  ...initialState,
  setGnb: (opts) => set(opts),
  reset: () => set(initialState),
}));
