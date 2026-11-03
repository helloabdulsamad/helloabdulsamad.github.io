import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Reads a case study from /content and keeps only the public part: the five
// sections. Internal notes ("Before publishing", "Questions for you",
// "What to show", the draft status line) are dropped.
export function readCaseStudy(file: string) {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", file), "utf8");

  let body = raw
    .split(/\n## Before publishing/)[0]
    .split(/\n## Questions for you/)[0]
    .replace(/^> .*(?:\n> .*)*\n?/gm, "") // status and note quotes
    .replace(/\n\*\*What to show:\*\*[\s\S]*?(?=\n---|\n## |$)/g, "\n")
    .replace(/\n---\n/g, "\n");

  const title = (body.match(/^# (.+)$/m) || [])[1] || "";
  body = body.replace(/^# .+$/m, "");

  // Meta lines (**Live:**, **Role:**, **Stack:** ...) before the first section.
  const firstSection = body.indexOf("\n## ");
  const head = firstSection >= 0 ? body.slice(0, firstSection) : "";
  const rest = firstSection >= 0 ? body.slice(firstSection) : body;
  const meta = [...head.matchAll(/^\*\*([^*]+):\*\*\s*(.+)$/gm)].map((m) => ({
    label: m[1].trim(),
    value: m[2].trim(),
  }));

  const sections = rest
    .split(/\n## /)
    .filter((s) => s.trim())
    .map((s) => {
      const [heading, ...lines] = s.split("\n");
      return {
        heading: heading.replace(/^\d+\.\s*/, "").trim(),
        html: marked.parse(lines.join("\n"), { async: false }) as string,
      };
    });

  return {
    title,
    meta: meta.map((m) => ({ ...m, html: marked.parseInline(m.value, { async: false }) as string })),
    sections,
  };
}
