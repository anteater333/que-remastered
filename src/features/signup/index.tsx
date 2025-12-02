import styles from "./signup.module.scss";
import { LogoText } from "../../components/common/logo/LogoText";
import { TextInput } from "../../components/Inputs/TextInput";

const SignupPage = () => {
  return (
    <div>
      <LogoText isColored />
      <div>회원가입</div>
      <TextInput className={styles.input} placeholder="이메일" />
    </div>
  );
};

export default SignupPage;
