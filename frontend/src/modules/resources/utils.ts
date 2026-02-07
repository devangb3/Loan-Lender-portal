import type { ResourceItem } from "./types";

export function groupByCategory(resources: ResourceItem[]): Record<string, ResourceItem[]> {
  return resources.reduce<Record<string, ResourceItem[]>>((acc, item) => {
    acc[item.category] = [...(acc[item.category] ?? []), item];
    return acc;
  }, {});
}
