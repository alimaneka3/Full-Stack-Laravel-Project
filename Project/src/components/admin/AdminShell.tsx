import { Link, useRouterState } from "@tanstack/react-router";
import { CalendarDays, LayoutDashboard, LogOut, Mail, ShieldCheck, Sparkles, Ticket, Users } from "lucide-react";
import type { ReactNode } from "react";

const links: { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/bookings", label: "Bookings", icon: Ticket },
  { to: "/admin/organisers", label: "Organiser Approvals", icon: ShieldCheck },
  { to: "/admin/messages", label: "Contact Messages", icon: Mail },
];

export function AdminShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="flex min-h-screen bg-accent/30">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          <span className="font-bold">Event<span className="text-gradient">Hub</span></span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => {
            const active = l.exact ? path === l.to : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to as never}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "bg-gradient-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent">
            <LogOut className="h-4 w-4" /> Logout
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:flex sm:px-8 sm:justify-between">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold sm:text-2xl">{title}</h1>
              {subtitle && <p className="truncate text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right text-sm sm:block">
                <p className="font-semibold">Ali Muhammad</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <img src="https://i.pravatar.cc/80?img=33" alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20" />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
