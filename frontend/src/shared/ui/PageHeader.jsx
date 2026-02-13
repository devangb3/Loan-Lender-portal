export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 font-body text-sm normal-case tracking-normal text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
