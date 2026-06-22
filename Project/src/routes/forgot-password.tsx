import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthLayout, Field } from "./login";
import { toast } from "sonner";
import api from "@/lib/api";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — EventHub" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.post('/forgot-password', { email });
      console.log('Response:', response.data);
      
      // For testing - show the reset link in console
      if (response.data.reset_url) {
        setResetLink(response.data.reset_url);
        console.log('Reset link:', response.data.reset_url);
      }
      
      setSent(true);
      toast.success('Password reset link sent!');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      const message = error.response?.data?.message || 'Failed to send reset link.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We've sent a reset link to <strong>{email}</strong>
          </p>
          {resetLink && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">Test link:</p>
              <a href={resetLink} className="text-xs text-primary break-all hover:underline">
                {resetLink}
              </a>
            </div>
          )}
          <Button asChild className="mt-8 w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Link to="/login">Back to login</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex items-center gap-2">
        <Link to="/login" className="text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Reset password</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field label="Email" icon={Mail}>
          <Input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
            placeholder="you@example.com" 
            className="pl-9" 
          />
        </Field>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}