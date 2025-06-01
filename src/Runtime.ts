import { spawn, type ChildProcess } from "node:child_process";
import waitOn from "wait-on";
import type { Runtime as RuntimeType } from "./runnableTask";

type LogEntry = {
  type: "stderr" | "stdout";
  contents: string;
};

export class Runtime {
  private process: ChildProcess | null = null;
  private logs: LogEntry[] = [];

  constructor(
    private examplePath: string,
    private runtime: RuntimeType
  ) {}

  private getCommand(): string {
    if (this.runtime === "bun") {
      return `bun src/runtimes/bun.ts ${this.examplePath}`;
    } else if (this.runtime === "node") {
      return `node --experimental-transform-types src/runtimes/node.ts ${this.examplePath}`;
    } else {
      throw new Error(`Unsupported runtime: ${this.runtime}`);
    }
  }

  async start(): Promise<void> {
    console.log(`Starting ${this.runtime} runtime for ${this.examplePath}`);

    const command = this.getCommand();

    // Start the runtime process
    this.process = spawn(command, {
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
      cwd: process.cwd(),
    });

    if (!this.process) {
      throw new Error("Failed to start runtime process");
    }

    // Handle process events
    this.process.on("error", (error) => {
      console.error(`Runtime process error:`, error);
    });
    this.process.stdout?.on("data", (data) => {
      const output = data.toString().trim();
      this.logs.push({ type: "stdout", contents: output });
      console.log(`[${this.runtime}] ${output}`);
    });

    this.process.stderr?.on("data", (data) => {
      const output = data.toString().trim();
      this.logs.push({ type: "stderr", contents: output });
      console.error(`[${this.runtime}] ${output}`);
    });

    // Wait for the server to be ready on port 3000
    console.log("Waiting for server to be ready on port 3000...");
    await waitOn({
      resources: ["tcp:3000"],
      delay: 100,
      interval: 100,
      timeout: 10000,
    });

    console.log("Server is ready!");
  }

  async stop(): Promise<void> {
    if (this.process) {
      console.log("Stopping runtime process...");
      this.process.kill("SIGTERM");

      // Wait for process to exit
      await new Promise<void>((resolve) => {
        if (this.process) {
          this.process.on("exit", () => resolve());
        } else {
          resolve();
        }
      });

      this.process = null;
    }
  }
  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}
