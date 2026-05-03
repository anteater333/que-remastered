import { useMutation } from "@tanstack/react-query";
import { requestPostStage } from "../../api";

export const useCreateStageMutation = () => {
  return useMutation({
    mutationFn: () => {
      return requestPostStage();
    },
  });
};
