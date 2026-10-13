import { Board } from "@/components/Board";
import { createLeme } from "@/server/domain/tasks";

export const dynamic = "force-dynamic";

export default function Page() {
  const tasks = createLeme().listTasks();
  return <Board tasks={tasks} />;
}
