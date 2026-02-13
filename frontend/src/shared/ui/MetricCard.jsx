import { Card } from "@/components/ui/card";

export function MetricCard({ label, value, icon: Icon }) {
  return (
    <Card className="p-4 transition-all hover:shadow-card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-sm normal-case tracking-normal text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-bold tracking-tight">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Icon size={20} />
          </div>
        )}
      </div>
    </Card>
  );
}
