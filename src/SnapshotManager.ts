import consola from "consola";
import indentString from "indent-string";
import { load } from "js-yaml";

const normalize = (s: string) =>
  linesToArray(s.replaceAll(/^Date: .+ GMT/gm, "-"));

export class SnapshotManager {
  constructor(private filePath: string) {}
  store?: Record<string, string>;
  usedKeys: Set<string> = new Set();
  dirty = false;

  async resolveSnapshot(key: string, value: string) {
    this.usedKeys.add(key);
    const store = await this.getStore();
    const before = store[key] ? normalize(store[key]) : undefined;
    const after = normalize(value);
    if (before !== after) {
      store[key] = value;
      this.dirty = true;
    }
  }

  async save() {
    if (this.dirty) {
      const file = Bun.file(this.filePath);
      await Bun.write(file, this.serialize(await this.getStore()));
      consola.info("Snapshot updated:", this.filePath);
    } else {
      consola.debug("Snapshot up-to-date:", this.filePath);
    }
  }

  serialize(store: Record<string, string>) {
    const output: string[] = [];
    for (const key of Object.keys(store).sort()) {
      if (!this.usedKeys.has(key)) continue;
      const snapshot = store[key];
      output.push(JSON.stringify(key) + ":");
      output.push(indentString(linesToArray(snapshot), 2));
    }
    return output.map((x) => x + "\n").join("");
  }

  private async getStore() {
    if (this.store) return this.store;
    const file = Bun.file(this.filePath);
    const text = (await file.exists()) ? await file.text() : "{}";
    const store: Record<string, string> = {};
    const data = load(text) as Record<string, string[]>;
    for (const [key, value] of Object.entries(data)) {
      store[key] = value.join("\n");
    }
    this.store = store;
    return store;
  }
}

const linesToArray = (s: string) =>
  s
    .split(/\r\n|\r|\n/)
    .map((x) => "- " + JSON.stringify(x.trimEnd()))
    .join("\n");
