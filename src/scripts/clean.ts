import { readdir, unlink } from "node:fs/promises";
import consola from "consola";
import { getRunnableTasks } from "../getRunnableTasks";

async function clean() {
  const validTaskIds = new Set<string>();
  
  for await (const task of getRunnableTasks()) {
    validTaskIds.add(task.id);
  }

  const snapshotFiles = await readdir("snapshots");
  const jsonFiles = snapshotFiles.filter(file => file.endsWith(".json"));
  
  let removedCount = 0;
  
  for (const file of jsonFiles) {
    const taskId = file.replace(".json", "");
    
    if (!validTaskIds.has(taskId)) {
      const filePath = `snapshots/${file}`;
      await unlink(filePath);
      consola.info(`Removed orphaned snapshot: ${file}`);
      removedCount++;
    }
  }
  
  if (removedCount === 0) {
    consola.success("No orphaned snapshots found");
  } else {
    consola.success(`Removed ${removedCount} orphaned snapshot(s)`);
  }
}

clean().catch(consola.error);