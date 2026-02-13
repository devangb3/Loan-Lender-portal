import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/hooks";
import {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Download,
  FileText,
  FilePlus,
  BookOpen,
  KeyRound,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCOUNT_LINK, APP_ROUTES, NAV_LINKS_BY_ROLE, USER_ROLES } from "@/shared/constants";

const ICON_BY_NAME = {
  LayoutDashboard,
  Users,
  Building2,
  DollarSign,
  Download,
  FileText,
  FilePlus,
  BookOpen,
  KeyRound,
};

function getLinks(role) {
  const roleLinks = NAV_LINKS_BY_ROLE[role] || NAV_LINKS_BY_ROLE[USER_ROLES.BORROWER];
  return [...roleLinks, ACCOUNT_LINK];
}

export function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = getLinks(user?.role);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.AUTH_LOGIN);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text font-display text-2xl font-bold text-transparent">
          {collapsed ? "L" : "LRP"}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {links.map((link) => {
            const Icon = ICON_BY_NAME[link.icon] || LayoutDashboard;
            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "border-l-2 border-primary bg-primary/10 text-sidebar-accent-foreground"
                        : "border-l-2 border-transparent text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                    )
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate font-body normal-case tracking-normal">{link.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-3 space-y-1">
            {user.full_name && (
              <p className="truncate text-xs font-semibold font-body normal-case tracking-normal text-sidebar-foreground">{user.full_name}</p>
            )}
            <p className="truncate text-xs font-body normal-case tracking-normal text-sidebar-muted-foreground">{user.email}</p>
            <span className={cn(
              "inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              user.role === USER_ROLES.ADMIN
                ? "bg-secondary/15 text-secondary border border-secondary/25"
                : "bg-primary/15 text-primary border border-primary/25"
            )}>
              {user.role}
            </span>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-muted-foreground transition-colors hover:bg-sidebar-muted hover:text-sidebar-foreground",
            collapsed && "justify-center"
          )}
        >
          <LogOut size={16} />
          {!collapsed && <span className="font-body normal-case tracking-normal">Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex h-10 items-center justify-center border-t border-sidebar-border text-sidebar-muted-foreground transition-colors hover:text-sidebar-foreground"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
