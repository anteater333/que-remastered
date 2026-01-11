import styles from "./signup.module.scss";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";
import { useCallback, useState } from "react";
import { SignUpFNB } from "./components/SignUpFNB";
import { useMailVarificationMutation } from "./hooks/queries/useMailVarificationMutation";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [varificationCode, setVarificationCode] = useState("");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: requestMailVarification } =
    useMailVarificationMutation();

  const handleOnPrev = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleOnNext = useCallback(async () => {
    setIsLoading(true);
    switch (step) {
      case 1:
        try {
          try {
            await requestMailVarification(email);
            setStep(2);
          } catch (error) {
            console.error(error);
          }
        } catch (error) {
          alert(error);
        }
        break;
    }
    setIsLoading(false);
  }, [step]);

  return (
    <>
      <div className={styles.signupContainer}>
        <div className={styles.upper}>
          <div className={styles.logo}>
            <LogoText isColored />
          </div>
          <div className={styles.label}>회원가입</div>
        </div>
        <div className={styles.lower}>
          <div className={styles.lowerInner}>
            <TextInput
              id="signUpEmailInput"
              value={email}
              type="email"
              disabled={step !== 1 && !isLoading}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="이메일"
            />
            {step > 1 && (
              <TextInput
                id="signUpVarificationCodeInput"
                value={varificationCode}
                type="text"
                disabled={step !== 2 && !isLoading}
                onChange={(e) => setVarificationCode(e.target.value)}
                className={styles.input}
                placeholder="인증번호"
              />
            )}
          </div>
        </div>
      </div>
      <SignUpFNB
        showPrev={step > 1}
        onPrev={handleOnPrev}
        onNext={handleOnNext}
        isNextEnabled={
          ((step === 1 && !!email) || (step === 2 && !!varificationCode)) &&
          !isLoading
        }
        isPrevEnabled={!isLoading}
      />
    </>
  );
};

export default SignupPage;
