import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/_appLayout/setting")({
  component: Setting,
});

function Setting() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h3>Welcome Setting</h3>
      <button
        onClick={() => {
          logout();
          navigate({ to: "/" });
        }}
      >
        로그아웃
      </button>
    </div>
  );
}
