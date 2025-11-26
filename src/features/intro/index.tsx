import { Link } from "@tanstack/react-router";
import styles from "./intro.module.scss";
import { SignupButton } from "./components/SignupButton";
import { LogoText } from "../../components/common/logo/LogoText";

/** TODO: 어드민 설정 가능하도록 만들기 */
const CATCHPHRASE = `내 방에서 열리는 <span style="color: #07b2f8">콘서트</span>`;
const BG_IMG = `https://i.postimg.cc/mgdFtJd5/welcome.gif`;

const Intro = () => {
  return (
    <div className={styles.introRoot}>
      <div className={styles.introBackground}>
        <img src={BG_IMG} alt="welcome" />
      </div>
      <div className={styles.introOverlay} />

      <div className={styles.introContainer}>
        <div>
          <div className={styles.logo}>
            <LogoText isColored={true} />
          </div>
          <div
            className={styles.catchPhrase}
            dangerouslySetInnerHTML={{ __html: CATCHPHRASE }}
          ></div>
          <div className={styles.buttonGroup}>
            <SignupButton />
          </div>
          <div className={styles.login}>
            <p>이미 계정이 있다면</p>
            <Link to="/login">로그인</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
