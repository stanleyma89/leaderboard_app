<?php

use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::apiResource('users', UserController::class);
    
    Route::patch('users/{user}/points/increment', [UserController::class, 'incrementPoints']);
    Route::patch('users/{user}/points/decrement', [UserController::class, 'decrementPoints']);
    
    Route::get('users-grouped-by-score', [UserController::class, 'groupedByScore']);
});
