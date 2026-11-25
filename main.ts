// The Excuse That Almost Works — the one line a gamer texts the boss to skip
// work on GTA 6 launch week. Gate: /output/entry.txt, UTF-8, 1-140 chars, at most
// 20 words, reads like something a real person would send in a hurry.
import { mkdirSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

const OUT = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_CHARS = 140;
const MAX_WORDS = 20;

// Three beats of a hasty text: address the boss, give the reason, reassure.
class HastyText {
  private readonly opener: string;
  private readonly reason: string;
  private readonly reassurance: string;
  constructor(opener: string, reason: string, reassurance: string) {
    this.opener = opener;
    this.reason = reason;
    this.reassurance = reassurance;
  }
  line(): string {
    return [this.opener, this.reason, this.reassurance]
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }
  words(line: string): number {
    return line.split(/\s+/).filter(Boolean).length;
  }
  hasReassurance(line: string): boolean {
    // A hasty excuse that never reassures the boss does not almost work.
    return /I'll be on my phone/.test(line);
  }
}

const text = new HastyText(
  "Boss, my car died",
  "and the mechanic can't come until Friday.",
  "I'll be on my phone if anything comes up.",
);

const line = text.line();
if (/[\r\n]/.test(line)) throw new Error("excuse must be a single line");
if (!text.hasReassurance(line)) {
  throw new Error("excuse must reassure the boss it is reachable");
}
if (line.length === 0 || line.length > MAX_CHARS) {
  throw new Error(`line must be 1-${MAX_CHARS} chars, got ${line.length}`);
}
if (text.words(line) > MAX_WORDS) {
  throw new Error(`line must be at most ${MAX_WORDS} words, got ${text.words(line)}`);
}
mkdirSync(OUT, { recursive: true });
const target = join(OUT, "entry.txt");
writeFileSync(target, line + "\n", "utf8");
chmodSync(target, 0o644);
console.log(`${line.length} chars, ${text.words(line)} words: ${line}`);
