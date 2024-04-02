import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
// hooks
// components
import { BaseGanttRoot } from "./base-gantt-root";
// constants
// types

export const ProjectViewGanttLayout: React.FC = observer(() => {
  // router
  const router = useRouter();
  const { viewId } = router.query;

  return <BaseGanttRoot viewId={viewId?.toString()} />;
});
