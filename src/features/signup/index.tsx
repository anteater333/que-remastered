import styles from "./signup.module.scss";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";
import { useCallback, useState } from "react";
import { SignUpFNB } from "./components/SignUpFNB";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [varificationCode, setVarificationCode] = useState("");

  const [step, setStep] = useState(1);

  const handleOnPrev = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleOnNext = useCallback(() => {
    switch (step) {
      case 1:
        setStep(2);
        break;
    }
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
              disabled={step !== 1}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="이메일"
            />
            {step > 1 && (
              <TextInput
                id="signUpVarificationCodeInput"
                value={varificationCode}
                type="text"
                disabled={step !== 2}
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
        isNextEnabled={!!email}
      />
    </>
  );
};

export default SignupPage;
