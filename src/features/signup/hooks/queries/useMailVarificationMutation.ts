import { useMutation } from "@tanstack/react-query";

export const useMailVarificationMutation = () => {
  return useMutation({
    mutationFn: () => {
      return new Promise((resolve) => {
        console.log("Hello");
        resolve("");
      });
    },
  });
};
