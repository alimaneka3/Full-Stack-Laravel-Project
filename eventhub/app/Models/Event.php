<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'start_date', 'end_date',
        'location', 'category', 'capacity', 'price', 'status', 'image'
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'price' => 'decimal:2'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function bookings() {
        return $this->hasMany(Booking::class);
    }
}