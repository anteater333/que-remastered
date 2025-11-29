import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { IcoBack } from "../common/icon/IcoBack";

export const BackButton = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const handleBack = () => {
    if (canGoBack) router.history.back();
  };

  return (
    <button onClick={handleBack}>
      <IcoBack />
    </button>
  );
};
