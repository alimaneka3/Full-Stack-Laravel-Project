<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\AdminController;
use Illuminate\Support\Facades\Route;

// Password reset routes
Route::post('/forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::post('/contact', [ContactController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Events
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    Route::get('/my-events', [EventController::class, 'myEvents']);

    // Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::put('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

     // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::put('/admin/users/{user}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']); // ← For reject
        Route::get('/admin/events', [AdminController::class, 'adminEvents']);
        Route::delete('/admin/events/{event}', [AdminController::class, 'deleteEvent']);
        Route::get('/admin/bookings', [AdminController::class, 'adminBookings']);
        Route::get('/admin/contact-messages', [ContactController::class, 'adminAll']);
        Route::put('/admin/contact-messages/{contact}', [ContactController::class, 'markRead']);
        Route::delete('/admin/contact-messages/{contact}', [ContactController::class, 'destroy']);
    });
});