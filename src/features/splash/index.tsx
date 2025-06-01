import type { ReactNode } from "react";
import Splash from "./components/Splash";

type QueSplashProps = {
  children: ReactNode;
};

/**
 * Que 어플리케이션의 시작을 알리는 스플래시 화면을 담당.
 * 스플래시 화면을 표출한 다음 어플리케이션 시작을 위한 준비를 합니다.
 * 최소 표시 시간 경과 & 어플리케이션 준비가 완료되면 스플래시 화면을 종료합니다.
 */
const QueSplashProvider = ({ children }: QueSplashProps) => {
  return (
    <>
      <Splash />
      {children}
    </>
  );
};

export default QueSplashProvider;
