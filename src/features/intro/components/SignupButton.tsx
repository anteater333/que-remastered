import { Link } from "@tanstack/react-router";

export interface SignupButton {}

export const SignupButton = ({}: SignupButton) => {
  return (
    <Link to="/signup">
      <p>Q</p>
      <p>QUE 계정 만들기</p>
    </Link>
  );
};
