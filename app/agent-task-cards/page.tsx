import { unstable_noStore as noStore } from "next/cache";

import { TaskCardPageView } from "@/components/task-cards/task-card-page";
import { loadPersistedTaskCardState } from "@/lib/task-cards/persistence";

export default function AgentTaskCardsPage() {
  noStore();

  return <TaskCardPageView initialTaskState={loadPersistedTaskCardState()} />;
}
