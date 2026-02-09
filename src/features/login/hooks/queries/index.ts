import { useMutation } from "@tanstack/react-query";
import { requestLogin } from "../../api";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return requestLogin(email, password);
    },
  });
};
