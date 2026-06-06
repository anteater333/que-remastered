import { createFileRoute } from "@tanstack/react-router";
import Player from "../../../features/player";

export const Route = createFileRoute("/_appLayout/stage/$stageId")({
  component: Index,
});

function Index() {
  // TODO: ID 그대로 플레이어에게 보내는 것이 아니라 데이터 조회해서 전달 필요
  const { stageId } = Route.useParams();

  return (
    <div>
      <h3>Welcome Stage</h3>
      <Player stageId={stageId} />
    </div>
  );
}
