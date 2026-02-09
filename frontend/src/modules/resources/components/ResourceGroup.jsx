import PropTypes from "prop-types";
import { Stack, Typography } from "@/components/ui/mui";
import { Card } from "@/components/ui/card";

export function ResourceGroup({ title, items }) {
  return (
    <Card className="p-5">
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <Stack spacing={2}>
        {items.map((item) => (
          <div key={item.id} className="rounded-md border border-border/60 bg-muted/20 p-3">
            <Typography variant="h6">{item.title}</Typography>
            <Typography variant="body2" className="mt-1 text-muted-foreground">{item.content}</Typography>
          </div>
        ))}
      </Stack>
    </Card>
  );
}

ResourceGroup.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};
