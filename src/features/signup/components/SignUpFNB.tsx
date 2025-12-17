import { Button } from "../../../components/Buttons/Button";
import styles from "./SignUpFNB.module.scss";

interface SignUpFNBProps {
  onNext: () => void;
}

/**
 * 회원가입 영역의 하단 네비게이션 바
 */
export const SignUpFNB = ({ onNext }: SignUpFNBProps) => {
  return (
    <div className={styles.fnbContainer}>
      <div className={styles.fnb}>
        <Button className={styles.nextButton} onClick={onNext}>
          다음
        </Button>
      </div>
    </div>
  );
};
