import { createFileRoute, Outlet } from "@tanstack/react-router";
import { StackedGNB } from "../features/navigation/components/StackedGNB";
import { useStackedLayoutStore } from "../features/navigation/stores/stackedLayoutStore";

export const Route = createFileRoute("/_stackedLayout")({
  component: RouteComponent,
});

/**
 * 메인 App 레이아웃에서 한 스택 들어간 상태의 레이아웃
 * Stacked GNB로 이루어진다.
 */
function RouteComponent() {
  const { title } = useStackedLayoutStore();
  return (
    <>
      <StackedGNB title={title} />
      <main id="stackedLayoutContent">
        <Outlet />
      </main>
    </>
  );
}
