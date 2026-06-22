<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder {
    public function run(): void {
        // Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@eventhub.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_approved' => true
        ]);

        // Organiser
        $organiser = User::create([
            'name' => 'Organiser User',
            'email' => 'organiser@eventhub.com',
            'password' => Hash::make('password'),
            'role' => 'organiser',
            'is_approved' => true
        ]);

        // Attendee
        $attendee = User::create([
            'name' => 'Attendee User',
            'email' => 'attendee@eventhub.com',
            'password' => Hash::make('password'),
            'role' => 'attendee',
            'is_approved' => true
        ]);

        // Events
        $events = [
            [
                'user_id' => $organiser->id,
                'title' => 'Tech Conference 2026',
                'description' => 'Join the biggest tech conference of the year.',
                'start_date' => now()->addDays(10),
                'end_date' => now()->addDays(11),
                'location' => 'Lahore, Pakistan',
                'category' => 'Technology',
                'capacity' => 100,
                'price' => 2500,
                'status' => 'Confirmed',
                'image' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'
            ],
            [
                'user_id' => $organiser->id,
                'title' => 'Music Festival 2026',
                'description' => 'Experience the best music festival in town.',
                'start_date' => now()->addDays(20),
                'end_date' => now()->addDays(21),
                'location' => 'Islamabad, Pakistan',
                'category' => 'Music',
                'capacity' => 500,
                'price' => 1500,
                'status' => 'Confirmed',
                'image' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'
            ],
            [
                'user_id' => $organiser->id,
                'title' => 'Business Networking',
                'description' => 'Connect with industry leaders and entrepreneurs.',
                'start_date' => now()->addDays(5),
                'end_date' => now()->addDays(5),
                'location' => 'Karachi, Pakistan',
                'category' => 'Networking',
                'capacity' => 50,
                'price' => 0,
                'status' => 'Confirmed',
                'image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
            ]
        ];

        foreach ($events as $event) {
            Event::create($event);
        }

        // Bookings
        $events = Event::all();
        foreach ($events as $event) {
            Booking::create([
                'user_id' => $attendee->id,
                'event_id' => $event->id,
                'reference' => 'EVT-2026-' . strtoupper(substr(md5(rand()), 0, 7)),
                'status' => 'Confirmed',
                'paid' => true,
                'amount' => $event->price
            ]);
        }

        // Contact Messages
        \App\Models\ContactMessage::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'subject' => 'Test Message',
            'message' => 'This is a test message',
            'status' => 'Unread'
        ]);
    }
}