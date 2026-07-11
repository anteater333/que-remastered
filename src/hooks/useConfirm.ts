import { useContext } from "react";
import { ConfirmContext } from "../app/providers/ConfirmProvider";

export const useConfirm = () => {
  const confirm = useContext(ConfirmContext);

  if (!confirm) {
    throw new Error(
      "useConfirm은 ConfirmProvider 하위에서만 사용할 수 있어요.",
    );
  }

  return confirm;
};
