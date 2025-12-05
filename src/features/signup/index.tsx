import styles from "./signup.module.scss";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";

const SignupPage = () => {
  return (
    <div className={styles.signupContainer}>
      <div className={styles.upper}>
        <div className={styles.logo}>
          <LogoText isColored />
        </div>
        <div className={styles.label}>회원가입</div>
      </div>
      <div className={styles.lower}>
        <div className={styles.lowerInner}>
          <TextInput className={styles.input} placeholder="이메일" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
