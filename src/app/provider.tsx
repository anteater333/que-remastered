import type { ReactNode } from "react";
import QueSplashProvider from "@/features/splash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
      <QueSplashProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueSplashProvider>
    </QueryClientProvider>
  );
};

export default RootProvider;
