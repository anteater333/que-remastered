import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";

const OnBoardingPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <button
        style={{ position: "absolute", top: "50%" }}
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
      >
        로그아웃 (임시)
      </button>
    </>
  );
};

export default OnBoardingPage;
