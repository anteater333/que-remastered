import { useCallback, useState } from "react";
import { TextInput } from "../../../components/Inputs/TextInput";
import styles from "../signup.module.scss";

import type { SignUpSceneProps } from "../types";
import { SignUpFNB } from "../components/SignUpFNB";
import { toast } from "react-toastify";
import { useSignUpMutation } from "../hooks/queries";
import { isAxiosError } from "axios";
import { RESERVED_HANDLES } from "../../../../shared/keywords";

interface HandleFailReason {
  isValidated: boolean;
  hasProperLength: boolean; // 3~20자 여부
  hasAllowedCharsOnly: boolean; // 영문 소문자, 숫자, 마침표(.), 언더바(_)만 포함
  startsWithLetter: boolean; // 영문으로 시작하는지
  endsWithAlphanumeric: boolean; // 마침표나 언더바로 끝나지 않는지
  hasNoConsecutiveSymbols: boolean; // 기호(., _)가 연속으로 나오지 않는지
  isNotReserved: boolean; // 예약어(admin 등)가 아닌지
}

/**
 * 핸들 유효성 검사
 */
const checkHandleValidation = (handle: string): HandleFailReason => {
  // 1. 길이 체크 (3~20자)
  const hasProperLength = handle.length >= 3 && handle.length <= 20;

  // 2. 허용된 문자만 있는지 (영문 소문자, 숫자, ., _)
  const hasAllowedCharsOnly = /^[a-z0-9._]+$/.test(handle);

  // 3. 영문으로 시작하는지
  const startsWithLetter = /^[a-z]/.test(handle);

  // 4. 영문 또는 숫자로 끝나는지 (마침표나 언더바 종료 방지)
  const endsWithAlphanumeric = /[a-z0-9]$/.test(handle);

  // 5. 기호(., _)가 연속으로 사용되었는지 확인
  // .. , __ , ._ , _. 이 포함되어 있지 않아야 함
  const hasNoConsecutiveSymbols = !/\.\.|__|_\.|\._/.test(handle);

  // 6. 예약어 포함 여부 확인
  const isNotReserved = !RESERVED_HANDLES.includes(handle);

  // 모든 조건이 참이어야 최종 통과
  const isValidated =
    hasProperLength &&
    hasAllowedCharsOnly &&
    startsWithLetter &&
    endsWithAlphanumeric &&
    hasNoConsecutiveSymbols &&
    isNotReserved;

  return {
    isValidated,
    hasProperLength,
    hasAllowedCharsOnly,
    startsWithLetter,
    endsWithAlphanumeric,
    hasNoConsecutiveSymbols,
    isNotReserved,
  };
};

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
const checkPasswordValidation = (password: string): PasswordFailReason => {
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
}: SignUpSceneProps<{ userId: string }> & { email: string }) => {
  const [handle, setHandle] = useState("");
  const [handleFailReason, setHandleFailReason] = useState<HandleFailReason>({
    isValidated: false,
    endsWithAlphanumeric: false,
    hasAllowedCharsOnly: false,
    hasNoConsecutiveSymbols: false,
    hasProperLength: false,
    isNotReserved: false,
    startsWithLetter: false,
  });
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
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: signUp } = useSignUpMutation();

  const handleOnPrev = useCallback(() => {
    setStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleOnNext = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    switch (step) {
      case 0:
        const handleResult = checkHandleValidation(handle);
        setHandleFailReason(handleResult);
        if (handleResult.isValidated) {
          setPassword("");
          setStep(1);
        }
        break;
      case 1:
        const passwordResult = checkPasswordValidation(password);
        setPasswordFailReason(passwordResult);
        if (passwordResult.isValidated) {
          setPasswordCheck("");
          setStep(2);
        }
        break;
      case 2:
        if (password !== passwordCheck) {
          toast.warn("비밀번호가 다릅니다!");
          break;
        }
        try {
          const { userId } = await signUp({ email, handle, password });

          toast.success("회원가입이 완료되었습니다!");

          onValidated({ userId });
        } catch (error) {
          if (isAxiosError(error)) {
            toast.error(error.response?.data?.message);
          } else {
            console.error(error);
            toast.error("오류가 발생했습니다.");
          }
        }
        break;
    }
    setIsLoading(false);
  }, [email, handle, password, step, passwordCheck]);

  return (
    <>
      <div className={styles.signupContainer}>
        <div className={styles.passwordSceneContainer}>
          <p className={styles.email}>{email}</p>

          <TextInput
            id="signUpHandle"
            value={handle}
            disabled={step !== 0}
            onChange={(e) => {
              setHandleFailReason(checkHandleValidation(e.target.value));
              setHandle(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && step === 0 && !!handle) {
                handleOnNext();
              }
            }}
            type="text"
            className={styles.input}
            placeholder="Handle을 입력해주세요."
          />
          {step === 0 && (
            <div className={styles.hintContainer}>
              <p>
                3 ~ 20자 이내 {handleFailReason.hasProperLength ? "✅" : "❌"}
              </p>
              <p>
                허용된 문자만 포함(영어 소문자, 숫자, 언더바, 온점){" "}
                {handleFailReason.hasAllowedCharsOnly ? "✅" : "❌"}
              </p>
              <p>
                영문자로 시작 {handleFailReason.startsWithLetter ? "✅" : "❌"}
              </p>
              <p>
                기호로 끝나지 않음{" "}
                {handleFailReason.endsWithAlphanumeric ? "✅" : "❌"}
              </p>
              <p>
                기호 연속 사용하지 않음{" "}
                {handleFailReason.hasNoConsecutiveSymbols ? "✅" : "❌"}
              </p>
              <p>
                예약어 사용하지 않음{" "}
                {handleFailReason.isNotReserved ? "✅" : "❌"}
              </p>
              {handleFailReason.isValidated && (
                <p className={styles.handlePreview}>@{handle}</p>
              )}
            </div>
          )}
          {step >= 1 && (
            <>
              <TextInput
                id="signUpPassword"
                value={password}
                disabled={step !== 1}
                onChange={(e) => {
                  setPasswordFailReason(
                    checkPasswordValidation(e.target.value),
                  );
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
                <div className={styles.hintContainer}>
                  <p>
                    8 ~ 20자 이내{" "}
                    {passwordFailReason.hasProperLength ? "✅" : "❌"}
                  </p>
                  <p>숫자 포함 {passwordFailReason.hasNumber ? "✅" : "❌"}</p>
                  <p>
                    영문자 포함 {passwordFailReason.hasLetter ? "✅" : "❌"}
                  </p>
                  <p>공백 미포함 {passwordFailReason.hasSpace ? "❌" : "✅"}</p>
                </div>
              )}
            </>
          )}
          {step >= 2 && (
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
          ((step === 0 && !!handle && handleFailReason.isValidated) ||
            (step === 1 && !!password && passwordFailReason.isValidated) ||
            (step === 2 && !!passwordCheck)) &&
          !isLoading
        }
        showPrev={step > 0}
        isPrevEnabled={!isLoading}
      />
    </>
  );
};

export default PasswordScene;
