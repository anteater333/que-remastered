import { useMutation } from "@tanstack/react-query";
import {
  requestMailVerification,
  requestMailVerificationCheck,
  requestSignUp,
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
      return requestMailVerificationCheck(email, code);
    },
  });
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => {
      return requestSignUp(email, password);
    },
  });
};
