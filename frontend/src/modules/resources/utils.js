export function groupByCategory(resources) {
    return resources.reduce((acc, item) => {
        acc[item.category] = [...(acc[item.category] ?? []), item];
        return acc;
    }, {});
}
