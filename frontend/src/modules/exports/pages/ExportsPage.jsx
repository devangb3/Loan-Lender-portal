import { Stack } from "@/components/ui/mui";
import { ExportButtons } from "../components/ExportButtons";
import { PageHeader } from "@/shared/ui/PageHeader";

export function ExportsPage() {
  return (
    <Stack spacing={3} className="page-enter">
      <PageHeader title="Exports" />
      <ExportButtons />
    </Stack>
  );
}
