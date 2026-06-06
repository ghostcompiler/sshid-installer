<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PublicKeyController;
use Illuminate\Support\Facades\Route;

request()->isMethod('post') ? sleep(1) : null;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::controller(AuthController::class)->prefix('auth')->group(function () {
    Route::match(['get', 'post'], '/login', 'login')->name('login');
    Route::match(['get', 'post'], '/register', 'register')->name('register');
    Route::post('/logout', 'logout')->name('logout');
});

Route::controller(DashboardController::class)->middleware('auth')->prefix('dashboard')->group(function () {
    Route::get('/', 'index')->name('dashboard');
    Route::patch('/username', 'updateUsername')->name('dashboard.username.update');
    Route::post('/keys', 'storeKey')->name('dashboard.keys.store');
    Route::delete('/keys/{key}', 'destroyKey')->name('dashboard.keys.destroy');
});

Route::get('/{username}/install', [PublicKeyController::class, 'install'])
    ->where('username', '[A-Za-z0-9_-]+')
    ->name('public.install');

Route::get('/{username}.keys', [PublicKeyController::class, 'rawKeys'])
    ->where('username', '[A-Za-z0-9_-]+')
    ->name('public.raw-keys');

Route::get('/{username}', [PublicKeyController::class, 'keys'])
    ->where('username', '[A-Za-z0-9_-]+')
    ->name('public.keys');
