import { Menu, X } from "lucide-react";

export function MobileHeader({ sidebarOpen, onToggle }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-card/85 px-4 backdrop-blur lg:hidden">
      <button
        onClick={onToggle}
        className="rounded-md p-2 text-foreground transition-colors hover:bg-muted"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <span className="font-display text-xl tracking-poster">LRP</span>
      <div className="w-9" />
    </header>
  );
}
