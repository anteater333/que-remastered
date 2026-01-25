import styles from "./signup.module.scss";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";
import { useCallback, useRef, useState } from "react";
import { SignUpFNB } from "./components/SignUpFNB";
import { useMailVarificationMutation } from "./hooks/queries/useMailVarificationMutation";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { formatTimer } from "../../utils/formatter";

const INITIAL_TIME = 180;

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [varificationCode, setVarificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [isExpired, setIsExpired] = useState(false);

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
          await requestMailVarification(email);
          setStep(2);
          runTimer();
        } catch (error) {
          if (isAxiosError(error)) {
            toast.error(error.response?.data?.message);
          } else {
            console.error(error);
            toast.error("오류가 발생했습니다.");
          }
        }
        break;
      case 2:
        try {
          if (isExpired) {
            // do nothing
            break;
          }
          // 성공시 타이머 종료
          stopTimer();
        } catch (error) {}
    }
    setIsLoading(false);
  }, [step, email]);

  // 이메일 인증 시 타이머 기능
  const countRef = useRef<number>(INITIAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runTimer = useCallback(() => {
    // 시작 전 타이머가 이미 존재한다면 클리어 처리
    stopTimer();

    countRef.current = INITIAL_TIME;
    setTimeLeft(INITIAL_TIME);
    setIsExpired(false);
    timerRef.current = setInterval(() => {
      // 1초 단위로 타이머 차감 차감
      countRef.current -= 1;
      setTimeLeft(countRef.current);

      if (countRef.current <= 0) {
        stopTimer();
        setIsExpired(true);
        setStep(1);
        setVarificationCode("");
        toast.error("인증 시간이 만료되었습니다.");
      }
    }, 1000);
  }, [stopTimer]);

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
              onKeyDown={(e) => {
                if (e.key === "Enter" && step === 1 && !!email && !isLoading) {
                  handleOnNext();
                }
              }}
              className={styles.input}
              placeholder="이메일"
            />
            {step > 1 && (
              <>
                <TextInput
                  id="signUpVarificationCodeInput"
                  value={varificationCode}
                  type="text"
                  disabled={step !== 2 && !isLoading}
                  onChange={(e) => setVarificationCode(e.target.value)}
                  className={styles.input}
                  placeholder="인증번호"
                />
                <p className={styles.timer}>
                  {formatTimer(timeLeft * 1000)}내에 입력해주세요.
                </p>
              </>
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
