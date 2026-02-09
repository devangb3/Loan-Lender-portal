import { Send, Search, CheckCircle, Loader, Clock, Lock, XCircle } from "lucide-react";
import { DEAL_STAGE_BADGE_VARIANTS, DEAL_STAGES } from "@/shared/constants";

export const STAGE_ORDER = [...DEAL_STAGES];
export function stageTitle(value) {
    return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const STAGE_COLORS = {
    submitted: "border-stage-submitted",
    in_review: "border-stage-review",
    accepted: "border-stage-accepted",
    in_progress: "border-stage-progress",
    closing: "border-stage-closing",
    closed: "border-stage-closed",
    declined: "border-stage-declined",
};

const STAGE_ICONS = {
    submitted: Send,
    in_review: Search,
    accepted: CheckCircle,
    in_progress: Loader,
    closing: Clock,
    closed: Lock,
    declined: XCircle,
};

export function stageColor(stage) {
    return STAGE_COLORS[stage] || "border-border";
}

export function stageIcon(stage) {
    return STAGE_ICONS[stage] || Send;
}

export function stageBadgeVariant(stage) {
    return DEAL_STAGE_BADGE_VARIANTS[stage] || "muted";
}
