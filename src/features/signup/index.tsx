import { useState } from "react";
import EmailScene from "./scenes/EmailScene";
import PasswordScene from "./scenes/PasswordScene";
import { useNavigate } from "@tanstack/react-router";

type SIGNUP_SCENE_CODE = "EMAIL" | "PASSWORD";

const SignupPage = () => {
  const [scene, setScene] = useState<SIGNUP_SCENE_CODE>("EMAIL");

  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleEmailValidated = (payload: { email: string }) => {
    setEmail(payload.email);
    setScene("PASSWORD");
  };

  const handleSignUpCompleted = () => {
    navigate({ to: "/login", replace: true });
  };

  return (
    <>
      {scene === "EMAIL" && <EmailScene onValidated={handleEmailValidated} />}
      {scene === "PASSWORD" && (
        <PasswordScene email={email} onValidated={handleSignUpCompleted} />
      )}
    </>
  );
};

export default SignupPage;
