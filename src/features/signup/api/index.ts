import APIInstance from "../../../lib/axios";

export const requestMailVerification = (email: string) => {
  return APIInstance.post("/signup/verification", { email });
};

export const requsetMailVerificationCheck = (email: string, code: string) => {
  return APIInstance.post("/signup/verification/check", { email, code });
};
