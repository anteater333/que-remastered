import { Link } from "@tanstack/react-router";
import styles from "./SignupButton.module.scss";

export interface SignupButton {}

export const SignupButton = ({}: SignupButton) => {
  return (
    <Link className={styles.signupButton} to="/signup">
      <span className={styles.logo}>Q</span>
      <span className={styles.phrase}>QUE 계정 만들기</span>
    </Link>
  );
};
