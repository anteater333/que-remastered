import { useMutation } from "@tanstack/react-query";
import {
  requestMailVerification,
  requsetMailVerificationCheck,
} from "../../api";

export const useMailVerificationMutation = () => {
  return useMutation({
    mutationFn: (email: string) => {
      return requestMailVerification(email);
    },
  });
};

export const useMailVerificationCheckMutation = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => {
      return requsetMailVerificationCheck(email, code);
    },
  });
};
