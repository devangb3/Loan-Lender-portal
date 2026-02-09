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

const adminLinks = [
  { to: "/admin/pipeline", label: "Pipeline", icon: LayoutDashboard },
  { to: "/admin/partners", label: "Partners", icon: Users },
  { to: "/admin/lenders", label: "Lenders", icon: Building2 },
  { to: "/admin/commissions", label: "Commissions", icon: DollarSign },
  { to: "/admin/exports", label: "Exports", icon: Download },
];

const partnerLinks = [
  { to: "/partner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/partner/deals", label: "My Deals", icon: FileText },
  { to: "/partner/deals/new", label: "Submit Deal", icon: FilePlus },
  { to: "/partner/resources", label: "Resources", icon: BookOpen },
];

const borrowerLinks = [
  { to: "/borrower", label: "Applications", icon: LayoutDashboard },
];

const accountLink = { to: "/account/password", label: "Account Security", icon: KeyRound };

function getLinks(role) {
  if (role === "admin") return [...adminLinks, accountLink];
  if (role === "partner") return [...partnerLinks, accountLink];
  return [...borrowerLinks, accountLink];
}

export function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = getLinks(user?.role);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col bg-sidebar text-sidebar-foreground shadow-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border px-4">
        <span className="font-display text-2xl tracking-poster text-sidebar-accent-foreground">
          {collapsed ? "L" : "LRP"}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-l-2 border-accent bg-sidebar-accent text-sidebar-accent-foreground"
                      : "border-l-2 border-transparent text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground"
                  )
                }
              >
                <link.icon size={18} className="shrink-0" />
                {!collapsed && <span className="truncate font-body normal-case tracking-normal">{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border p-3">
        {!collapsed && user && (
          <div className="mb-3 space-y-1">
            <p className="truncate text-xs font-body normal-case tracking-normal text-sidebar-muted-foreground">{user.email}</p>
            <span className="inline-block rounded-full bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sidebar-accent-foreground">
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
