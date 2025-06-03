import { useEffect } from "react";

/**
 * Que 어플리케이션을 위한 초기 설정을 수행한다.
 */
const useQueInitializer = (onReady: () => void) => {
  useEffect(() => {
    /** 어플리케이션 초기화 동작 모음 */
    const tasks: Promise<any>[] = [
      // 가장 기본적인 준비 동작, 스플래시를 표시하기 위한 최소 지연
      new Promise((resolve) => setTimeout(resolve, 1_500)),
    ];

    Promise.all(tasks).then(onReady);
  }, [onReady]);
};

export default useQueInitializer;
