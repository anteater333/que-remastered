import { useEffect } from "react";
import { create } from "zustand";

interface StackedLayoutState {
  title: string;
  hideConfirmButton: boolean;
  disableConfirmButton: boolean;
  buttonText: string;
}

interface StackedLayoutActions {
  setGnb: (opts: Partial<StackedLayoutState>) => void;
  reset: () => void;
}

const initialState: StackedLayoutState = {
  title: "",
  hideConfirmButton: false,
  disableConfirmButton: false,
  buttonText: "확인",
};

export const useStackedLayoutStore = create<
  StackedLayoutState & StackedLayoutActions
>((set) => ({
  ...initialState,
  setGnb: (opts) => set(opts),
  reset: () => set(initialState),
}));

/**
 * Stacked Layout의 상태값을 설정하고 이 훅을 호출한 컴포넌트가 사라질때 값을 다시 초기화한다.
 */
export const useStackedLayoutInitiator = (
  opts: Partial<StackedLayoutState>,
) => {
  const { setGnb, reset } = useStackedLayoutStore();

  useEffect(() => {
    setGnb(opts);
    return () => reset();
  }, []);
};
