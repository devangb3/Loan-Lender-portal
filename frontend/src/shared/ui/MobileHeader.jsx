import { Menu, X } from "lucide-react";

export function MobileHeader({ sidebarOpen, onToggle }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar/95 px-4 backdrop-blur lg:hidden">
      <button
        onClick={onToggle}
        className="rounded-md p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-muted"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-display text-xl font-bold text-transparent">LRP</span>
      <div className="w-9" />
    </header>
  );
}
