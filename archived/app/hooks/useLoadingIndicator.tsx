import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import { useEffect } from "react";
import ScreenCoverLoadingSpinner from "../components/common/ScreenCoverLoadingIndicator";

type LoadingIndicatorContextType = {
  /** 로딩 표시 */
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  /** 로딩 중 메세지 */
  loadingMessage: string;
  setLoadingMessage: Dispatch<SetStateAction<string>>;
};

const LoadingIndicatorContext = createContext<LoadingIndicatorContextType>({
  isLoading: false,
  setIsLoading: () => {
    throw new Error("Function not implemented.");
  },
  loadingMessage: "",
  setLoadingMessage: function (value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  },
});

export function LoadingIndicatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  return (
    <LoadingIndicatorContext.Provider
      value={{ isLoading, setIsLoading, loadingMessage, setLoadingMessage }}
    >
      {children}
      {isLoading ? (
        <ScreenCoverLoadingSpinner message={loadingMessage} />
      ) : null}
    </LoadingIndicatorContext.Provider>
  );
}

/**
 * 화면 전체를 덮는 로딩 표시를 사용합니다.
 * @returns
 */
export const useLoadingIndicator = (message?: string) => {
  const { setIsLoading, setLoadingMessage } = useContext(
    LoadingIndicatorContext
  );

  useEffect(() => {
    if (message) setLoadingMessage(message);
  }, []);

  const showLoading = useCallback((message?: string) => {
    if (message) {
      setLoadingMessage(message);
    } else {
      setLoadingMessage("");
    }
    setIsLoading(true);
  }, []);

  /** 로딩 표시를 숨깁니다. */
  const hideLoading = useCallback(() => {
    setLoadingMessage("");
    setIsLoading(false);
  }, []);

  return {
    /** 로딩을 표시를 나타냅니다. */
    showLoading,
    /** 로딩 표시를 숨깁니다. */
    hideLoading,
  };
};
