import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout, Field } from "./login";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — EventHub" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setToken(searchParams.get('token'));
    setEmail(searchParams.get('email'));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('password_confirmation') as string;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      await api.post('/reset-password', {
        token: token,
        email: email,
        password: password,
        password_confirmation: confirmPassword
      });
      
      setResetDone(true);
      toast.success('Password reset successfully!');
      
      setTimeout(() => {
        navigate({ to: '/login' });
      }, 2000);
    } catch (error: any) {
      console.error('Reset error:', error);
      const message = error.response?.data?.message || 'Failed to reset password.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid reset link</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The password reset link is invalid or expired.
          </p>
          <Button asChild className="mt-8 w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (resetDone) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Password reset successful!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been reset. You can now sign in with your new password.
          </p>
          <Button asChild className="mt-8 w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold">Create new password</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your new password below.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="New password" icon={Lock}>
          <Input 
            type={showPassword ? "text" : "password"} 
            name="password"
            required 
            placeholder="••••••••" 
            className="pl-9 pr-10" 
            minLength={8}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword((v) => !v)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>

        <Field label="Confirm new password" icon={Lock}>
          <Input 
            type={showConfirm ? "text" : "password"} 
            name="password_confirmation"
            required 
            placeholder="••••••••" 
            className="pl-9 pr-10" 
            minLength={8}
          />
          <button 
            type="button" 
            onClick={() => setShowConfirm((v) => !v)} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset password'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}