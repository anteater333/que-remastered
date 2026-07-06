import { useEffect, useRef, useState } from "react";
import { useLandingLayoutStore } from "../navigation/stores/landingLayoutStore";
import {
  OnBoardingForm,
  type OnBoardingFormRef,
  type OnBoardingFormValues,
} from "./components/OnBoardingForm";
import { SignUpFNB } from "../navigation/components/SignUpFNB";
import { useAuth } from "../../hooks/useAuth";
import { usePreventLeave } from "../../hooks/utils/usePreventLeave";
import { useNavigate } from "@tanstack/react-router";
import { useConfirm } from "../../hooks/useConfirm";

const OnBoardingPage = () => {
  // TODO: API 호출

  const navigate = useNavigate();

  const { logout, isLoggedIn } = useAuth();

  /** 현재 페이지 로드될 때 GNB 상태 조작 */
  const { setGnb, reset } = useLandingLayoutStore();
  useEffect(() => {
    setGnb({ showLogo: true });
    return () => reset();
  }, []);

  const formRef = useRef<OnBoardingFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const confirm = useConfirm();

  const handleSubmit = async (value: OnBoardingFormValues) => {
    if (await confirm({ title: "테스트" })) {
    }
    try {
      console.log(value);
    } catch (error) {}
  };

  /** 페이지 이탈 방어 */
  usePreventLeave({ enabled: true });

  if (!isLoggedIn) {
    navigate({ to: "/" });
  }

  return (
    <>
      <OnBoardingForm
        description=""
        nickname=""
        ref={formRef}
        onSubmit={handleSubmit}
        onValidChange={setIsFormValid}
      />
      <SignUpFNB
        isNextEnabled={isFormValid}
        isPrevEnabled={true}
        onNext={() => formRef.current?.submit()}
        onPrev={async () => {
          await logout();
          navigate({ to: "/" });
        }}
        showPrev={true}
        prevText="로그아웃"
      />
    </>
  );
};

export default OnBoardingPage;
