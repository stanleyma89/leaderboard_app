<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('winners', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('points_at_win');
            $table->timestamp('declared_at');
            $table->timestamps();
            
            $table->index(['declared_at', 'points_at_win']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('winners');
    }
};
