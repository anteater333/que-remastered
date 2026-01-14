import { useMutation } from "@tanstack/react-query";

export const useMailVarificationMutation = () => {
  return useMutation({
    mutationFn: (email: string) => {
      return new Promise((resolve, reject) => {
        console.log("Hello");
        reject("");
      });
    },
  });
};
