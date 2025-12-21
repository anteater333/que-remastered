import { Button } from "../../../components/Buttons/Button";
import styles from "./SignUpFNB.module.scss";

interface SignUpFNBProps {
  onNext: () => void;
  onPrev: () => void;
  isNextEnabled: boolean;
  showPrev: boolean;
}

/**
 * 회원가입 영역의 하단 네비게이션 바
 */
export const SignUpFNB = ({
  onNext,
  onPrev,
  isNextEnabled,
  showPrev,
}: SignUpFNBProps) => {
  return (
    <div className={styles.fnbContainer}>
      <div className={styles.fnb}>
        {showPrev && (
          <Button className={styles.prevButton} onClick={onPrev}>
            이전
          </Button>
        )}
        <Button
          className={styles.nextButton}
          onClick={onNext}
          disabled={!isNextEnabled}
        >
          다음
        </Button>
      </div>
    </div>
  );
};
