import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Heart, LogOut, Moon, Sun, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AppNavbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useUserRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isAdmin
    ? [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/volunteers", icon: Users, label: "Volunteers" },
        { to: "/check-ins", icon: ClipboardCheck, label: "Check-ins" },
        { to: "/analytics", icon: BarChart3, label: "Analytics" },
      ]
    : [
        { to: "/", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/check-ins", icon: ClipboardCheck, label: "Check-ins" },
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-lg font-bold text-foreground">Zeal</h1>
          {isAdmin && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">Admin</span>
          )}
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <span className="hidden text-xs text-muted-foreground lg:inline">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={signOut} className="hidden text-muted-foreground md:inline-flex">
            <LogOut className="mr-1 h-4 w-4" />
            Sign out
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-2 truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppNavbar;
