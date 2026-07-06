import type { ReactNode } from "react";
import QueSplashProvider from "@/features/splash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import { toastConfig } from "../config/toast";
import { ConfirmProvider } from "./providers/ConfirmProvider";

type RootProviderProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

/**
 * Que 어플리케이션 전체를 감싸는 Provider들에 대한 정의
 */
const RootProvider = ({ children }: RootProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <QueSplashProvider>
          {children}
          <ToastContainer {...toastConfig} />
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueSplashProvider>
      </ConfirmProvider>
    </QueryClientProvider>
  );
};

export default RootProvider;
