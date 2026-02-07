import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { importLenders } from "../api";

export function LenderImportForm({ onImported }: { onImported: () => void }): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const handleImport = async (): Promise<void> => {
    if (!file) return;
    const result = await importLenders(file);
    setStatus(`Imported: ${result.imported_count}, Skipped: ${result.skipped_count}`);
    onImported();
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Stack spacing={1}>
        <Typography variant="h5">Lender CSV Import</Typography>
        {status && <Alert severity="info">{status}</Alert>}
        <Button component="label" variant="outlined">
          Select CSV
          <input type="file" hidden accept=".csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </Button>
        <Button variant="contained" onClick={() => void handleImport()} disabled={!file}>
          Import
        </Button>
      </Stack>
    </Paper>
  );
}
