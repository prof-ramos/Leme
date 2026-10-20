import { Board } from "@/components/Board";
import { getLeme } from "@/server/leme";

export const dynamic = "force-dynamic";

export default function Page() {
  const tasks = getLeme().listTasks();
  return <Board tasks={tasks} />;
}
