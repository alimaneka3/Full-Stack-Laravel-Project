<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('user', 'bookings')
            ->where('status', 'Confirmed')
            ->latest()
            ->get();
        return response()->json($events);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'location' => 'required|string',
            'category' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'status' => 'required|in:Draft,Confirmed,Cancelled',
            'image' => 'nullable|image|max:5120'
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('events', 'public');
        }

        $event = Event::create($validated);

        return response()->json($event, 201);
    }

    public function show(Event $event)
    {
        return response()->json($event->load(['user', 'bookings']));
    }

    public function update(Request $request, Event $event)
    {
        // Handle FormData with _method=PUT
        if ($request->has('_method') && $request->_method === 'PUT') {
            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date',
                'location' => 'sometimes|string',
                'category' => 'sometimes|string',
                'capacity' => 'sometimes|integer|min:1',
                'price' => 'sometimes|numeric|min:0',
                'status' => 'sometimes|in:Draft,Confirmed,Cancelled',
                'image' => 'nullable|image|max:5120'
            ]);

            if ($request->hasFile('image')) {
                if ($event->image) Storage::disk('public')->delete($event->image);
                $validated['image'] = $request->file('image')->store('events', 'public');
            }

            $event->update($validated);
            return response()->json($event->load(['user', 'bookings']));
        }

        // Regular JSON update
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after:start_date',
            'location' => 'sometimes|string',
            'category' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:Draft,Confirmed,Cancelled'
        ]);

        $event->update($validated);
        return response()->json($event->load(['user', 'bookings']));
    }

    public function destroy(Event $event)
    {
        if ($event->image) Storage::disk('public')->delete($event->image);
        $event->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    public function myEvents(Request $request)
    {
        $events = Event::where('user_id', $request->user()->id)
            ->with('bookings')
            ->latest()
            ->get();
        return response()->json($events);
    }
}