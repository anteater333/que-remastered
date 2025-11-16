import { Link } from "@tanstack/react-router";

type StudioSubGNBProps = {
  userId: string;
};

export const StudioSubGNB = ({ userId }: StudioSubGNBProps) => {
  return (
    <div>
      <Link to="/studio/$userId" params={{ userId }}>
        홈
      </Link>
      <Link to="/studio/$userId/stages" params={{ userId }}>
        영상
      </Link>
      <Link to="/studio/$userId/reactions" params={{ userId }}>
        리액션
      </Link>
      <Link to="/studio/$userId/board" params={{ userId }}>
        게시판
      </Link>
    </div>
  );
};
