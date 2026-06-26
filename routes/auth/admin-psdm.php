<?php

use App\Http\Controllers\AdminPsdm\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['role:admin-psdm'])->group(function () {
    Route::get('admin-psdm/dashboard', [DashboardController::class, 'index'])->name('admin-psdm.dashboard');
});
