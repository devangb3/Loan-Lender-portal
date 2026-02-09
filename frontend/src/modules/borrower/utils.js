export function toCurrency(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export const BORROWER_STAGE_ORDER = [
  "submitted",
  "in_review",
  "accepted",
  "in_progress",
  "closing",
  "closed",
];

export function stageLabel(stage) {
  return stage.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase());
}

export function stageChecklistStatus(currentStage, stage) {
  if (currentStage === "declined") {
    return stage === "submitted" ? "complete" : "pending";
  }

  const currentIndex = BORROWER_STAGE_ORDER.indexOf(currentStage);
  const stageIndex = BORROWER_STAGE_ORDER.indexOf(stage);

  if (currentIndex === -1 || stageIndex === -1) return "pending";
  if (stageIndex < currentIndex) return "complete";
  if (stageIndex === currentIndex) return "current";
  return "pending";
}
