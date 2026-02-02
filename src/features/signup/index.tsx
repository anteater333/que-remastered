import { useState } from "react";
import EmailScene from "./scenes/EmailScene";
import PasswordScene from "./scenes/PasswordScene";

type SIGNUP_SCENE_CODE = "EMAIL" | "PASSWORD";

const SignupPage = () => {
  const [scene, setScene] = useState<SIGNUP_SCENE_CODE>("EMAIL");

  const [email, setEmail] = useState("");

  const handleEmailValidated = (payload: { email: string }) => {
    setEmail(payload.email);
    setScene("PASSWORD");
  };

  return (
    <>
      {scene === "EMAIL" && <EmailScene onValidated={handleEmailValidated} />}
      {scene === "PASSWORD" && (
        <PasswordScene email={email} onValidated={() => {}} />
      )}
    </>
  );
};

export default SignupPage;
