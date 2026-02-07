import { Paper, Stack, Typography } from "@mui/material";
import type { ResourceItem } from "../types";

export function ResourceGroup({ title, items }: { title: string; items: ResourceItem[] }): JSX.Element {
  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid #d6dfd0" }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Stack spacing={1}>
        {items.map((item) => (
          <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body2">{item.content}</Typography>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}
