import { Button } from "../../../components/Buttons/Button";
import styles from "./SignUpFNB.module.scss";

interface SignUpFNBProps {
  onNext: () => void;
  onPrev: () => void;
  nextText?: string;
  prevText?: string;
  isNextEnabled: boolean;
  isPrevEnabled: boolean;
  showPrev: boolean;
}

/**
 * 회원가입 영역의 하단 네비게이션 바
 */
export const SignUpFNB = ({
  onNext,
  onPrev,
  nextText,
  prevText,
  isNextEnabled,
  isPrevEnabled,
  showPrev,
}: SignUpFNBProps) => {
  return (
    <div className={styles.fnbContainer}>
      <div className={styles.fnb}>
        {showPrev && (
          <Button
            className={styles.prevButton}
            onClick={onPrev}
            disabled={!isPrevEnabled}
          >
            {prevText ?? "이전"}
          </Button>
        )}
        <Button
          buttonType="fill"
          className={styles.nextButton}
          onClick={onNext}
          disabled={!isNextEnabled}
        >
          {nextText ?? "다음"}
        </Button>
      </div>
    </div>
  );
};
