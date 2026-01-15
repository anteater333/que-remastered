import { useMutation } from "@tanstack/react-query";
import { requestMailVarification } from "../../api";

export const useMailVarificationMutation = () => {
  return useMutation({
    mutationFn: (email: string) => {
      return requestMailVarification(email);
    },
  });
};
