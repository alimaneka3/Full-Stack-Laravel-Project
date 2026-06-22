import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventService } from "@/lib/eventService";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/edit-event/$eventId")({
  head: () => ({ meta: [{ title: "Edit Event — Admin" }] }),
  loader: async ({ params }) => {
    try {
      const event = await eventService.getById(params.eventId);
      return { event };
    } catch (error) {
      throw notFound();
    }
  },
  component: EditEvent,
});

function EditEvent() {
  const { event } = Route.useLoaderData();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setLoading(true);
      
      const eventData: any = {
        title: formData.get('title'),
        description: formData.get('description'),
        start_date: formData.get('start_date'),
        end_date: formData.get('end_date'),
        location: formData.get('location'),
        category: formData.get('category'),
        capacity: formData.get('capacity'),
        price: formData.get('price'),
        status: formData.get('status'),
      };

      // If there's a new image, use FormData
      if (imageFile) {
        const formDataWithImage = new FormData();
        Object.keys(eventData).forEach(key => {
          formDataWithImage.append(key, eventData[key]);
        });
        formDataWithImage.append('image', imageFile);
        formDataWithImage.append('_method', 'PUT');
        await eventService.update(event.id, formDataWithImage);
      } else {
        await eventService.update(event.id, eventData);
      }
      
      toast.success('Event updated successfully!');
      navigate({ to: '/admin/events' });
    } catch (error: any) {
      console.error('Update event error:', error);
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
        toast.error(firstError);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update event. Please try again.');
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
    <AdminShell title="Edit Event" subtitle={`Editing: ${event.title}`}>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <div className="mb-6">
          <Link to="/admin/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Title</Label>
              <Input 
                name="title"
                defaultValue={event.title}
                required 
                placeholder="Event title" 
              />
            </div>
            
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Description</Label>
              <Textarea 
                name="description"
                defaultValue={event.description}
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
                defaultValue={event.start_date?.replace('Z', '')}
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>End date</Label>
              <Input 
                type="datetime-local" 
                name="end_date"
                defaultValue={event.end_date?.replace('Z', '')}
                required 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input 
                name="location"
                defaultValue={event.location}
                required 
                placeholder="Venue / city" 
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select name="category" defaultValue={event.category}>
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
                defaultValue={event.capacity}
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
                defaultValue={event.price}
                min={0} 
                required 
                placeholder="0 for free" 
                step="0.01"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select name="status" defaultValue={event.status}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label>Cover image</Label>
              {event.image && (
                <div className="mb-2">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="h-32 w-48 rounded-lg object-cover"
                  />
                </div>
              )}
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-accent/30 p-10 text-center transition hover:border-primary/60 hover:bg-accent/50">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                  <ImagePlus className="h-5 w-5" />
                </span>
                <p className="text-sm font-medium">
                  {imageFile ? imageFile.name : 'Click to upload new image or drag and drop'}
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
              {loading ? 'Saving...' : 'Update event'}
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/events">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}