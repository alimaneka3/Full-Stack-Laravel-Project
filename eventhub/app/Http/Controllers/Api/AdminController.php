<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_events' => Event::count(),
            'total_bookings' => Booking::count(),
            'total_revenue' => Booking::where('status', 'Confirmed')->sum('amount'),
        ]);
    }

    public function users()
    {
        return response()->json(User::all());
    }

    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'sometimes|in:admin,organiser,attendee',
            'is_approved' => 'sometimes|boolean'
        ]);
        $user->update($validated);
        return response()->json($user);
    }

    public function deleteUser(User $user)
    {
        // Don't allow deleting admin users
        if ($user->role === 'admin') {
            return response()->json(['message' => 'Cannot delete admin user'], 403);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function adminEvents()
    {
        return response()->json(Event::with('user')->latest()->get());
    }

    public function adminBookings()
    {
        return response()->json(Booking::with(['user', 'event'])->latest()->get());
    }

    public function deleteEvent(Event $event)
    {
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }
}