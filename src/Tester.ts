import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Command, ExpectCommand, TestAction } from "./getTests";

const execAsync = promisify(exec);

interface ActionLogEntry {
  type: "command" | "expect" | "expect-not";
  timestamp: Date;
  command?: string;
  output?: string;
  error?: string;
  expectation?: string;
  success: boolean;
}

export type { ActionLogEntry };

export class Tester {
  private latestCommandOutput: string | null = null;
  private latestCommandError: string | null = null;
  private actionLog: ActionLogEntry[] = [];

  async executeTestActions(actions: TestAction[]): Promise<void> {
    for (const action of actions) {
      await this.executeAction(action);
    }
  }

  private async executeAction(action: TestAction): Promise<void> {
    if (action.type === "command") {
      await this.executeCommand(action);
    } else if (action.type === "expect" || action.type === "expect-not") {
      await this.executeExpectation(action);
    }
  }

  private async executeCommand(command: Command): Promise<void> {
    console.log(`Executing command: ${command.script}`);

    // Replace $SERVER with localhost:3000 in the command
    let bashCommand = command.script.replace(
      /\$SERVER/g,
      "http://localhost:3000"
    );

    // Remove the comment part if present (everything after #)
    bashCommand = bashCommand.split("#")[0].trim();

    console.log(`Running bash command: ${bashCommand}`);

    const logEntry: ActionLogEntry = {
      type: "command",
      timestamp: new Date(),
      command: bashCommand,
      success: false,
    };

    try {
      // Execute the bash command and capture stdout
      const { stdout, stderr } = await execAsync(bashCommand, {
        shell: "/bin/bash",
        timeout: 10000,
      });

      this.latestCommandOutput = stdout;
      this.latestCommandError = stderr;

      logEntry.output = stdout;
      logEntry.error = stderr;
      logEntry.success = true;

      console.log(`Command output: ${stdout.trim()}`);
      if (stderr.trim()) {
        console.error(`Command stderr: ${stderr.trim()}`);
      }

      // Validate expectations for this command
      for (const expectation of command.expectations) {
        await this.validateExpectation(expectation);
      }
    } catch (error) {
      logEntry.error = error instanceof Error ? error.message : String(error);
      console.error(`Command failed:`, error);
      throw error;
    } finally {
      this.actionLog.push(logEntry);
    }
  }

  private async executeExpectation(
    expectCommand: ExpectCommand
  ): Promise<void> {
    for (const text of expectCommand.texts) {
      const logEntry: ActionLogEntry = {
        type: expectCommand.type,
        timestamp: new Date(),
        expectation: text,
        success: false,
      };

      try {
        if (expectCommand.type === "expect") {
          await this.expectText(text);
        } else if (expectCommand.type === "expect-not") {
          await this.expectNotText(text);
        }
        logEntry.success = true;
      } catch (error) {
        logEntry.error = error instanceof Error ? error.message : String(error);
        throw error;
      } finally {
        this.actionLog.push(logEntry);
      }
    }
  }

  private async validateExpectation(expectation: {
    type: "positive" | "negative";
    text: string;
  }): Promise<void> {
    if (expectation.type === "positive") {
      await this.expectText(expectation.text);
    } else if (expectation.type === "negative") {
      await this.expectNotText(expectation.text);
    }
  }

  private async expectText(expectedText: string): Promise<void> {
    if (!this.latestCommandOutput) {
      throw new Error(
        `Expected "${expectedText}" but no command output available`
      );
    }

    // Check if the expected text is present in the output
    if (!this.latestCommandOutput.includes(expectedText)) {
      throw new Error(
        `Expected "${expectedText}" but got: "${this.latestCommandOutput.trim()}"`
      );
    }

    console.log(`✓ Expected text found: "${expectedText}"`);
  }

  private async expectNotText(notExpectedText: string): Promise<void> {
    if (!this.latestCommandOutput) {
      throw new Error(
        `Expected not to find "${notExpectedText}" but no command output available`
      );
    }

    // Check if the text is NOT present in the output
    if (this.latestCommandOutput.includes(notExpectedText)) {
      throw new Error(
        `Expected not to find "${notExpectedText}" but it was present in: "${this.latestCommandOutput.trim()}"`
      );
    }

    console.log(`✓ Text correctly not found: "${notExpectedText}"`);
  }

  getLatestCommandOutput(): string | null {
    return this.latestCommandOutput;
  }

  getLatestCommandError(): string | null {
    return this.latestCommandError;
  }

  getActionLog(): ActionLogEntry[] {
    return [...this.actionLog];
  }

  clearActionLog(): void {
    this.actionLog = [];
  }
}
