import { Stack, Typography } from "@mui/material";
import { ExportButtons } from "../components/ExportButtons";

export function ExportsPage(): JSX.Element {
  return (
    <Stack spacing={2}>
      <Typography variant="h2">Admin Exports</Typography>
      <ExportButtons />
    </Stack>
  );
}
