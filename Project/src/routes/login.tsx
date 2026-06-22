import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/lib/authService";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — EventHub" }] }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); // ← Start empty
  const [password, setPassword] = useState(""); // ← Start empty
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const data = await authService.login({
        email,
        password
      });
      
      toast.success('Logged in successfully!');
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        navigate({ to: '/admin' });
      } else if (data.user.role === 'organiser') {
        if (data.user.is_approved === false) {
          toast.info('Your account is pending admin approval.');
          navigate({ to: '/' });
        } else {
          navigate({ to: '/event-management' });
        }
      } else {
        navigate({ to: '/' });
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in to your EventHub account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" autoComplete="off">
        <Field label="Email" icon={Mail}>
          <Input 
            type="email" 
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="you@example.com" 
            className="pl-9"
            autoComplete="off"
          />
        </Field>
        
        <Field label="Password" icon={Lock}>
          <Input 
            type={show ? "text" : "password"} 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="••••••••" 
            className="pl-9 pr-10"
            autoComplete="off"
          />
          <button 
            type="button" 
            onClick={() => setShow((v) => !v)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <Checkbox /> Remember me
          </label>
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/register" className="font-medium text-primary hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
}

// Keep your existing AuthLayout and Field components...
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-cta lg:block">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-white/15 blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/15 blur-3xl animate-blob" />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">EventHub</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight">Discover, create &amp; manage events effortlessly.</h2>
            <p className="mt-4 max-w-md text-primary-foreground/80">
              Join thousands of organisers and attendees building meaningful connections through EventHub.
            </p>
          </div>
          <p className="text-sm text-primary-foreground/70">© 2026 EventHub · Ali Muhammad</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 shadow-elegant">
          <div className="lg:hidden mb-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">Event<span className="text-gradient">Hub</span></span>
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({ label, icon: Icon, children }: { label: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
        {children}
      </div>
    </div>
  );
}