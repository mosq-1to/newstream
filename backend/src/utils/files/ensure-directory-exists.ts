import fs from "fs";

export function ensureDirectoryExists(directory: string): void {
  try {
    fs.mkdirSync(directory, { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }
}
