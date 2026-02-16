import { useState } from "react";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";
import styles from "./login.module.scss";
import { LoginFNB } from "./components/LoginFNB";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useLoginMutation } from "./hooks/queries";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: requestLogin } = useLoginMutation();

  const handleLogin = async () => {
    // 기본 검증 실행
    if (isLoading) return;
    if (!email) {
      toast.warn("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      toast.warn("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await requestLogin({ email, password });
      toast.success("로그인 되었습니다.");
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        console.error(error);
        toast.error("오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        id="que-login"
        className={styles.loginContainer}
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <div className={styles.upper}>
          <div className={styles.logo}>
            <LogoText isColored />
          </div>
        </div>
        <div className={styles.lower}>
          <div className={styles.lowerInner}>
            <TextInput
              id="login"
              name="username"
              autoComplete="username"
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="이메일"
            />
            <TextInput
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="비밀번호"
            />
          </div>
        </div>
      </form>
      <LoginFNB isNextEnabled formId="que-login" />
    </>
  );
};

export default LoginPage;
