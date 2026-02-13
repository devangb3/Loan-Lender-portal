import { Button, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useExports } from "../hooks";
import { EXPORTS } from "../utils";
import { Download } from "lucide-react";

export function ExportButtons() {
  const { loadingEntity, runExport } = useExports();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {EXPORTS.map((entity) => (
        <Card key={entity} className="flex flex-col items-center gap-3 p-5 text-center">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Download size={22} className="text-primary" />
          </div>
          <Typography variant="h6" className="capitalize">{entity}</Typography>
          <Button
            variant="contained"
            size="small"
            disabled={loadingEntity === entity}
            onClick={() => void runExport(entity)}
          >
            {loadingEntity === entity ? "Exporting..." : "Export CSV"}
          </Button>
        </Card>
      ))}
    </div>
  );
}
