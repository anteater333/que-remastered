import APIInstance from "../../../lib/axios";

export const requestMailVarification = (email: string) => {
  return APIInstance.post("/signup/verification", { email });
};
