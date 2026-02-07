import { Button, Paper, Stack, Typography } from "@mui/material";
import { useExports } from "../hooks";
import { EXPORTS } from "../utils";

export function ExportButtons(): JSX.Element {
  const { loadingEntity, runExport } = useExports();

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Typography variant="h4" gutterBottom>
        CSV Exports
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {EXPORTS.map((entity) => (
          <Button
            key={entity}
            variant="contained"
            disabled={loadingEntity === entity}
            onClick={() => void runExport(entity)}
          >
            Export {entity}
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}
