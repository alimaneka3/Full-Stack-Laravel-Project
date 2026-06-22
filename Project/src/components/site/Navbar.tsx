import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, Sparkles, X, User, LogOut, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRole, type Role } from "@/lib/role-context";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/authService";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicLinks = [
  { to: "/", label: "Home" },
  { to: "/events", label: "Events" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Navbar() {
  const { role, setRole } = useRole();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setRole(parsedUser.role);
      } else {
        authService.getUser().then(userData => {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          setRole(userData.role);
        }).catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setRole('visitor');
        });
      }
    } else {
      setUser(null);
      setRole('visitor');
    }
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setRole('visitor');
    toast.success('Logged out successfully');
    navigate({ to: '/' });
  };

  const isLoggedIn = !!user;
  const isPendingOrganiser = user?.role === 'organiser' && user?.is_approved === false;

  // Get right links based on actual user role
  const rightLinks = getRightLinks(role, isLoggedIn, isPendingOrganiser, handleLogout);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Event<span className="text-gradient">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {publicLinks.map((l) => {
            const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to as never}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              {isPendingOrganiser && (
                <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning-foreground">
                  <Clock className="h-3 w-3" /> Pending Approval
                </span>
              )}
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{user?.name}</span>
                <span className="mx-1">·</span>
                <span className="capitalize">{role}</span>
              </span>
            </div>
          )}
          
          {rightLinks.map((l) =>
            l.primary ? (
              <Button key={l.to} asChild size="sm" className="bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90">
                <Link to={l.to as never}>{l.label}</Link>
              </Button>
            ) : l.to === '#logout' ? (
              <Button key={l.to} variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> {l.label}
              </Button>
            ) : (
              <Button key={l.to} asChild variant="ghost" size="sm">
                <Link to={l.to as never}>{l.label}</Link>
              </Button>
            ),
          )}
        </div>

        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {isPendingOrganiser && (
              <div className="flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
                <Clock className="h-3 w-3" /> Pending Approval
              </div>
            )}
            {publicLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {rightLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to as never}
                onClick={() => {
                  setOpen(false);
                  if (l.to === '#logout') handleLogout();
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function getRightLinks(role: Role, isLoggedIn: boolean, isPendingOrganiser: boolean, handleLogout: () => void): { to: string; label: string; primary?: boolean }[] {
  if (!isLoggedIn) {
    return [
      { to: "/register", label: "Register" },
      { to: "/login", label: "Login", primary: true },
    ];
  }

  // Pending organiser - show limited options
  if (isPendingOrganiser) {
    return [
      { to: "/profile", label: "Profile" },
      { to: "#logout", label: "Logout" },
    ];
  }

  switch (role) {
    case "attendee":
      return [
        { to: "/my-bookings", label: "My Bookings" },
        { to: "/profile", label: "Profile" },
        { to: "#logout", label: "Logout" },
      ];
    case "organiser":
      return [
        { to: "/create-event", label: "Create Event" },
        { to: "/event-management", label: "My Events" },
        { to: "/profile", label: "Profile" },
        { to: "#logout", label: "Logout" },
      ];
    case "admin":
      return [
        { to: "/admin", label: "Dashboard", primary: true },
        { to: "#logout", label: "Logout" },
      ];
    default:
      return [
        { to: "/profile", label: "Profile" },
        { to: "#logout", label: "Logout" },
      ];
  }
}