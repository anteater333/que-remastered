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
import {
  requestPostOnBoardingProfile,
  requestPostOnBoardingProfileImage,
} from "./api";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

const OnBoardingPage = () => {
  const navigate = useNavigate();

  const { logout, isLoggedIn, refetchProfile } = useAuth();

  /** 현재 페이지 로드될 때 GNB 상태 조작 */
  const { setGnb, reset } = useLandingLayoutStore();
  useEffect(() => {
    setGnb({ showLogo: true });
    return () => reset();
  }, []);

  const formRef = useRef<OnBoardingFormRef>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const confirm = useConfirm();

  const handleSubmit = async (
    value: OnBoardingFormValues & { profileImage: File | null },
  ) => {
    if (
      !(await confirm({
        title: "프로필을 등록하시겠습니까?",
        description: "나중에 언제든 수정할 수 있어요.",
      }))
    ) {
      return;
    }

    // 프로필 정보는 업데이트 대기
    try {
      await requestPostOnBoardingProfile(value.nickname, value.description);

      toast.success("프로필을 작성했습니다.");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data?.error === "VALIDATION_ERROR")
          toast.error(error.response?.data?.errors[0]?.message);
        else toast.error(error.response?.data?.message);
      } else {
        console.error(error);
        toast.error("오류가 발생했습니다.");
      }

      return;
    }

    // 프로필 이미지는 Fire & Forget
    if (value.profileImage) {
      requestPostOnBoardingProfileImage(value.profileImage).catch((error) => {
        toast.error("프로필 이미지 업로드에 실패했습니다.");
        if (isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else {
          console.error(error);
          toast.error("오류가 발생했습니다.");
        }
      });
    }

    await refetchProfile();

    navigate({ to: "/" });
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
        nextText="완료"
      />
    </>
  );
};

export default OnBoardingPage;
