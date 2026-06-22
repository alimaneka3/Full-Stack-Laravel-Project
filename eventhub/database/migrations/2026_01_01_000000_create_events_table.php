<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('location');
            $table->string('category');
            $table->integer('capacity');
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('status', ['Draft', 'Confirmed', 'Cancelled'])->default('Draft');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('events');
    }
};