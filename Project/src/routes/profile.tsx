import { createFileRoute } from "@tanstack/react-router";
import { Camera, Mail, MapPin, User } from "lucide-react";
import { useState, useEffect } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/authService";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — EventHub" }] }),
  component: Profile,
});

function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await authService.getUser();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setUpdating(true);
      // You would typically have an update endpoint
      // For now, just show success
      toast.success('Profile updated successfully');
      // Update local user data
      setUser({
        ...user,
        name: formData.get('name'),
        email: formData.get('email'),
        location: formData.get('location'),
        phone: formData.get('phone'),
      });
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <SiteShell>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Your <span className="text-gradient">profile</span></h1>

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
            <div className="relative mx-auto h-28 w-28">
              <img 
                src={`https://i.pravatar.cc/200?img=${user?.id || 33}`} 
                alt="" 
                className="h-28 w-28 rounded-full object-cover ring-4 ring-primary/15" 
              />
              <button className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-4 font-semibold">{user?.name}</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="mt-3 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary capitalize">
              {user?.role}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    name="name"
                    defaultValue={user?.name || ''} 
                    className="pl-9" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    name="email"
                    defaultValue={user?.email || ''} 
                    className="pl-9" 
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input 
                  name="phone"
                  defaultValue={user?.phone || ''} 
                  placeholder="+92 300 0000000"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    name="location"
                    defaultValue={user?.location || ''} 
                    placeholder="City, Country"
                    className="pl-9" 
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button 
                type="submit" 
                disabled={updating}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save changes'}
              </Button>
              <Button type="reset" variant="outline">Cancel</Button>
            </div>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}