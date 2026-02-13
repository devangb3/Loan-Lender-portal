import PropTypes from "prop-types";
import { Alert, Button, Stack, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Upload } from "lucide-react";
import { importLenders } from "../api";

export function LenderImportForm({ onImported }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleImport = async () => {
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
        const axiosError = err;
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
    <Card className="p-5">
      <Stack spacing={2}>
        <Typography variant="h5">Lender CSV Import</Typography>

        {status && <Alert severity="info">{status}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/30">
          <div className="rounded-lg bg-primary/10 p-2">
            <Upload size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{file ? file.name : "Choose a CSV file"}</p>
            <p className="text-xs text-muted-foreground">{file ? `${(file.size / 1024).toFixed(1)} KB` : "Click to browse"}</p>
          </div>
          <input type="file" className="hidden" accept=".csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
        </label>

        <Button variant="contained" onClick={() => void handleImport()} disabled={!file}>Import</Button>
      </Stack>
    </Card>
  );
}

LenderImportForm.propTypes = {
  onImported: PropTypes.func.isRequired,
};
