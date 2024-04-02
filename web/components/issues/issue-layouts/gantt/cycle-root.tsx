import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
// hooks
// components
import { BaseGanttRoot } from "./base-gantt-root";

export const CycleGanttLayout: React.FC = observer(() => {
  // router
  const router = useRouter();
  const { cycleId } = router.query;

  return <BaseGanttRoot viewId={cycleId?.toString()} />;
});
