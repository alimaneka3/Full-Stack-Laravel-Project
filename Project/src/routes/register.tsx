import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/lib/authService";
import { AuthLayout, Field } from "./login";
import { toast } from "sonner";
import { validatePassword, getPasswordStrength } from "@/lib/validation";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — EventHub" }] }),
  component: Register,
});

function Register() {
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const navigate = useNavigate();

  const validation = validatePassword(password);
  const strength = getPasswordStrength(password);
  const passwordMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowValidation(true);
    
    // Validate password
    if (!validation.isValid) {
      toast.error('Please fix password requirements');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const data = await authService.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        role
      });
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      if (role === "organiser") {
        toast.success('Account created! Waiting for admin approval.');
        setTimeout(() => {
          navigate({ to: '/' });
        }, 2000);
      } else {
        toast.success('Account created! You\'re all set.');
        setTimeout(() => {
          navigate({ to: '/' });
        }, 1500);
      }
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
        toast.error(firstError);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <CheckCircle className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-red-500" />
      )}
      <span className={met ? 'text-green-600' : 'text-red-500'}>{text}</span>
    </div>
  );

  return (
    <AuthLayout>
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Start discovering and hosting amazing events.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" autoComplete="off">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attendee">Attendee</SelectItem>
              <SelectItem value="organiser">Organiser (requires approval)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Field label="Full name" icon={User}>
          <Input 
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            placeholder="Your full name" 
            className="pl-9"
            autoComplete="off"
          />
        </Field>
        
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
            type="password" 
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            placeholder="••••••••" 
            className="pl-9"
            autoComplete="off"
          />
        </Field>

        {/* Password Requirements */}
        {(showValidation || password.length > 0) && (
          <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Password requirements:</p>
            
            <PasswordRequirement 
              met={password.length >= 8} 
              text="At least 8 characters" 
            />
            <PasswordRequirement 
              met={/[A-Z]/.test(password)} 
              text="At least 1 uppercase letter" 
            />
            <PasswordRequirement 
              met={/[a-z]/.test(password)} 
              text="At least 1 lowercase letter" 
            />
            <PasswordRequirement 
              met={/[0-9]/.test(password)} 
              text="At least 1 number" 
            />
            <PasswordRequirement 
              met={/[!@#$%^&*(),.?":{}|<>]/.test(password)} 
              text="At least 1 special character (!@#$%^&*())" 
            />

            {/* Password Strength Bar */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Strength:</span>
                  <span className={`font-semibold ${strength.score >= 4 ? 'text-green-600' : strength.score >= 3 ? 'text-blue-600' : strength.score >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {strength.label}
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${(strength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <Field label="Confirm password" icon={Lock}>
          <Input 
            type="password" 
            name="password_confirmation"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
            placeholder="••••••••" 
            className={`pl-9 ${passwordMatch && confirmPassword.length > 0 ? 'border-green-500' : confirmPassword.length > 0 ? 'border-red-500' : ''}`}
            autoComplete="off"
          />
          {confirmPassword.length > 0 && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {passwordMatch ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
        </Field>

        {role === "organiser" && (
          <p className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground">
            ⏳ Organiser accounts require admin approval before publishing events.
            You will be notified once approved.
          </p>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}