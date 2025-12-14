import styles from "./SignUpFNB.module.scss";

/**
 * 회원가입 영역의 하단 네비게이션 바
 */
export const SignUpFNB = () => {
  return (
    <div className={styles.fnbContainer}>
      <div className={styles.fnb}>
        <button className={styles.nextButton}>다음</button>
      </div>
    </div>
  );
};
