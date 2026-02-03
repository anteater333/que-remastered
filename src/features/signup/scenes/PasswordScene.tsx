import { useCallback, useState } from "react";
import { TextInput } from "../../../components/Inputs/TextInput";
import styles from "../signup.module.scss";

import type { SignUpSceneProps } from "../types";
import { SignUpFNB } from "../components/SignUpFNB";
import { toast } from "react-toastify";

interface PasswordFailReason {
  isValidated: boolean;
  hasProperLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
  hasSpace: boolean;
}

/**
 * 비밀번호 유효성 검사 (8~20자, 영문+숫자 포함)
 */
const checkValidatePassword = (password: string): PasswordFailReason => {
  // 1. 길이 체크 (8~20자)
  const hasProperLength = !(password.length < 8 || password.length > 20);

  // 2. 영문 포함 여부 확인 (최소 하나)
  const hasLetter = /[a-zA-Z]/.test(password);

  // 3. 숫자 포함 여부 확인 (최소 하나)
  const hasNumber = /\d/.test(password);

  // 4. 공백 포함 여부 확인
  const hasSpace = /\s/.test(password);

  // 영문과 숫자가 모두 있고, 공백이 없으면 통과
  return {
    isValidated: hasProperLength && hasLetter && hasNumber && !hasSpace,
    hasProperLength,
    hasLetter,
    hasNumber,
    hasSpace,
  };
};

const PasswordScene = ({
  onValidated,
  email,
}: SignUpSceneProps<{}> & { email: string }) => {
  const [password, setPassword] = useState("");
  const [passwordFailReason, setPasswordFailReason] =
    useState<PasswordFailReason>({
      isValidated: false,
      hasLetter: false,
      hasNumber: false,
      hasProperLength: false,
      hasSpace: false,
    });
  const [passwordCheck, setPasswordCheck] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnPrev = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleOnNext = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    switch (step) {
      case 1:
        const result = checkValidatePassword(password);
        setPasswordFailReason(result);
        if (result.isValidated) {
          setPasswordCheck("");
          setStep(2);
        }
        break;
      case 2:
        if (password !== passwordCheck) {
          toast.warn("비밀번호가 다릅니다!");
        }
        break;
    }
    setIsLoading(false);
  }, [password, step, passwordCheck]);

  return (
    <>
      <div className={styles.signupContainer}>
        <div className={styles.passwordSceneContainer}>
          <p className={styles.email}>{email}</p>
          <TextInput
            id="signUpPassword"
            value={password}
            disabled={step !== 1}
            onChange={(e) => {
              setPasswordFailReason(checkValidatePassword(e.target.value));
              setPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && step === 1 && !!password) {
                handleOnNext();
              }
            }}
            type="password"
            className={styles.input}
            placeholder="비밀번호를 입력해주세요."
          />
          {step === 1 && (
            <div className={styles.passwordHint}>
              <p>
                8 ~ 20자 이내 {passwordFailReason.hasProperLength ? "✅" : "❌"}
              </p>
              <p>숫자 포함 {passwordFailReason.hasNumber ? "✅" : "❌"}</p>
              <p>영문자 포함 {passwordFailReason.hasLetter ? "✅" : "❌"}</p>
              <p>공백 미포함 {passwordFailReason.hasSpace ? "❌" : "✅"}</p>
            </div>
          )}
          {step > 1 && (
            <TextInput
              id="signUpPasswordCheck"
              value={passwordCheck}
              disabled={step !== 2}
              onChange={(e) => setPasswordCheck(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && step === 2 && !!passwordCheck) {
                  handleOnNext();
                }
              }}
              type="password"
              className={styles.input}
              placeholder="한 번 더 입력해주세요."
            />
          )}
        </div>
      </div>
      <SignUpFNB
        onPrev={handleOnPrev}
        onNext={handleOnNext}
        isNextEnabled={
          ((step === 1 && !!password && passwordFailReason.isValidated) ||
            (step === 2 && !!passwordCheck)) &&
          !isLoading
        }
        showPrev={step > 1}
        isPrevEnabled={!isLoading}
      />
    </>
  );
};

export default PasswordScene;
