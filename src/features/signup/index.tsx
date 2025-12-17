import styles from "./signup.module.scss";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";
import { useState } from "react";
import { SignUpFNB } from "./components/SignUpFNB";

const SignupPage = () => {
  const [email, setEmail] = useState("");

  const handleOnNext = () => {};

  return (
    <>
      <div className={styles.signupContainer}>
        <div className={styles.upper}>
          <div className={styles.logo}>
            <LogoText isColored />
          </div>
          <div className={styles.label}>회원가입</div>
        </div>
        <div className={styles.lower}>
          <div className={styles.lowerInner}>
            <TextInput
              id="signUpEmailInput"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="이메일"
            />
          </div>
        </div>
      </div>
      <SignUpFNB onNext={handleOnNext} />
    </>
  );
};

export default SignupPage;
