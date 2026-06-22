<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('event_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique();
            $table->enum('status', ['Pending', 'Confirmed', 'Cancelled'])->default('Pending');
            $table->boolean('paid')->default(false);
            $table->decimal('amount', 10, 2)->default(0);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('bookings');
    }
};