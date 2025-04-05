import React, { useCallback } from "react";

/**
 * 일정 시간이 지나면 자동으로 값이 토글되는 타이머를 사용합니다.
 * @returns 호출 시 진행 중이던 타이머를 지웁니다.
 */
export const useToggleTimer = (
  /** 토글할 state setter */
  booleanStateSetter: (value: React.SetStateAction<boolean>) => void,
  /** 유지되길 원하는 상태 (ex. true로 할당할 경우 일정 시간이 지났을 때 true로 해당 값을 바꿈) */
  toState: boolean,
  /** 타임아웃 시간, ms단위 */
  timeout: number
) => {
  // ! state로 선언 시 정상 작동 하지 않음
  let timerId: NodeJS.Timer | undefined = undefined;

  return useCallback(
    (option?: {
      /** 타이머를 지운 후 새 타이머를 등록합니다. */
      updateNewTimer?: boolean;
    }) => {
      if (timerId) {
        clearTimeout(timerId);
      }
      if (option && option.updateNewTimer) {
        timerId = setTimeout(() => {
          booleanStateSetter(toState);
        }, timeout);
      }
    },
    [timerId]
  );
};
