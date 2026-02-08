import { Alert, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { importLenders } from "../api";

export function LenderImportForm({ onImported }: { onImported: () => void }): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (): Promise<void> => {
    if (!file) return;
    setError(null);
    setStatus(null);
    try {
      const result = await importLenders(file);
      setStatus(`Imported: ${result.imported_count}, Skipped: ${result.skipped_count}`);
      onImported();
    } catch (err) {
      let message = "Failed to import lenders";
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { status?: number; data?: { detail?: string } } };
        if (axiosError.response?.status === 403) {
          message = "Access denied. Please ensure you are logged in as an admin user.";
        } else if (axiosError.response?.data?.detail) {
          message = axiosError.response.data.detail;
        } else if (axiosError.response?.status) {
          message = `Request failed with status ${axiosError.response.status}`;
        }
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Stack spacing={1}>
        <Typography variant="h5">Lender CSV Import</Typography>
        {status && <Alert severity="info">{status}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <Button component="label" variant="outlined">
          Select CSV
          <input type="file" hidden accept=".csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </Button>
        {file && <Typography variant="body2">Selected: {file.name}</Typography>}
        <Button variant="contained" onClick={() => void handleImport()} disabled={!file}>
          Import
        </Button>
      </Stack>
    </Paper>
  );
}
