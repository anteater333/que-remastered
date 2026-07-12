import {
  createFileRoute,
  notFound,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import StudioNotFoundScene from "../../../../features/studio/scenes/StudioNotFoundScene";
import { StudioSubGNB } from "../../../../features/studio/components/StudioSubGNB";

/**
 * 스튜디오 영역 진입 전 검증 라우트
 */
export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle",
)({
  loader: async ({ params }) => {
    const profile = null; // TODO: API 호출을 통한 스튜디오 존재 여부 확인
    if (!profile) {
      throw notFound();
    }
    return { studioProfile: profile };
  },
  notFoundComponent: () => <StudioNotFoundScene />,

  component: RouteComponent,
});

function RouteComponent() {
  const { handle } = useParams({ strict: false });

  return (
    <>
      <StudioSubGNB handle={handle!} />
      <Outlet />
    </>
  );
}
