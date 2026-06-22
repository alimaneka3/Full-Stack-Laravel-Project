import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventService } from "@/lib/eventService";
import { toast } from "sonner";

export const Route = createFileRoute("/create-event")({
  head: () => ({ meta: [{ title: "Create Event — EventHub" }] }),
  component: CreateEvent,
});

function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setLoading(true);
      
      // Create FormData for file upload
      const eventData = new FormData();
      eventData.append('title', formData.get('title') as string);
      eventData.append('description', formData.get('description') as string);
      eventData.append('start_date', formData.get('start_date') as string);
      eventData.append('end_date', formData.get('end_date') as string);
      eventData.append('location', formData.get('location') as string);
      eventData.append('category', formData.get('category') as string);
      eventData.append('capacity', formData.get('capacity') as string);
      eventData.append('price', formData.get('price') as string);
      eventData.append('status', formData.get('status') as string);
      
      if (imageFile) {
        eventData.append('image', imageFile);
      }
      
      await eventService.create(eventData);
      toast.success('Event created successfully!');
      navigate({ to: '/event-management' });
    } catch (error: any) {
      console.error('Create event error:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
        toast.error(firstError);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <SiteShell>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Create a new <span className="text-gradient">event</span></h1>
        <p className="mt-2 text-muted-foreground">Fill in the details below. You can save as draft and publish later.</p>

        <form onSubmit={handleSubmit} className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Title</Label>
              <Input 
                name="title"
                required 
                placeholder="Event title" 
              />
            </div>
            
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea 
                name="description"
                required 
                rows={5} 
                placeholder="Tell attendees what to expect…" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Start date</Label>
              <Input 
                type="datetime-local" 
                name="start_date"
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>End date</Label>
              <Input 
                type="datetime-local" 
                name="end_date"
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input 
                name="location"
                required 
                placeholder="Venue / city" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue placeholder="Choose…" />
                </SelectTrigger>
                <SelectContent>
                  {["Conference", "Music", "Workshop", "Networking", "Sports", "Technology"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label>Capacity</Label>
              <Input 
                type="number" 
                name="capacity"
                min={1} 
                required 
                placeholder="e.g. 200" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Price (PKR)</Label>
              <Input 
                type="number" 
                name="price"
                min={0} 
                required 
                placeholder="0 for free" 
                step="0.01"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select name="status" defaultValue="Confirmed">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Cover image</Label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-accent/30 p-10 text-center transition hover:border-primary/60 hover:bg-accent/50">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <ImagePlus className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium">
                  {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create event'}
            </Button>
            <Button type="reset" variant="outline">Reset</Button>
          </div>
        </form>
      </section>
    </SiteShell>
  );
}