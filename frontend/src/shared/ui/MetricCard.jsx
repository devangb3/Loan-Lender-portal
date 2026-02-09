import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, icon: Icon }) {
  return (
    <Card className="p-4 transition-shadow hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-sm normal-case tracking-normal text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl tracking-poster">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-md bg-muted p-2 text-muted-foreground">
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
}
