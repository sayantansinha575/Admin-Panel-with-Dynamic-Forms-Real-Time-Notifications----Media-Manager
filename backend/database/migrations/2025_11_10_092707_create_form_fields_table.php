<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_fields', function (Blueprint $t) {
            $t->id();
            $t->foreignId('form_id')->constrained()->onDelete('cascade');
            $t->string('type'); // text, number, date, email, dropdown, checkbox
            $t->string('label');
            $t->json('options')->nullable(); // for dropdown, checkbox {options: [...]}
            $t->integer('order')->default(0);
            $t->json('validation')->nullable();
            $t->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_fields');
    }
};
