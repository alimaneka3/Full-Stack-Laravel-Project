<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id'
        ]);

        $event = Event::find($validated['event_id']);

        // Check capacity
        $bookedCount = Booking::where('event_id', $event->id)
            ->where('status', 'Confirmed')
            ->count();

        if ($bookedCount >= $event->capacity) {
            return response()->json(['message' => 'Event is fully booked'], 422);
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'event_id' => $event->id,
            'reference' => 'EVT-' . date('Y') . '-' . Str::upper(Str::random(7)),
            'status' => 'Confirmed',
            'paid' => $event->price > 0 ? false : true,
            'amount' => $event->price
        ]);

        // Return the booking with fresh event data including bookings count
        $booking->load('event');
        
        return response()->json([
            'booking' => $booking,
            'event' => $event->fresh()->load('bookings')
        ], 201);
    }

    public function myBookings(Request $request)
    {
        $bookings = Booking::with('event')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
        return response()->json($bookings);
    }

    public function cancel(Request $request, Booking $booking)
    {
        // Check if the booking belongs to the authenticated user
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->update(['status' => 'Cancelled']);
        
        // Return with fresh event data
        $booking->load('event');
        return response()->json([
            'booking' => $booking,
            'event' => $booking->event->fresh()->load('bookings')
        ]);
    }

    public function adminAll()
    {
        $bookings = Booking::with(['user', 'event'])->latest()->get();
        return response()->json($bookings);
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Confirmed,Cancelled'
        ]);
        $booking->update($validated);
        $booking->load('event');
        return response()->json([
            'booking' => $booking,
            'event' => $booking->event->fresh()->load('bookings')
        ]);
    }
}