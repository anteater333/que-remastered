import type { ReactNode } from "react";
import QueSplashProvider from "@/features/splash";

type RootProviderProps = {
  children: ReactNode;
};

/**
 * Que 어플리케이션 전체를 감싸는 Provider들에 대한 정의
 */
const RootProvider = ({ children }: RootProviderProps) => {
  return <QueSplashProvider>{children}</QueSplashProvider>;
};

export default RootProvider;
