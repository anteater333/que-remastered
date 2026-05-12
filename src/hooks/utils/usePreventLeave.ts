import { useCallback, useEffect } from "react";

export function usePreventLeave({ enabled }: { enabled: boolean }) {
  const handler = useCallback((e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = true;
  }, []);

  /** 페이지 이탈 방지 활성화 */
  const enablePrevent = useCallback(
    () => window.addEventListener("beforeunload", handler),
    [],
  );

  /** 페이지 이탈 방지 해제 */
  const disablePrevent = useCallback(
    () => window.removeEventListener("beforeunload", handler),
    [],
  );

  useEffect(() => {
    if (!enabled) return;

    enablePrevent();
    return () => disablePrevent();
  }, [enabled, enablePrevent, disablePrevent]);

  return { enablePrevent, disablePrevent };
}
