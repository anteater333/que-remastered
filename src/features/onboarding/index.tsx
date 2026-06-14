import { useEffect } from "react";
import { useLandingLayoutStore } from "../navigation/stores/landingLayoutStore";
import { OnBoardingForm } from "./components/OnBoardingForm";
import { SignUpFNB } from "../navigation/components/SignUpFNB";
import { useAuth } from "../../hooks/useAuth";
import { usePreventLeave } from "../../hooks/utils/usePreventLeave";
import { useNavigate } from "@tanstack/react-router";

const OnBoardingPage = () => {
  // TODO: API 호출

  const navigate = useNavigate();

  const { logout } = useAuth();

  /** 현재 페이지 로드될 때 GNB 상태 조작 */
  const { setGnb, reset } = useLandingLayoutStore();
  useEffect(() => {
    setGnb({ showLogo: true });
    return () => reset();
  }, []);

  usePreventLeave({ enabled: true });

  return (
    <>
      <OnBoardingForm description="" nickname="" onSubmit={async () => {}} />
      <SignUpFNB
        isNextEnabled={true}
        isPrevEnabled={true}
        onNext={() => {}}
        onPrev={() => {
          navigate({ to: "/" });
          logout();
        }}
        showPrev={true}
        prevText="로그아웃"
      />
    </>
  );
};

export default OnBoardingPage;
