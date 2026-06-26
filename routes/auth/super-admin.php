<?php

use App\Http\Controllers\SuperAdmin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:super-admin'])->group(function () {
    Route::get('super-admin/dashboard', [DashboardController::class, 'index'])->name('super-admin.dashboard');
});
