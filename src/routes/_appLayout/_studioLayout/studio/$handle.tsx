import {
  createFileRoute,
  notFound,
  Outlet,
  useParams,
} from "@tanstack/react-router";
import { getStudioInfo } from "../../../../features/studio/api";
import StudioNotFoundScene from "../../../../features/studio/scenes/StudioNotFoundScene";
import { StudioSubGNB } from "../../../../features/studio/components/StudioSubGNB";

/**
 * 스튜디오 영역 진입 전 검증 라우트
 */
export const Route = createFileRoute(
  "/_appLayout/_studioLayout/studio/$handle",
)({
  loader: async ({ params }) => {
    try {
      const { studio } = await getStudioInfo({ handle: params.handle });
      return { studio };
    } catch {
      throw notFound();
    }
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
