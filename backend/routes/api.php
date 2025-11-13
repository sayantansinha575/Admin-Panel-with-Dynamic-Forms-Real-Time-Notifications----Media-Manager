<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\FormController;
use App\Http\Controllers\Api\FormFieldController;
use App\Http\Controllers\Api\MediaController;

Route::get('/test', function () {
    return response()->json(['status' => 'API is working ✅']);
});


Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']); // ✅ Register new user
    Route::post('login', [AuthController::class, 'login']);       // ✅ Login and get JWT token
});

Route::middleware('auth:api')->group(function () {
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'show']);
    Route::post('notifications/mark-read/{id}', [NotificationController::class, 'markRead']);
    Route::apiResource('forms', FormController::class);
    Route::apiResource('forms.fields', FormFieldController::class)->shallow();
    Route::post('upload', [MediaController::class, 'store']);
    Route::get('media', [MediaController::class, 'index']);
    Route::delete('media/{id}', [MediaController::class, 'destroy']);
});

Route::post('/refresh', function () {
    return response()->json(['token' => JWTAuth::refresh()]);
});
