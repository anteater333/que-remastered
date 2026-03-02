import { useMutation } from "@tanstack/react-query";
import {
  requestMailVerification,
  requestMailVerificationCheck,
  requestSignUp,
} from "../../api";

export const useMailVerificationMutation = () => {
  return useMutation({
    mutationFn: (email: string) => requestMailVerification(email),
  });
};

export const useMailVerificationCheckMutation = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      requestMailVerificationCheck(email, code),
  });
};

export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: ({
      email,
      handle,
      password,
    }: {
      email: string;
      handle: string;
      password: string;
    }) => requestSignUp(email, handle, password),
  });
};
