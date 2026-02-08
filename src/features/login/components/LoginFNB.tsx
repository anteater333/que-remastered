import { Button } from "../../../components/Buttons/Button";
import styles from "./LoginFNB.module.scss";

interface LoginFNBProps {
  onNext: () => void;
  isNextEnabled: boolean;
}

/**
 * 로그인 영역의 하단 네비게이션 바
 */
export const LoginFNB = ({ onNext, isNextEnabled }: LoginFNBProps) => {
  return (
    <div className={styles.fnbContainer}>
      <div className={styles.fnb}>
        <Button
          className={styles.nextButton}
          onClick={onNext}
          disabled={!isNextEnabled}
        >
          로그인
        </Button>
      </div>
    </div>
  );
};
