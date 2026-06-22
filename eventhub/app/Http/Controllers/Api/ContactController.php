<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller {
    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string'
        ]);

        $contact = ContactMessage::create($validated);

        return response()->json(['message' => 'Message sent successfully'], 201);
    }

    public function adminAll() {
        return response()->json(ContactMessage::latest()->get());
    }

    public function markRead(ContactMessage $contact) {
        $contact->update(['status' => 'Read']);
        return response()->json($contact);
    }

    public function destroy(ContactMessage $contact) {
        $contact->delete();
        return response()->json(['message' => 'Deleted']);
    }
}