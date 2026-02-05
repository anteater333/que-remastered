import APIInstance from "../../../lib/axios";

export const requestMailVerification = (email: string) => {
  return APIInstance.post("/signup/verification", { email });
};

export const requestMailVerificationCheck = (email: string, code: string) => {
  return APIInstance.post("/signup/verification/check", { email, code });
};

export interface SignUpResponse {
  userId: string;
}

export const requestSignUp = async (
  email: string,
  password: string,
): Promise<SignUpResponse> => {
  return (
    await APIInstance.post<SignUpResponse>("/signup", { email, password })
  ).data;
};
