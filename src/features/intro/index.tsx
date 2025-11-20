import { Link } from "@tanstack/react-router";
import styles from "./intro.module.scss";
import { SignupButton } from "./components/SignupButton";

const Intro = () => {
  return (
    <div className={styles.introRoot}>
      <div className={styles.introBackground} />

      <div className={styles.introContainer}>
        <div className={styles.logo}>
          {/* todo: 로고 이미지로 교체 */}
          QUE
        </div>
        <div className={styles.catchPhrase}>
          {/* todo: 캐치 프레이즈 변경 */}
          당신의 콘서트를 시작하세요
        </div>
        <div className={styles.buttonGroup}>
          <SignupButton />
        </div>
        <div className={styles.login}>
          <p>이미 게정이 있다면</p>
          <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default Intro;
