import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactService } from "@/lib/contactService";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ 
    meta: [
      { title: "Contact — EventHub" }, 
      { name: "description", content: "Get in touch with the EventHub team in Lahore, Pakistan." }
    ] 
  }),
  component: Contact,
});

function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setLoading(true);
      await contactService.send({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string
      });
      
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent! We'll get back to you soon.");
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <section className="bg-gradient-hero py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">Contact <span className="text-gradient">us</span></h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">Questions, partnerships, or feedback — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {[
              { icon: MapPin, label: "Address", value: "UMT Lahore, Pakistan" },
              { icon: Phone, label: "Phone", value: "+92 300 0294915" },
              { icon: Mail, label: "Email", value: "info@eventhub.com" },
              { icon: Clock, label: "Office Hours", value: "Monday – Friday · 9 AM – 5 PM" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input 
                  id="name" 
                  name="name"
                  required 
                  placeholder="Your name" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  required 
                  placeholder="you@example.com" 
                />
              </div>
            </div>
            
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                name="subject"
                required 
                placeholder="How can we help?" 
              />
            </div>
            
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message"
                required 
                rows={6} 
                placeholder="Tell us a bit more…" 
              />
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> 
                {loading ? 'Sending...' : 'Send message'}
              </Button>
              <Button type="reset" variant="outline">Reset</Button>
            </div>
          </form>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border shadow-soft">
          <iframe 
            title="map" 
            src="https://www.google.com/maps?q=UMT+Lahore&output=embed" 
            className="h-96 w-full" 
            loading="lazy" 
          />
        </div>
      </section>
    </SiteShell>
  );
}