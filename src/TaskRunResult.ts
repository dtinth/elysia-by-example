import type { ActionLogEntry } from "./Tester";

export interface TaskRunResult {
  taskId: string;
  success: boolean;
  runtimeLogs: Array<{
    type: "stderr" | "stdout";
    contents: string;
  }>;
  testerLogs: ActionLogEntry[];
  error?: string;
}
