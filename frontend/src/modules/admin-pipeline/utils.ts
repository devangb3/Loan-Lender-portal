export const STAGE_ORDER = [
  "submitted",
  "in_review",
  "accepted",
  "in_progress",
  "closing",
  "closed",
  "declined",
];

export function stageTitle(value: string): string {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}
