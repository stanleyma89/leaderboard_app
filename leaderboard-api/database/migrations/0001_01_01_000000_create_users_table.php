<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('age');
            $table->integer('points')->default(0)->unsigned();
            $table->text('address');
            $table->string('qr_code_path')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['points', 'name']);
            $table->index('name');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
