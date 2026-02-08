import { useState } from "react";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";
import styles from "./login.module.scss";
import { LoginFNB } from "./components/LoginFNB";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {};

  return (
    <>
      <div className={styles.loginContainer}>
        <div className={styles.upper}>
          <div className={styles.logo}>
            <LogoText isColored />
          </div>
        </div>
        <div className={styles.lower}>
          <div className={styles.lowerInner}>
            <TextInput
              id="login"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className={styles.input}
              placeholder="이메일"
            />
            <TextInput
              id=""
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className={styles.input}
              placeholder="비밀번호"
            />
          </div>
        </div>
      </div>
      <LoginFNB onNext={handleLogin} isNextEnabled />
    </>
  );
};

export default LoginPage;
